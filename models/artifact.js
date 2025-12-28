export default class SUIQArtifactModel extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["SUIQ.Sheets.Artefact"];

  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      /** Description narrative */
      description: new fields.HTMLField({ initial: "", required: false, blank: true }),

      /** Effet synthétique */
      effect: new fields.HTMLField({ initial: "", required: false, blank: true }),

      /** UUID d’une table aléatoire Foundry */
      rollTableUuid: new fields.StringField({ initial: "", required: false })
    };
  }
}
