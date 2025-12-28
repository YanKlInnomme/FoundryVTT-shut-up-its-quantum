export default class SUIQActor extends Actor {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    if (data.type === "character") {
      this.updateSource({
        prototypeToken: {
          actorLink: true,
          disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
          sight: { enabled: true }
        }
      });
    }
  }
}
