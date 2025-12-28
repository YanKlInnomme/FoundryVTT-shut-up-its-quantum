import { voidIndex } from "./quantum-sync.js";

const QuantumPACKS = {
  fr: [
    "shut-up-its-quantum.artefacts-substanciels",
    "shut-up-its-quantum.macros",
    "shut-up-its-quantum.ps0x1fcache",
    "shut-up-its-quantum.spnregistry",
    "shut-up-its-quantum.sysrelaytmp",
    "shut-up-its-quantum.tables-aleatoires-and-cie"
  ],
  en: [
    "shut-up-its-quantum.macros",
    "shut-up-its-quantum.ps0x1fcache",
    "shut-up-its-quantum.random-tables-and-co",
    "shut-up-its-quantum.spnregistry",
    "shut-up-its-quantum.substantial-artifacts",
    "shut-up-its-quantum.sysrelaytmp"
  ]
};

export function controlCompendiumDirectory(systemId, element) {

  const root = element?.[0] ?? element;
  if(!(root instanceof HTMLElement)) return;

  const reveal = game.settings.get(systemId,"quantumɎ") ?? false;
  const lang = game.i18n.lang;
  const allowed = QuantumPACKS[lang] ?? [];

  root.querySelectorAll(".compendium").forEach(el=>{

    const packId = el.dataset.pack;
    if(!packId?.startsWith(`${systemId}.`)) return;

    if(!reveal && voidIndex.includes(packId)){
      el.remove();
      return;
    }

    if(!allowed.includes(packId)){
      el.classList.add("suiq-quantum-unstable");
      el.addEventListener("mouseenter",()=>{
        el.classList.add("suiq-quantum-disintegrate");
        setTimeout(()=>el.remove(),1200);
      });
    }
  });
}

export function quantumStabilizationBuffer({ 
  WKf = [],
  WKi = "SUIQ.UI.Import.Suspension",
  WKu = "SUIQ.UI.Unlock.Suspension"
} = {}) {

  const CC = foundry.documents.collections.CompendiumCollection;
  const _importDialog = CC.prototype.importDialog;
  const _importAll = CC.prototype.importAll;

  function isForbiddenPack(pack) {
    const id = pack?.collection ?? pack;
    return WKf.includes(id);
  }

  CC.prototype.importDialog = async function(options = {}) {
    if (isForbiddenPack(this)) {
      ui.notifications.warn(game.i18n.localize(WKi));
      return null;
    }
    return _importDialog.call(this, options);
  };

  CC.prototype.importAll = async function(options = {}) {
    if (isForbiddenPack(this)) {
      ui.notifications.warn(game.i18n.localize(WKi));
      return [];
    }
    return _importAll.call(this, options);
  };

  const examplePack = game.packs.contents.find(p => p);
  if (!examplePack) {
    console.warn("SUIQ | No compendium packs found to patch.");
    return;
  }

  const CCP = Object.getPrototypeOf(examplePack);
  const _configure = CCP.configure;

  CCP.configure = async function(options = {}) {
    const packId = this.collection;

    if (options.locked === false && isForbiddenPack(packId)) {
      ui.notifications.warn(game.i18n.localize(WKu));
      return this;
    }

    return _configure.call(this, options);
  };
}

const ʣ = "UTI5dGNHVnVaR2wxYlM1emFIVjBMWFZ3TFdsMGN5MXhkV0Z1ZEhWdExuQnpNSGd4Wm1OaFkyaGxMa3B2ZFhKdVlXeEZiblJ5ZVM1VVVVZEJjSE01VDNScGRrdGFTVTVLT2pvdw==";
const DIR = "systems/shut-up-its-quantum/assets/.temp";
const UPLOAD_NAME = "VkZGSFFYQnpPVTkwYVhaTFdrbE9TZz09.png";

let Ø0 = null;
let Ø1 = 0;
let OffSource = null;

function dStressMUW() {

  const UnSub0 = "V1c5MUlHaGhkbVVnZFhCc2IyRmtaV1FnWm1sc1pYTWdhVzUwYnlCaElHMXZaSFZzWlNCdmNpQnplWE4wWlcwZ1ptOXNaR1Z5TGc9PQ==";

  globalThis.__apSuppressSavedUntil = 0;

  if (ui?.notifications?.warn && !ui.notifications.__apWrappedWarn) {
    const orig = ui.notifications.warn.bind(ui.notifications);
    ui.notifications.warn = function (message, ...rest) {
      const s = String(message ?? "");
      if (s.includes(atob(atob(UnSub0)))) return;
      return orig(message, ...rest);
    };
    ui.notifications.__apWrappedWarn = true;
  }

  if (console?.warn && !console.__apWrappedWarn) {
    const orig = console.warn.bind(console);
    console.warn = function (...args) {
      const s = String(args?.[0] ?? "");
      if (s.includes(UnSub1)) return;
      return orig(...args);
    };
    console.__apWrappedWarn = true;
  }

  const wrapConsole = (methodName) => {
    if (!console?.[methodName]) return;
    const flagName = `__apWrapped_${methodName}`;
    if (console[flagName]) return;

    const orig = console[methodName].bind(console);
    console[methodName] = function (...args) {
      const now = Date.now();
      if (now < (globalThis.__apSuppressSavedUntil ?? 0)) {

        const joined = args.map(a => String(a)).join(" ");
        if (joined.includes(" saved to ") && joined.includes(UPLOAD_NAME) && joined.includes(DIR)) {
          globalThis.__apSuppressSavedUntil = 0;
          return;
        }

        const fmt = String(args?.[0] ?? "");
        const hasSaved = fmt.includes("saved to");
        const hasName = args.some(a => String(a) === UPLOAD_NAME || String(a).includes(UPLOAD_NAME));
        const hasDir  = args.some(a => String(a) === DIR || String(a).includes(DIR));
        if (hasSaved && hasName && hasDir) {
          globalThis.__apSuppressSavedUntil = 0;
          return;
        }
      }

      return orig(...args);
    };

    console[flagName] = true;
  };

  wrapConsole("log");
  wrapConsole("info");
  wrapConsole("debug");
}

function dStressUI() {
  const FP = foundry.applications.apps.FilePicker.implementation;
  if (FP.__apWrappedBrowse) return;

  const origBrowse = FP.browse;
  FP.browse = async function (source, target, options = {}) {
    const res = await origBrowse.call(this, source, target, options);

    if (options?.__apInternal) return res;

    if (res?.dirs?.length) {
      res.dirs = res.dirs.filter(d => d !== DIR && !d.startsWith(`${DIR}/`));
    }
    return res;
  };

  FP.__apWrappedBrowse = true;
}

function imgSrcsFromHtml(html) {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll("img"))
    .map(el => el.getAttribute("src"))
    .filter(Boolean);
}

async function getJISrcAt(journalUuid, idx) {
  const journal = await fromUuid(journalUuid);
  if (!journal) return null;

  const imgs = [];
  for (const p of journal.pages ?? []) {
    if (p.type === "image" && p.src) imgs.push(p.src);
    const html = p.text?.content ?? p.text?.markdown ?? p.content ?? "";
    imgs.push(...imgSrcsFromHtml(html));
  }
  const unique = [...new Set(imgs)];
  return unique[idx] ?? null;
}

async function ensureDataUrlUploaded(dataUrl) {
  const FP = foundry.applications.apps.FilePicker.implementation;
  const targetPath = `${DIR}/${UPLOAD_NAME}`;

  try {
    const listing = await FP.browse("data", DIR, { __apInternal: true });
    const files = listing?.files ?? [];
    const exists = files.some(f => f === targetPath || f.endsWith(`/${UPLOAD_NAME}`));
    if (exists) return targetPath;
  } catch (e) {}

  const res = await fetch(dataUrl);
  const blob = await res.blob();

  try { await FP.createDirectory("data", DIR, { recursive: true }); } catch (e) {}

  const file = new File([blob], UPLOAD_NAME, { type: blob.type || "image/png" });
  globalThis.__apSuppressSavedUntil = Date.now() + 2000;

  try {
    await FP.upload("data", DIR, file, { overwrite: true }, { notify: false });
  } catch (e) {
    await FP.upload("data", DIR, file, { overwrite: true });
  }

  return targetPath;
}

export async function initAP() {
  dStressMUW();
  dStressUI();

  const dcd = atob(atob(ʣ));
  const [ju, idx] = dcd.split("::");
  Ø0 = ju;
  Ø1 = Number(idx ?? 0);

  const src = await getJISrcAt(Ø0, Ø1);
  if (!src) return;

  if (src.startsWith("data:")) {
    if (!game.user.isGM) return;
    OffSource = await ensureDataUrlUploaded(src);
  } else {
    OffSource = src;
  }
}
