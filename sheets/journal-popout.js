export class SUIQJournalPopout extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  static DEFAULT_OPTIONS = {
    id: "suiq-journal-popout",
    window: {
      title: "Journal Page",
      icon: "fa-solid fa-book",
      frame: true,
      resizable: true,
      minimize: false,
      controls: []
    },
    position: { width: 800, height: "auto" },
    classes: ["suiq-journal-popout"],
  };

  static PARTS = {
    body: { template: "systems/shut-up-its-quantum/templates/apps/journal-popout.hbs" }
  };

  constructor(page, options = {}) {
    super(options);
    this.page = page;
    this._onClosed = options.onClosed ?? null;
  }

  get title() {
    const journalName = this.page?.parent?.name ?? "Journal";
    return `Journal page from ${journalName}`;
  }

  async _prepareContext(options) {

    const page = this.page;
    const type = page.type;

    if (type === "text") {

      let content;

      if (page.text.format === 1) {
        content = page.text.content;
      } 
      else {
        content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
          page.text.content,
          { secrets: true, async: true, relativeTo: page }
        );
      }

      return {
        title: page.name,
        type: "text",
        content
      };
    }

    if (type === "image") {
      return {
        title: page.name,
        type: "image",
        src: page.src,
        caption: page.image?.caption ?? ""
      };
    }

    if (type === "video") {
      return {
        title: page.name,
        type: "video",
        src: page.video?.src,
        autoplay: !!page.video?.autoplay,
        loop: !!page.video?.loop,
        controls: !!page.video?.controls
      };
    }

    return {
      title: page.name,
      type: "unknown",
      content: `<p>[Unsupported page type: ${type}]</p>`
    };
  }

  async close(options = {}) {
    await super.close(options);

    if (typeof this._onClosed === "function") {
      try {
        this._onClosed(this.page);
      } catch (e) {
        console.error("SUIQ | onClosed callback failed", e);
      }
    }
  }

  _renderHTML(context, options) {
  return super._renderHTML(context, options);
  }

}
