export default class SUIQCharacterModel extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;

    return {

      /** Identité visible (ex: "Max Collapse") */
      identity: new fields.HTMLField({ initial: "", required: false, blank: true }),

      /** Occupation 1 */
      occupationA: new fields.StringField({ initial: "" }),

      /** Occupation 2 */
      occupationB: new fields.StringField({ initial: "" }),

      /** Trait absurde unique */
      uniqueTrait: new fields.StringField({ initial: "" }),

      /** Notes libres */
      notes: new fields.HTMLField({ initial: "", required: false, blank: true }),

      /**
       * État quantique (superposé par défaut)
       * collapsed-A ou collapsed-B = effondré
       */
      quantumState: new fields.StringField({
        initial: "superposed",
        required: true,
        nullable: false,
        choices: ["superposed", "collapsed-A", "collapsed-B"]
      })
    };
  }

  /** Occupation active selon l'état quantique */
  get activeOccupation() {
    switch (this.quantumState) {
      case "collapsed-A": return this.occupationA;
      case "collapsed-B": return this.occupationB;
      default: return `${this.occupationA} / ${this.occupationB}`;
    }
  }
}
