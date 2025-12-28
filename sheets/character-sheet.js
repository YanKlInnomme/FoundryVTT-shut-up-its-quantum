import { ARTIFICIAL_VARIANT } from "../models/artificial-variant.js";
import { extractImageFromJournal } from "../modules/helpers.js";

const { sheets } = foundry.applications;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export default class SUIQCharacterSheet extends HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["shut-up-its-quantum", "sheet", "actor", "character"],
    position: { width: 750, height: "auto" },
    form: { submitOnChange: true },
    window: { resizable: true },
    actions: {
      ...super.DEFAULT_OPTIONS.actions,
      roll2d8: SUIQCharacterSheet.#onRoll2d8
    }
  };

  static PARTS = {
    body: { template: "systems/shut-up-its-quantum/templates/actors/character.hbs" }
  };

  get title() { return ""; }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#updateHeaderTitle();
    this.#bindLegendHintToggles();
    this.#setQuantumStateDataset();
    await this.#applyArtificialVariantBackground();
  }

  async minimize() {
    await super.minimize();
    this.#updateHeaderTitle();
  }

  async maximize() {
    await super.maximize();
    this.#updateHeaderTitle();
  }

  async #applyArtificialVariantBackground() {
    const actor = this.document;
    const identityRaw = actor._stats?.compendiumSource || actor.uuid;
    const identityKey = btoa(btoa(identityRaw));
    const variant = ARTIFICIAL_VARIANT.find((v) => v.A === identityKey);
    if (!variant) return;

    const journalKey = atob(atob(variant.B));
    const img = await extractImageFromJournal(journalKey);
    if (!img) return;

    this.element?.style?.setProperty("--suiq-dynamic-bg", `url("${img}")`);
  }

  #updateHeaderTitle() {
    const h1 = this.element?.querySelector(".window-title");
    if (!h1) return;

    if (this.minimized) {
      h1.textContent = this.document.name ?? "";
      h1.style.opacity = "1";
    } else {
      h1.style.opacity = "0";
      h1.textContent = "";
    }
  }

  #bindLegendHintToggles() {
    const el = this.element;
    if (!el) return;

    el.querySelectorAll("fieldset legend").forEach((legend) => {
      if (legend.dataset.hintToggleBound === "1") return;
      legend.dataset.hintToggleBound = "1";

      legend.addEventListener("click", (event) => {
        event.currentTarget.closest("fieldset")?.classList.toggle("show-hint");
      });
    });
  }

  #setQuantumStateDataset() {
    if (!this.element) return;
    this.element.dataset.quantumState = this.document.system.quantumState;
  }

  static async #onRoll2d8() {
    const actor = this.actor;
    const roll = await new Roll("2d8").roll();
    const total = roll.total;

    let category;
    let description;

    if (total <= 4) {
      category = game.i18n.localize("SUIQ.Roll.Result.Catastrophe");
      description = game.i18n.localize("SUIQ.Roll.Desc.Catastrophe");
    } else if (total <= 8) {
      category = game.i18n.localize("SUIQ.Roll.Result.Erasure");
      description = game.i18n.localize("SUIQ.Roll.Desc.Erasure");
    } else if (total <= 12) {
      category = game.i18n.localize("SUIQ.Roll.Result.StrangeSuccess");
      description = game.i18n.localize("SUIQ.Roll.Desc.StrangeSuccess");
    } else if (total <= 15) {
      category = game.i18n.localize("SUIQ.Roll.Result.ImprobableSuccess");
      description = game.i18n.localize("SUIQ.Roll.Desc.ImprobableSuccess");
    } else {
      category = game.i18n.localize("SUIQ.Roll.Result.DoubleInfinity");
      description = game.i18n.localize("SUIQ.Roll.Desc.DoubleInfinity");
    }

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `
        <div class="suiq-roll">
          <h2>${category}</h2>
          <p>${description}</p>
        </div>
      `
    });

    if (total !== 16) return;

    const uuid = game.i18n.lang.startsWith("fr")
      ? "Compendium.shut-up-its-quantum.tables-aleatoires-and-cie.RollTable.8d7LWXcAYP6n2GsD"
      : "Compendium.shut-up-its-quantum.random-tables-and-co.RollTable.0NHuvTFaRJvIgPWv";

    const table = await fromUuid(uuid).catch(() => null);
    if (!table) {
      ui.notifications.error(`⚠ Table introuvable : ${uuid}`);
      return;
    }

    await table.draw({ displayChat: true });
  }

  async _prepareContext(options = {}) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      actor: this.document,
      system: this.document.system,
      systemFields: this.document.system.constructor.schema.fields,
      fields: this.document.constructor.schema.fields,
      source: this.document.toObject()
    });

    context.showRollButton = true;
    context.rollLabel = game.i18n.localize("SUIQ.Roll.TwoD8Label");
    context.rollTooltip = game.i18n.localize("SUIQ.Roll.TwoD8Tooltip");
    context.rollAction = "roll2d8";

    context.systemFields.quantumState.choices = {
      superposed: {
        label: game.i18n.localize("SUIQ.Sheets.Character.OccupationStateSuperposed")
      },
      "collapsed-A": { label: context.system.occupationA },
      "collapsed-B": { label: context.system.occupationB }
    };

    return context;
  }
}
