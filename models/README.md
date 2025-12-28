# Data Models — Application V2 (Foundry VTT v13+)

Les Data Models définissent la structure du champ `system` des Documents (`Actor`, `Item`, etc).
En **App V2**, les modèles ne sont plus déclarés dans `template.json` mais via une classe qui hérite de `foundry.abstract.TypeDataModel`.

## Règle fondamentale
Chaque type de Document (Actor / Item) possède **son propre modèle**.
Si un système définit deux types d’Actors, il doit définir deux modèles distincts.

## Schéma minimal (ex. pour un type Actor : character)

```js
// systems/example/models/character.js
export default class ExampleCharacterModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      exampleField: new fields.StringField({ initial: "" })
    };
  }
}
```

- La méthode `defineSchema()` déclare les champs accessibles via `actor.system`.
- Aucun constructeur n’est nécessaire : Foundry instancie automatiquement le modèle.

## Enregistrement des modèles
Dans `system.js` (chargé via esmodules dans `system.json`) :

```js
import ExampleCharacterModel from "./models/character.js";

Hooks.once("init", () => {
  CONFIG.Actor.dataModels.character = ExampleCharacterModel;
});
```

## Ce que ExampleCharacterModel devient

Une fois le modèle enregistré `actor.system.exampleField` est directement accessible dans :
- Les feuilles `this.document.system.exampleField`
- Les macros `actor.system.exampleField`
- Les templates Handlebars `{{system.exampleField}}`
