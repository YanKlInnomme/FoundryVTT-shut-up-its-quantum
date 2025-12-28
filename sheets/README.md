# Sheets — Application V2 (Foundry VTT v13+)

Les **Sheets** définissent l’interface utilisateur des Documents (`Actor`, `Item`, etc.).
En **App V2**, les feuilles n’héritent plus de `ActorSheet` ou `ItemSheet` (App V1), mais la feuille est un **composition UI** :
- `DEFAULT_OPTIONS` configure la fiche (classes CSS, largeur, etc.)
- `PARTS` décrit les templates Handlebars utilisés
- La propriété `document` donne accès au Document associé (ex : Actor)

## Règle fondamentale
Une feuille **n’affiche** que les données définies par le **Data Model** (system.*)
Les Sheets ne définissent **aucune donnée** elles-mêmes.

## Schéma minimal (ex. pour une Feuille d’Actor : character)

```js
// systems/example/sheets/character-sheet.js
const { sheets } = foundry.applications
const { HandlebarsApplicationMixin } = foundry.applications.api

export default class ExampleCharacterSheet extends HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["example", "actor", "character"],
    position: { width: 750, height: 800 },
    form: { submitOnChange: true },
    window: { resizable: true }
  };

  static PARTS = {
    header: "systems/example/templates/actors/character-header.hbs",
    body: "systems/example/templates/actors/character-body.hbs"
  };

  get document() {
    return this.object;
  }
}
```

## Exemple de template Handlebars

```html
<!-- systems/example/templates/actors/character-header.hbs -->
<div class="standard-form character-header">
  <img class="character-img" src="{{actor.img}}" data-edit="img" data-action='editImage' data-tooltip="{{actor.name}}" />
  <div class="character-details">
    <div class="character-name">{{formInput fields.name value=source.name }}</div>
    <fieldset>
      <legend>{{localize "EXAMPLE.Labels.details"}}</legend>
      {{#unless electricBastionland}}
        {{formGroup systemFields.level value=system.level localize=true }}
      {{/unless}}
      {{formGroup systemFields.deprived value=system.deprived dataset=data.deprived }}
      {{formGroup systemFields.critical value=system.critical dataset=data.critical }}
    </fieldset>
  </div>
</div>
```

Note : `system.level`, `system.deprived` et `system.critical` viennent du Data Model.

## Enregistrement de la feuille
Dans `system.js` (chargé via esmodules dans `system.json`) :
```js
import ExampleCharacterSheet from "./sheets/character-sheet.js";

Hooks.once("init", () => {
  Actors.registerSheet("example", ExampleCharacterSheet, {
    types: ["character"], // Le type défini dans `documentTypes` du system.json
    makeDefault: true
  });
});
```