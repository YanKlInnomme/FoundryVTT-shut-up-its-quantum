import { sendQuantumMessage } from "./quantum-fragments.js";
import { dissolveMessage } from "./quantum-dissolve.js";

export const QUANTUM_THRESHOLDS = [8, 28, 48, 62, 88, 108];
export const QUANTUM_INTEGRAL_ID = {fr:"UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1Uk5ERjBURVJvTkdOcFlXSlNURmxYTGtwdmRYSnVZV3hGYm5SeWVWQmhaMlV1UVd4SmMzUTRkblJOU2pKQ2VsY3dPUT09",en:"UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM0d2QyUldTSFpJWjJ4SU5teFJZMjVDTGtwdmRYSnVZV3hGYm5SeWVWQmhaMlV1TTJSeWVYaHVRamxTV2s5b2RVSjJOQT09"};
export const testQuantumSync = [[()=>"fr"===game.i18n.lang,["UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExtMWhZM0p2Y3k1TllXTnlieTVEVWt0MFNYTlFlVVJwVkZsbVJXdHc=","UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1VFNIbG9OMFZwTW0xUVNtVjVWWGd5","UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa0ZqZEc5eUxrZzJSVmxITTNsR1VUUk9OV3Q0U1VnPQ=="]],[()=>"en"===game.i18n.lang,["UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExtMWhZM0p2Y3k1TllXTnlieTU0V0RjME1sUmFUemx1ZVdzMWNtdDM=","UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1S2VqZGFXVkJ4UVRoalRVMU5ibnA1","UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa0ZqZEc5eUxrOVNRV0V4V0ZOR00yNUJXR3gxUVdZPQ=="]],[()=>game.settings.get("shut-up-its-quantum","quantumΞ")>=3,["UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa0ZqZEc5eUxsWk9ibTFRV1VjemEyTTJNRGxrVVdZPQ=="]],[()=>4===game.settings.get("shut-up-its-quantum","quantumΞ")&&"fr"===game.i18n.lang,["UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1Uk5ERjBURVJvTkdOcFlXSlNURmxY"]],[()=>4===game.settings.get("shut-up-its-quantum","quantumΞ")&&"en"===game.i18n.lang,["UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM0d2QyUldTSFpJWjJ4SU5teFJZMjVD"]]];

async function sendTimedQuantumMessage(uuid) {
  const msg = await sendQuantumMessage(uuid, "Franz S.");
  if (msg) dissolveMessage(msg, 8000, 1200);
}

async function advanceThresholdProgress(systemId, uuid, nextIndex) {
  const used     = game.settings.get(systemId,"quantumℰ")||[];
  const progress = game.settings.get(systemId,"quantum⇑")||[];

  if(nextIndex === QUANTUM_THRESHOLDS.length-1)
    await game.settings.set(systemId,"quantumℰ",[...used,uuid]);

  await game.settings.set(systemId,"quantum⇑",[...progress, QUANTUM_THRESHOLDS[nextIndex]]);
}

export async function checkQuantumThresholds(systemId) {
  const Ω = game.settings.get(systemId,"quantumΩ")||0;
  const used = game.settings.get(systemId,"quantumℰ")||[];

  const lang = game.i18n.lang.startsWith("fr")? "fr" : "en";
  let uuid;
  try { 
    uuid = atob(atob(QUANTUM_INTEGRAL_ID[lang])); 
  } catch { 
    return console.warn("UUID decode failed → QUANTUM_INTEGRAL_ID");
  }

  if(used.includes(uuid)||used.includes("all")) return;

  const progress = game.settings.get(systemId,"quantum⇑")||[];
  let nextIndex  = progress.length;

  if(nextIndex >= QUANTUM_THRESHOLDS.length) return;
  if(Ω < QUANTUM_THRESHOLDS[nextIndex]) return;

  await sendTimedQuantumMessage(uuid);
  await advanceThresholdProgress(systemId, uuid, nextIndex);
}

