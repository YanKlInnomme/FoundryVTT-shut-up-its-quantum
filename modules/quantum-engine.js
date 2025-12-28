import { revealJournalPage, revealQuantumVision } from "./quantum-xi.js";

const ħ = ( Math.PI * ((1 + Math.sqrt(5)) / 2) * 1000 ) / 2;

export function startQuantumEngine(systemId,{
  ωKey="quantumω",
  ΩKey="quantumΩ",
  frequency=1000,
  factor=60
}={}){

  let interval=setInterval(async()=>{

    const prev = game.settings.get(systemId,ωKey) ?? 0;
    const next = prev + 1;
    if(next !== prev) await game.settings.set(systemId,ωKey,next);

    await consumeQuantumRevealsByω(systemId);
    await autoQuantumΞ(systemId);

    const Ω = Math.floor(next/factor);
    const prevΩ = game.settings.get(systemId,ΩKey) ?? 0;
    if(Ω !== prevΩ) await game.settings.set(systemId,ΩKey,Ω);

    const Ɏ = game.settings.get(systemId,"quantumɎ") ?? false;

    if (!Ɏ && prev < ħ && next >= ħ) {

      await game.settings.set(systemId, "quantumɎ", true);

      game.socket.emit("system.shut-up-its-quantum", {
        type: "collapse"
      });

      triggerRealityCollapseFX(true);
    }

  },frequency);

  return ()=>clearInterval(interval);
}

export function triggerRealityCollapseFX(forceReload = false) {

  const veil = document.createElement("div");
  veil.classList.add("suiq-reality-collapse");
  document.body.appendChild(veil);

  if (forceReload) {
    setTimeout(() => {
      window.location.reload();
    }, 2200);
  }
}

const QUANTUM_STATES = {
  1: { requiredSets: [] },
  2: { requiredSets: ["quantumℰ1"] },
  3: { requiredSets: ["quantumℰ1","quantumℰ2"] },
  4: { requiredSets: ["quantumℰ1","quantumℰ2","quantumℰ3"] }
};

export async function quantumGate(systemId, state) {
  const cfg = QUANTUM_STATES[state];
  if (!cfg) return false;

  const required = cfg.requiredSets ?? [];
  if (!required.length) return true;

  const used = game.settings.get(systemId, "quantumℰ") ?? [];

  return required.every(setName => {
    const reference = game.settings.get(systemId, setName) ?? [];
    return reference.every(uuid => used.includes(uuid));
  });
}

export async function autoQuantumΞ(systemId) {

  if (game.settings.get(systemId, "quantum◇C") === true) {
    
    const current = game.settings.get(systemId, "quantumΞ");
    if (current !== 0) {
      await game.settings.set(systemId, "quantumΞ", 0);
    }

    return;
  }

  let current = game.settings.get(systemId, "quantumΞ");
  if (current == null) current = 1;

  const next = current + 1;
  if (QUANTUM_STATES[next] && await quantumGate(systemId, next)) {
    return game.settings.set(systemId, "quantumΞ", next);
  }

  if (current > 1 && !(await quantumGate(systemId, current))) {
    return game.settings.set(systemId, "quantumΞ", current - 1);
  }
}

export async function consumeQuantumRevealsByω(
  systemId,
  { key = "quantum⟁" } = {}
) {
  if (!game.user.isGM) return;

  const ω = game.settings.get(systemId, "quantumω") ?? 0;
  const scheduled = game.settings.get(systemId, key) || [];
  if (!scheduled.length) return;

  const due = [];
  const remaining = [];

  for (const r of scheduled) {
    if ((r.fireAtω ?? Infinity) <= ω) due.push(r);
    else remaining.push(r);
  }

  if (!due.length) return;

  await game.settings.set(systemId, key, remaining);

  for (const r of due) {
    try {
      switch (r.type) {

        case "journal":
          await revealJournalPage(
            systemId,
            r.journalUUID,
            r.pageIndex
          );
          break;

        case "vision":
          await revealQuantumVision(
            systemId,
            r.journalUUID,
            r.pageIndex
          );
          break;

        default:
          console.warn("SUIQ | Unknown reveal type", r);
      }

    } catch (e) {
      console.error("SUIQ | reveal failed", r, e);
    }
  }
}

const Ω = [
  {
    κ: "WTI5dGNHVnVaR2wxYlMxemFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdFgzQnpNSGd4Wm1OaFkyaGw=",
    π: "YzJoMWRDMTFjQzFwZEhNdGNYVmhiblIxYlM1d2N6QjRNV1pqWVdOb1pRPT0=",
    λ: [
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1R2NIUk9ia1p6Y0dOQlFYQXpZMWxV",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1eFRYUkZRM3BYU2pZMWRXYzFaVkE0",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1Uk5ERjBURVJvTkdOcFlXSlNURmxY",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM0MFYweDNXVTVLZW5SNGJrbG1VazFp",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1a1kwZ3lOMGhZTURVMVlYbFBWWGxT",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM0d2QyUldTSFpJWjJ4SU5teFJZMjVD",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1SlFuWnpaWEZTVGt0SU56UmxlVkJW",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1VVVVZEJjSE01VDNScGRrdGFTVTVL",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1VFNIbG9OMFZwTW0xUVNtVjVWWGd5",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1S2VqZGFXVkJ4UVRoalRVMU5ibnA1"
    ]
  },
  {
    κ: "WTI5dGNHVnVaR2wxYlMxemFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdFgzTndibkpsWjJsemRISjU=",
    π: "YzJoMWRDMTFjQzFwZEhNdGNYVmhiblIxYlM1emNHNXlaV2RwYzNSeWVRPT0=",
    λ: [
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa1p2YkdSbGNpNUlRVFJPTWpnMU9VcGFPVGgxTXpaRQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa1p2YkdSbGNpNVBOV0ZtY0ZkWWFYWmhhMXAwWVROTQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa0ZqZEc5eUxsWk9ibTFRV1VjemEyTTJNRGxrVVdZPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa0ZqZEc5eUxrZzJSVmxITTNsR1VUUk9OV3Q0U1VnPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTndibkpsWjJsemRISjVMa0ZqZEc5eUxrOVNRV0V4V0ZOR00yNUJXR3gxUVdZPQ=="
    ]
  },
  {
    κ: "WTI5dGNHVnVaR2wxYlMxemFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdFgzTjVjM0psYkdGNWRHMXc=",
    π: "YzJoMWRDMTFjQzFwZEhNdGNYVmhiblIxYlM1emVYTnlaV3hoZVhSdGNBPT0=",
    λ: [
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxuQjRhMk5JY1dnMFFubzRiWE5uVDBZPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxuQnVOV3RNYjBsTk1uSlZaMjlqU1VNPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxrazJjRVJ2UjFwbk9HaE5aRFE0ZG5nPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxsTlhabHBCTmxSblVqZDRaSEpCUlZRPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxsQnBhV2x4YTFnM1ZISkxjMHhVWWxVPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxqWmFhVVkzZVhSUVNISTRTRVJLZW1vPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxrcFJWRWhhVXpGcE1FTTRXSEZQT0VzPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxqSkZjVGRYZUVobVpsUjBWR1JwZGpNPQ==",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuTjVjM0psYkdGNWRHMXdMazFoWTNKdkxuaHNhVXR1Y2xkb1UxaHNhbEY2VW1FPQ=="
    ]
  },
  {
    κ: "WTI5dGNHVnVaR2wxYlMxemFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdFgyMWhZM0p2Y3c9PQ==",
    π: "YzJoMWRDMTFjQzFwZEhNdGNYVmhiblIxYlM1dFlXTnliM009",
    λ: [
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExtMWhZM0p2Y3k1TllXTnlieTVaTTNGRVFsQlRVM05DY1hOeFNrcEY=",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExtMWhZM0p2Y3k1TllXTnlieTUxVFRCVFZXSndZbWx4VFZKMVFrOVU=",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExtMWhZM0p2Y3k1TllXTnlieTVEVWt0MFNYTlFlVVJwVkZsbVJXdHc=",
      "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExtMWhZM0p2Y3k1TllXTnlieTU0V0RjME1sUmFUemx1ZVdzMWNtdDM="
    ]
  }
];

function Θ(app, registry) {
  const rootId = atob(atob(registry.κ));
  if (app.options?.id !== rootId) return;

  const container = document.getElementById(rootId);
  if (!container) return;

  const list = container.querySelector("ol.directory-list");
  if (!list) return;

  const targets = registry.λ.map(v => atob(atob(v)));
  const packId  = registry.π ? atob(atob(registry.π)) : null;

  const docTypeFromApp = app.documentName || app.constructor.documentName || null;

  for (const li of list.querySelectorAll("li.directory-item")) {
    const entryId = li.dataset.entryId ?? null;
    const domUuid = li.dataset.uuid ?? null;

    const candidates = [];

    if (domUuid) {
      candidates.push(domUuid);
    }

    if (packId && entryId) {
      candidates.push(`Compendium.${packId}.${entryId}`);

      if (docTypeFromApp) {
        candidates.push(`Compendium.${packId}.${docTypeFromApp}.${entryId}`);
      }
    }

    if (candidates.some(u => targets.includes(u))) {
      li.remove();
    }
  }
}

export function ψ(app){ Ω.forEach(r => Θ(app,r)); }

export async function Ж(dest) {

  for (const reg of Ω) {
    const index = reg.λ.indexOf(dest);

    if (index >= 0) {
      reg.λ.splice(index, 1);
    }
  }
}

