import { QUANTUM_E_MAP, ID_INDEX } from "../models/quantum-e-map.js";

export const QUANTUM_E_KEYS = ["quantumℰ1", "quantumℰ2", "quantumℰ3"];
export const voidIndex = ID_INDEX.map(e => atob(atob(e)));

export async function updateQuantumE(systemId, name) {
  const lang = game.i18n.lang.startsWith("fr") ? "fr" : "en";
  const lists = QUANTUM_E_MAP[name];
  if (!lists) return;

  const encodedList = lists[lang] ?? [];
  const decodedList = encodedList.map(v => {
    try { return atob(atob(v)); }
    catch(e) { return null; }
  }).filter(Boolean);

  await game.settings.set(systemId, name, decodedList);
}

export async function updateAllQuantumE(systemId) {
  for (const key of QUANTUM_E_KEYS) {
    await updateQuantumE(systemId, key);
  }
}
