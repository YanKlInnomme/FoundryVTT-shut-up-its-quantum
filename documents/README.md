# Documents — Application V2 (Foundry VTT v13+)

Les classes Documents (`Actor`, `Item`, etc) définissent le comportement, pas la structure.
- La structure est dans les Data Models
- Le comportement (logique, hooks, réactions) est ici.

## Règle fondamentale
Un Document **ne définit jamais les champs du système**.
Ceux-ci viennent **exclusivement** des Data Models.

## Schéma minimal : Actor

```js
// systems/example/documents/actor.js
export default class ExampleActor extends Actor {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Exemple de configuration du prototype token
    if (data.type === "character") {
      this.updateSource({
        prototypeToken: {
          actorLink: true,
          sight: { enabled: true }
        }
      });
    }
  }
}
```

## Schéma minimal : Item

```js
// systems/example/documents/item.js
export default class ExampleItem extends Item {
}
```

## Enregistrement
Dans `system.js` (chargé via esmodules dans `system.json`) :

```js
import ExampleActor from "./documents/actor.js";
import ExampleItem from "./documents/item.js";

Hooks.once("init", () => {
  CONFIG.Actor.documentClass = ExampleActor;
  CONFIG.Item.documentClass = ExampleItem;
});
```