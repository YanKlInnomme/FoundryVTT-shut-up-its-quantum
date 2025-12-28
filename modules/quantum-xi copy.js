import { CACHING_MODEL } from "../models/caching-model.js";
import { QUANTUM_RELAY } from "../models/quantum-relay.js";
import { PSYCHE_KERNEL } from "../models/psyche-kernel.js";
import { TEMP_VARIANT } from "../models/temp-variant.js";
import { FCONSTANTS, MIND_LATTICE } from "../models/fconstants.js";
import { ENTANGLEMENT_CORE } from "../models/entanglement-core.js";
import { QUANTUM_PY, EPOC_CACHE } from "../models/quantum-py.js";
import { CASH_CACHE } from "../models/cash-cache.js";
import { TEMPORISIUM } from "../models/temporisium.js";
import { SPIN_ROTATION, SEQUENTIAL_RIVALS } from "../models/spin-rotation.js";
import { drawQuantumMessage, triggerQuantumFragment, drawQuantumImage, sendQuantumMessage } from "./quantum-fragments.js";
import { revealSequentialChain, importSequentialPages, revealSequentialDisplay, getSequentialChainForPageRef } from "./helpers.js";

let quantumReserveTimer = null;

export function getQuantumΞ(systemId) {
  return game.settings.get(systemId,"quantumΞ") ?? 0;
}

export function scheduleReserveDraw(systemId) {
  const reserve = game.settings.get(systemId, "quantum⧉") || [];
  if (!reserve.length) return;

  const delay = Math.floor(Math.random() * 88) + 1;

  if (quantumReserveTimer) clearTimeout(quantumReserveTimer);

  quantumReserveTimer = setTimeout(() => {
    drawQuantumMessage(systemId);
  }, delay * 1000);
}

export async function onQuantumRoll(systemId) {
  const state = getQuantumΞ(systemId);

  if (state === 1) {
    triggerQuantumFragment(systemId);
    scheduleReserveDraw(systemId);
    return;
  }

  scheduleReserveDraw(systemId);
}

export async function onQuantumKeyword(systemId, text) {
  const state = getQuantumΞ(systemId);

  const raw = text.trim();
  if (!raw) return false;

  const ekey = btoa(btoa(raw));

  const lang = game.i18n.lang.startsWith("fr") ? "fr" : "en";
  const dict = lang === "fr" ? CACHING_MODEL : TEMPORISIUM;

  const match = dict[ekey];
  if (!match) return false;

  const rawTargets = Array.isArray(match) ? match : match[state];
  const targets = rawTargets
    ? (Array.isArray(rawTargets) ? rawTargets : [rawTargets])
    : [];

  if (!targets.length) return true;

  if (!game.user.isGM) return true;

  const decodedTargets = targets
    .map(id => {
      try { return atob(atob(id)); }
      catch { return null; }
    })
    .filter(Boolean);

  if (state === 1) {

    const usedTokens = game.settings.get(systemId, "quantum⊘") || [];

    const tokensToBlock = [
      `${ekey}::1`,
      `${ekey}::2`
    ];

    const alreadyUsed = tokensToBlock.some(t => usedTokens.includes(t));
    if (alreadyUsed) return true;

    await game.settings.set(
      systemId,
      "quantum⊘",
      [...new Set([...usedTokens, ...tokensToBlock])]
    );

    const reserve = game.settings.get(systemId, "quantum⧉") || [];
    const merged = [...new Set([...reserve, ...decodedTargets])];
    await game.settings.set(systemId, "quantum⧉", merged);

    const ℰ1 = game.settings.get(systemId, "quantumℰ1") || [];
    const ℰ = game.settings.get(systemId, "quantumℰ") || [];

    const candidates = ℰ1.filter(uuid => !ℰ.includes(uuid));
    if (!candidates.length) return true;

    const uuid = candidates[Math.floor(Math.random() * candidates.length)];

    await sendQuantumMessage(uuid);

    const ℰUsed = game.settings.get(systemId, "quantumℰ") || [];
    if (!ℰUsed.includes(uuid)) {
      await game.settings.set(systemId, "quantumℰ", [...ℰUsed, uuid]);
    }

    return true;
  }

  const token = `${ekey}::${state}`;
  const usedTokens = game.settings.get(systemId, "quantum⊘") || [];

  if (usedTokens.includes(token)) return true;

  await game.settings.set(systemId, "quantum⊘", [...usedTokens, token]);

  const pool = game.settings.get(systemId, "quantum⧉") || [];
  const merged = [...new Set([...pool, ...decodedTargets])];
  await game.settings.set(systemId, "quantum⧉", merged);

  await drawQuantumMessage(systemId);

  return true;
}

export async function onQuantumImport(systemId, text) {
  const state = game.settings.get(systemId, "quantumΞ");
  if (state !== 2 && state !== 3) return false;

  const raw = text.trim();
  if (!raw) return false;

  const lang = game.i18n.lang.startsWith("fr") ? "fr" : "en";
  const dict = lang === "fr" ? ENTANGLEMENT_CORE : QUANTUM_RELAY;

  const dKey  = btoa(btoa(raw));
  const match = dict[dKey];

  if (!match) return false;

  const encoded = match[state];
  if (!encoded) return true;

  const list = Array.isArray(encoded) ? encoded : [encoded];

  if (!game.user.isGM) {
    ui.notifications.warn(
      game.i18n.localize("SUIQ.UI.Import.AccessDenied")
    );
    return true;
  }

  for (const enc of list) {
    let uuid;
    try { uuid = atob(atob(enc)); }
    catch (e) {
      console.error(
        game.i18n.localize("SUIQ.UI.Import.Error")
      );
      continue;
    }

    const doc = await fromUuid(uuid);

    if (!doc) {
      console.warn(
        game.i18n.localize("SUIQ.UI.Import.Warning")
      );
      continue;
    }

    const cls = CONFIG[doc.documentName]?.documentClass;
    if (!cls) {
      console.error(
        game.i18n.localize("SUIQ.UI.Import.Error")
      );
      continue;
    }

    const data = foundry.utils.duplicate(doc.toObject());
    delete data._id;

    data._stats ??= {};
    data._stats.compendiumSource ??= doc.uuid;

    await cls.create(data, { render: true });
  }

  ui.notifications.info(
    game.i18n.localize("SUIQ.UI.QuantumImport.Success")
  );

  return true;
}

export async function onQuantumVision(systemId, text) {
  const state = getQuantumΞ(systemId);
  if (state <= 1) return false;

  const raw = text.trim();
  if (!raw) return false;

  const ekey = btoa(btoa(raw));

  const lang = game.i18n.lang.startsWith("fr") ? "fr" : "en";
  const dict = lang === "fr" ? FCONSTANTS : QUANTUM_PY;

  const match = dict[ekey];
  if (!match) return false;

  if (!game.user.isGM) {
    return true;
  }

  const used = game.settings.get(systemId, "quantum𐊧");
  const token = `${ekey}::${state}`;
  if (used.includes(token)) return true;

  const rawTargets = Array.isArray(match) ? match : match[state];
  const targets = rawTargets ? (Array.isArray(rawTargets) ? rawTargets : [rawTargets]) : [];

  if (!targets.length) return true;

  await game.settings.set(systemId, "quantum𐊧", [...used, token]);

  const decoded = targets.map(id => {
    try { return atob(atob(id)); }
    catch(e) { return null; }
  }).filter(Boolean);

  await drawQuantumImage(systemId, decoded);

  return true;
}

export async function applyArtificialVariantBackground() {
  const actor = this.document;

  const variant = ARTIFICIAL_VARIANT.find(v => v.A === actor.uuid);
  if (!variant) return;

  const [journalUUID, pageIndexStr] = variant.B.split("::");
  const pageIndex = Number(pageIndexStr || 0);

  try {
    const journal = await fromUuid(journalUUID);
    const page = journal.pages?.contents?.[pageIndex];

    const src = page?.src ?? page?.image?.src;
    if (!src) return;

    const el = this.element;
    el.style.setProperty("--suiq-dynamic-bg", `url("${src}")`);
    el.classList.add("suiq-has-variant-bg");

  } catch (err) {
    console.error("SUIQ | Failed to apply variant background", err);
  }
}

export async function onQuantumImportJournalPage(systemId, text) {
  const DBG = (globalThis.__SUIQ_DEBUG ?? true);
  const log  = (...a) => DBG && console.log("SUIQ | onQuantumImportJournalPage |", ...a);
  const warn = (...a) => DBG && console.warn("SUIQ | onQuantumImportJournalPage |", ...a);
  const err  = (...a) => console.error("SUIQ | onQuantumImportJournalPage |", ...a);

  const t0 = performance.now();

  try {
    const state = getQuantumΞ(systemId);
    const raw = (text ?? "").trim();

    log("start", { isGM: game.user.isGM, state, raw });

    if (state < 2) {
      log("gate: state < 2", state);
      return false;
    }

    if (!raw) {
      log("gate: empty text");
      return false;
    }

    const dKey = btoa(btoa(raw));
    const lang = game.i18n.lang.startsWith("fr") ? "fr" : "en";
    const dict = lang === "fr" ? CASH_CACHE : TEMP_VARIANT;

    const match = dict[dKey];
    log("lookup", { lang, hasMatch: !!match });

    if (!match) return false;

    const encoded = match[state];
    log("encoded", { state, hasEncoded: !!encoded });

    if (!encoded) return false;

    if (!game.user.isGM) {
      log("not GM: trigger true so chatMessage will emit socket command");
      return true;
    }

    let decoded;
    try {
      decoded = atob(atob(encoded));
    } catch (e) {
      warn("decode failed", e);
      return false;
    }

    log("decoded", decoded);

    const chain = getSequentialChainForPageRef(decoded);
    log("chain", { hasChain: !!chain, chainLen: Array.isArray(chain) ? chain.length : null });

    if (chain) {
      const fullChain = [decoded, ...chain].filter((v, i, a) => a.indexOf(v) === i);

      console.log("SUIQ | onQuantumImportJournalPage | fullChain", {
        decoded,
        chainLen: chain.length,
        fullChainLen: fullChain.length,
        fullChain
      });

      await importSequentialPages(fullChain);
    } else {
      await importSequentialPages([decoded]);
    }

    const [journalUUID, pageIndexStr] = decoded.split("::");
    const pageIndex = Number(pageIndexStr ?? 0);

    if (!journalUUID) {
      warn("decoded missing journalUUID", { decoded });
      return false;
    }

    await importSequentialPages([`${journalUUID}::${pageIndex}`]);
    log("importSequentialPages(single) done", { journalUUID, pageIndex, ms: Math.round(performance.now() - t0) });

    return true;
  } catch (e) {
    err("unexpected error", e);
    return false;
  }
}


export async function onQuantumShowPage(systemId, text) {
  const DBG = (globalThis.__SUIQ_DEBUG ?? true);
  const log  = (...a) => DBG && console.log("SUIQ | onQuantumShowPage |", ...a);
  const warn = (...a) => DBG && console.warn("SUIQ | onQuantumShowPage |", ...a);
  const err  = (...a) => console.error("SUIQ | onQuantumShowPage |", ...a);

  const t0 = performance.now();

  try {
    const state = getQuantumΞ(systemId);
    const raw = (text ?? "").trim();

    log("start", { isGM: game.user.isGM, state, raw });

    if (state <= 1) {
      log("gate: state <= 1", state);
      return false;
    }

    if (!raw) {
      log("gate: empty text");
      return false;
    }

    const dKey = btoa(btoa(raw));
    const lang = game.i18n.lang.startsWith("fr") ? "fr" : "en";
    const dict = lang === "fr" ? SPIN_ROTATION : PSYCHE_KERNEL;

    const match = dict[dKey];
    log("lookup", { lang, hasMatch: !!match });

    if (!match) return false;

    const encoded = match[state];
    log("encoded", { state, hasEncoded: !!encoded });

    if (!encoded) return false;

    if (!game.user.isGM) {
      log("not GM: trigger true so chatMessage will emit socket command");
      return true;
    }

    let decoded;
    try {
      decoded = atob(atob(encoded));
    } catch (e) {
      warn("decode failed", e);
      return false;
    }

    log("decoded", decoded);

    const chain = getSequentialChainForPageRef(decoded);
    log("chain", { hasChain: !!chain, chainLen: Array.isArray(chain) ? chain.length : null });

    if (Array.isArray(chain) && chain.length) {
      const fullChain = [decoded, ...chain].filter((v, i, a) => a.indexOf(v) === i);

      await revealSequentialDisplay(fullChain);
      return true;
    }

    const [journalUUID, pageIndexStr] = decoded.split("::");
    const pageIndex = Number(pageIndexStr ?? 0);

    if (!journalUUID) {
      warn("decoded missing journalUUID", { decoded });
      return false;
    }

    const journal = await fromUuid(journalUUID);
    if (!journal) {
      warn("fromUuid returned null", { journalUUID });
      return false;
    }

    const page = journal.pages.contents[pageIndex];
    if (!page) {
      warn("page not found", { journalUUID, pageIndex, pageCount: journal.pages.size });
      return false;
    }

    log("render popout", { journalUUID, pageIndex, pageName: page.name });
    new game.suiq.JournalPopout(page).render(true);

    game.socket.emit("system.shut-up-its-quantum", {
      type: "showPage",
      journalUUID,
      pageIndex
    });

    log("done", { ms: Math.round(performance.now() - t0) });
    return true;
  } catch (e) {
    err("unexpected error", e);
    return false;
  }
}

function getMindEntryForFragment(fragmentUuid) {
  return MIND_LATTICE.find(e => {
    let A, B;
    try { A = atob(atob(e.A)); } catch {}
    try { B = atob(atob(e.B)); } catch {}
    return A === fragmentUuid || B === fragmentUuid;
  }) ?? null;
}

function getEpocEntryForFragment(fragmentUuid) {
  return EPOC_CACHE.find(e => {
    let A, B;
    try { A = atob(atob(e.A)); } catch {}
    try { B = atob(atob(e.B)); } catch {}
    return A === fragmentUuid || B === fragmentUuid;
  }) ?? null;
}

function parseJournalPageRef(raw) {
  if (!raw) return null;

  let decoded = raw;

  const looksB64 = /^[A-Za-z0-9+/=]+$/.test(raw) && raw.length % 4 === 0;
  if (looksB64) {
    try { decoded = atob(atob(raw)); } catch (_) { }
  }

  const [journalUUID, pageIndexStr] = String(decoded).split("::");
  const pageIndex = Number(pageIndexStr ?? 0);

  if (!journalUUID || Number.isNaN(pageIndex)) return null;
  return { journalUUID, pageIndex };
}

function getω(systemId) {
  return game.settings.get(systemId, "quantumω") ?? 0;
}

export async function scheduleMindLatticeRevealFromFragment(systemId, fragmentUuid, { delayDie = 88 } = {}) {
  const entry = getMindEntryForFragment(fragmentUuid);
  if (!entry) return false;

  const ref = parseJournalPageRef(entry.C);
  if (!ref) return false;

  if (!game.user.isGM) return true;

  const delay = Math.floor(Math.random() * delayDie) + 1;
  const nowω = getω(systemId);
  const fireAtω = nowω + delay;

  const record = {
    type: "journal",
    fireAtω,
    fragmentUuid,
    journalUUID: ref.journalUUID,
    pageIndex: ref.pageIndex
  };

  const key = "quantum⟁";
  const scheduled = game.settings.get(systemId, key) || [];
  scheduled.push(record);
  await game.settings.set(systemId, key, scheduled);

  return true;
}

export async function revealJournalPage(systemId, sourceJournalUUID, pageIndex) {
  if (!game.user.isGM) return;

  const sourceJournal = await fromUuid(sourceJournalUUID);
  if (!sourceJournal) return;

  const srcPage = sourceJournal.pages?.contents?.[pageIndex];
  if (!srcPage) return;

  let target = game.journal.contents.find(j =>
    j.getFlag("shut-up-its-quantum", "originJournal") === sourceJournalUUID
  );

  const hasPage = target?.pages?.contents?.some(p =>
    p.getFlag("shut-up-its-quantum", "originPage") === pageIndex
  );

  let createdPage = null;

  if (!target) {
    const pageData = foundry.utils.duplicate(srcPage.toObject());
    delete pageData._id;

    pageData.flags ??= {};
    pageData.flags["shut-up-its-quantum"] = {
      originJournal: sourceJournalUUID,
      originPage: pageIndex
    };

    target = await JournalEntry.create({
      name: sourceJournal.name,
      pages: [pageData],
      _stats: { compendiumSource: sourceJournalUUID },
      flags: {
        "shut-up-its-quantum": {
          originJournal: sourceJournalUUID,
          quantumReconstruction: true
        }
      }
    }, { render: false });

    createdPage = target.pages.contents[0];
  }
  else if (!hasPage) {
    const pageData = foundry.utils.duplicate(srcPage.toObject());
    delete pageData._id;

    pageData.flags ??= {};
    pageData.flags["shut-up-its-quantum"] = {
      originJournal: sourceJournalUUID,
      originPage: pageIndex
    };

    const created = await target.createEmbeddedDocuments(
      "JournalEntryPage",
      [pageData]
    );

    createdPage = created[0];
  }
  else {
    createdPage = target.pages.contents.find(p =>
      p.getFlag("shut-up-its-quantum", "originPage") === pageIndex
    );
  }

  if (!createdPage) return;

  const popout = new game.suiq.JournalPopout(createdPage, {
    onClosed: async () => {

      if (createdPage.getFlag("shut-up-its-quantum", "sequentialStarted")) return;

      const originJournalUUID =
        createdPage.getFlag("shut-up-its-quantum", "originJournal");

      const originPageIndex =
        createdPage.getFlag("shut-up-its-quantum", "originPage");

      if (originJournalUUID == null || originPageIndex == null) {
        console.warn(
        game.i18n.localize("SUIQ.UI.Import.Warning")
        );
        return;
      }

      const chain = await getSequentialChainForPage(
        originJournalUUID,
        originPageIndex
      );

      if (!chain) return;

      await createdPage.setFlag(
        "shut-up-its-quantum",
        "sequentialStarted",
        true
      );

      revealSequentialChain(chain, 0);
    }
  });

  popout.render(true);

  game.socket.emit("system.shut-up-its-quantum", {
    type: "showPage",
    journalUUID: target.uuid,
    pageIndex: target.pages.contents.indexOf(createdPage)
  });
}

export async function scheduleEpocCacheVisionFromFragment(
  systemId,
  fragmentUuid,
  { delayDie = 88 } = {}
) {
  if (!game.user.isGM) return true;

  const entry = getEpocEntryForFragment(fragmentUuid);
  if (!entry) return false;

  let decoded;
  try {
    decoded = atob(atob(entry.C));
  } catch {
    return false;
  }

  const [journalUUID, pageIndexStr] = decoded.split("::");
  const pageIndex = Number(pageIndexStr ?? 0);
  if (!journalUUID || Number.isNaN(pageIndex)) return false;

  const delay = Math.floor(Math.random() * delayDie) + 1;
  const nowω = game.settings.get(systemId, "quantumω") ?? 0;

  const record = {
    type: "vision",
    fireAtω: nowω + delay,
    journalUUID,
    pageIndex,
    fragmentUuid
  };

  const key = "quantum⟁";
  const scheduled = game.settings.get(systemId, key) || [];
  scheduled.push(record);
  await game.settings.set(systemId, key, scheduled);

  return true;
}

export async function revealQuantumVision(systemId, journalUUID, pageIndex) {
  if (!game.user.isGM) return;

  const journal = await fromUuid(journalUUID);
  if (!journal) return;

  const page = journal.pages?.contents?.[pageIndex];
  if (!page) return;

  const src = page.src ?? page.image?.src;
  if (!src) return;

  const pop = new foundry.applications.apps.ImagePopout({
    src,
    shareable: true,
    window: { title: page.name || journal.name }
  });

  await pop.render(true);
  pop.shareImage();

  game.socket.emit("system.shut-up-its-quantum", {
    type: "showImage",
    src,
    title: page.name || journal.name
  });
}

async function getSequentialChainForPage(journalUUID, pageIndex) {
  const ref = `${journalUUID}::${pageIndex}`;

  for (const [DKey, DChain] of Object.entries(SEQUENTIAL_RIVALS)) {
    let dKey;
    try {
      dKey = atob(atob(DKey));
    } catch {
      dKey = null;
    }

    if (!dKey) continue;
    if (dKey !== ref) continue;

    const chain = DChain
      .map(recoded => {
        try { return atob(atob(recoded)); }
        catch { return null; }
      })
      .filter(Boolean);

    return chain.length ? chain : null;
  }

  return null;
}

export async function importJournalPageIfMissing(sourceJournalUUID, pageIndex) {
  const sourceJournal = await fromUuid(sourceJournalUUID);
  if (!sourceJournal) return null;

  const srcPage = sourceJournal.pages.contents[pageIndex];
  if (!srcPage) return null;

  let target = game.journal.contents.find(j =>
    j.getFlag("shut-up-its-quantum", "originJournal") === sourceJournalUUID
  );

  if (target) {
    const exists = target.pages.contents.some(p =>
      p.getFlag("shut-up-its-quantum", "originPage") === pageIndex
    );
    if (exists) return target;
  }

  const pageData = foundry.utils.duplicate(srcPage.toObject());
  delete pageData._id;

  pageData.flags ??= {};
  pageData.flags["shut-up-its-quantum"] = {
    originJournal: sourceJournalUUID,
    originPage: pageIndex
  };

  if (!target) {
    target = await JournalEntry.create({
      name: sourceJournal.name,
      pages: [pageData],
      flags: {
        "shut-up-its-quantum": {
          originJournal: sourceJournalUUID,
          quantumReconstruction: true
        }
      },
      _stats: { compendiumSource: sourceJournalUUID }
    }, { render: false });
  } else {
    await target.createEmbeddedDocuments("JournalEntryPage", [pageData]);
  }

  return target;
}
