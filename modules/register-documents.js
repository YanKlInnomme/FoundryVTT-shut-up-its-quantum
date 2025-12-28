import SUIQActor from "../documents/actor.js";
import SUIQItem from "../documents/item.js";

import SUIQCharacterModel from "../models/character.js";
import SUIQInferenceModel from "../models/inference.js";
import SUIQArtifactModel from "../models/artifact.js";

import SUIQCharacterSheet from "../sheets/character-sheet.js";
import SUIQInferenceSheet from "../sheets/inference-sheet.js";
import SUIQArtifactSheet from "../sheets/artifact-sheet.js";

export function registerSUIQDocuments(systemId) {

  // Classes Actor + DataModels
  CONFIG.Actor.documentClass = SUIQActor;
  CONFIG.Actor.dataModels = {
    character: SUIQCharacterModel,
    inference: SUIQInferenceModel
  };

  // Classes Item + DataModels
  CONFIG.Item.documentClass = SUIQItem;
  CONFIG.Item.dataModels = {
    artifact: SUIQArtifactModel
  };

  // Suppression des feuilles par défaut de Foundry VTT
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);

  // Enregistrement des feuilles personnalisées
  foundry.documents.collections.Actors.registerSheet(systemId, SUIQCharacterSheet, { types: ["character"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet(systemId, SUIQInferenceSheet, { types: ["inference"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(systemId, SUIQArtifactSheet, { types: ["artifact"], makeDefault: true });
}
