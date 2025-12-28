const { HandlebarsApplicationMixin } = foundry.applications.api;
const { DragDrop, TextEditor } = foundry.applications.ux;

export default class SUIQArtifactSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["shut-up-its-quantum", "item", "artifact"],
    position: { width: 750, height: "auto" },
    form: { submitOnChange: true },
    window: { resizable: true },
    actions: {
      ...super.DEFAULT_OPTIONS.actions,
      "roll-linked-table": SUIQArtifactSheet.#onRollLinkedTable
    }
  };

  static PARTS = {
    body: { template: "systems/shut-up-its-quantum/templates/items/artifact.hbs" }
  };

  get title() { return ""; }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#updateHeaderTitle();
    this.#bindLegendHintToggles();
    this.#activateDragDrop();
  }

  async minimize() {
    await super.minimize();
    this.#updateHeaderTitle();
  }

  async maximize() {
    await super.maximize();
    this.#updateHeaderTitle();
  }

  #updateHeaderTitle() {
    const h1 = this.element?.querySelector(".window-title");
    if (!h1) return;

    if (this.minimized) {
      h1.textContent = this.document.name ?? "";
      h1.style.opacity = "1";
    } else {
      h1.textContent = "";
      h1.style.opacity = "0";
    }
  }

  #bindLegendHintToggles() {
    const el = this.element;
    if (!el) return;

    el.querySelectorAll("fieldset legend").forEach((legend) => {
      if (legend.dataset.hintToggleBound === "1") return;
      legend.dataset.hintToggleBound = "1";

      legend.addEventListener("click", (ev) => {
        ev.currentTarget.closest("fieldset")?.classList.toggle("show-hint");
      });
    });
  }

  #activateDragDrop() {
    const el = this.element;
    if (!el) return;
    if (el.dataset.dragDropBound === "1") return;
    el.dataset.dragDropBound = "1";

    new DragDrop.implementation({
      dragSelector: ".draggable",
      dropSelector: ".suiq-artifact",
      permissions: {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this)
      },
      callbacks: {
        drop: this._onDrop.bind(this)
      }
    }).bind(el);
  }

  _canDragStart() { return this.isEditable; }
  _canDragDrop() { return this.isEditable; }

  async _onDrop(event) {
    event.preventDefault();
    if (event.target?.closest?.(".editor, .ProseMirror")) return;

    const data = TextEditor.implementation.getDragEventData(event);
    const allowed = Hooks.call("dropItemSheetData", this.item ?? this.document, this, data);
    if (allowed === false) return;

    if (data?.type !== "RollTable" || !data.uuid) return;

    const table = await fromUuid(data.uuid).catch(() => null);
    if (!table) {
      ui.notifications.error(game.i18n.localize("SUIQ.Sheets.Artifact.TableNotFound"));
      return;
    }

    await this.document.update({ "system.rollTableUuid": table.uuid });
    ui.notifications.info(
      `${game.i18n.localize("SUIQ.Sheets.Artifact.LinkedTable")} : ${table.name}`
    );
  }

  static async #onRollLinkedTable(event, target) {
    const item = this.item ?? this.document;
    const uuid = item?.system?.rollTableUuid;

    if (!uuid) {
      ui.notifications.warn(game.i18n.localize("SUIQ.Sheets.Artifact.NoLinkedTable"));
      return;
    }

    const table = await fromUuid(uuid).catch(() => null);
    if (!table) {
      ui.notifications.error(game.i18n.localize("SUIQ.Sheets.Artifact.TableNotFound"));
      return;
    }

    return table.draw({ displayChat: true });
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const sys = this.document.system;

    Object.assign(context, {
      system: sys,
      systemFields: this.document.system.constructor.schema.fields,
      fields: this.document.constructor.schema.fields
    });

    if (sys.rollTableUuid) {
      const tbl = await fromUuid(sys.rollTableUuid).catch(() => null);
      if (tbl) context.linkedTable = { name: tbl.name, formula: tbl.formula ?? "1d20" };
    }

    return context;
  }
}
