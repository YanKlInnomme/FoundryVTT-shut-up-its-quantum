const { HandlebarsApplicationMixin } = foundry.applications.api;
const { sheets } = foundry.applications;

export default class SUIQInferenceSheet extends HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["shut-up-its-quantum", "actor", "inference"],
    position: { width: 750, height: "auto" },
    form: { submitOnChange: true },
    window: { resizable: true },
  };

  static PARTS = {
    body: {
      template: "systems/shut-up-its-quantum/templates/actors/inference.hbs"
    }
  };

  get title() { return ""; }

  #updateHeaderTitle() {
    const el = this.element;
    if (!el) return;
    const h1 = el.querySelector(".window-title");
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

    el.querySelectorAll("fieldset legend").forEach(legend => {
      if (legend.dataset.hintToggleBound === "1") return;
      legend.dataset.hintToggleBound = "1";

      legend.addEventListener("click", (event) => {
        const fieldset = event.currentTarget.closest("fieldset");
        fieldset?.classList.toggle("show-hint");
      });
    });
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      actor: this.document,
      system: this.document.system,
      systemFields: this.document.system.constructor.schema.fields,
      fields: this.document.constructor.schema.fields,
      source: this.document.toObject()
    });

    context.showRollButton = false;
    context.rollLabel = false;
    context.rollTooltip = false;
    context.rollAction = false;

    return context;
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.#updateHeaderTitle();
    this.#bindLegendHintToggles();
  }

  async minimize() { await super.minimize(); this.#updateHeaderTitle(); }
  async maximize() { await super.maximize(); this.#updateHeaderTitle(); }
}
