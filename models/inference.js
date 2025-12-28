export default class SUIQInferenceModel extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["SUIQ.Sheets.Inference"];

  static defineSchema() {
    const fields = foundry.data.fields;

    return {

      /** Objectif premier de l'inférence */
      objective: new fields.StringField({ initial: "" }),

      /** Description narrative détaillée */
      description: new fields.HTMLField({ initial: "", required: false, blank: true }),

      /** Effet sur la réalité */
      effect: new fields.HTMLField({ initial: "", required: false, blank: true })
    };
  }
}
