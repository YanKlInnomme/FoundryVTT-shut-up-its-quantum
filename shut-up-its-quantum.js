// shut-up-its-quantum.js

import { addSUIQLinksToSettings, registerSUIQSettings } from "./modules/settings.js";
import { registerSUIQDocuments } from "./modules/register-documents.js";
import { controlCompendiumDirectory, initAP as initAP, quantumStabilizationBuffer } from "./modules/compendium-control.js";
import { updateAllQuantumE, voidIndex } from "./modules/quantum-sync.js";
import { startQuantumEngine, ψ, Ж, triggerRealityCollapseFX } from "./modules/quantum-engine.js";
import { checkQuantumThresholds, testQuantumSync } from "./modules/quantum-timed.js";
import { onQuantumRoll, onQuantumKeyword, onQuantumImport, onQuantumVision, onQuantumImportJournalPage, onQuantumShowPage } from "./modules/quantum-xi.js";
import { triggerDisintegration } from "./modules/quantum-dissolve.js";
import { SUIQJournalPopout } from "./sheets/journal-popout.js";

const systemId = "shut-up-its-quantum";

Hooks.once("init", () => {
  registerSUIQDocuments(systemId);
  registerSUIQSettings(systemId);
  game.suiq ??= {};
  game.suiq.JournalPopout = SUIQJournalPopout;
  console.log("SUIQ | Registered JournalPopout");
});

Hooks.on("renderSettings", addSUIQLinksToSettings);

Hooks.on("ready", () => {
  if (game.user.isGM) {
      updateAllQuantumE(systemId);
      startQuantumEngine(systemId);
      setInterval(() => checkQuantumThresholds(systemId), 5000);
      quantumStabilizationBuffer({ WKf: voidIndex });
      initAP();
    game.suiq = game.suiq || {};
    game.suiq.JournalPopout = SUIQJournalPopout;
    game.suiq.openPage = async function(journalUuid, pageIndex = 0) {

      const journal = await fromUuid(journalUuid);
      if (!journal) return ui.notifications.error("Journal not found: " + journalUuid);
      const page = journal.pages.contents[pageIndex];
      if (!page) return ui.notifications.error("Page not found: " + pageIndex);

      new SUIQJournalPopout(page).render(true);
    };
  }

  game.socket.on("system.shut-up-its-quantum", async data => {
    if (!data?.type) return;

    if (data.type === "collapse") {
      if (game.user.isGM) return;
      triggerRealityCollapseFX(true);
      return;
    }

    if (data.type === "command") {
      if (!game.user.isGM) return;

      const text = data.text;
      console.log("SUIQ | Socket command on GM side: ", { text });

      await onQuantumImport(systemId, text);
      await onQuantumImportJournalPage(systemId, text);
      await onQuantumVision(systemId, text);
      await onQuantumKeyword(systemId, text);
      await onQuantumShowPage(systemId, text);

      return;
    }

    if (data.type === "showPage") {

      if (game.user.isGM) return;
      const journal = await fromUuid(data.journalUUID);
      if (!journal) return;
      const page = journal.pages.contents[data.pageIndex];
      if (!page) return;
      new game.suiq.JournalPopout(page).render(true);
      return;
    }
  });

});

Hooks.on("renderImagePopout", (app, html) => {
  const el = html?.[0] ?? html;
  if (el instanceof HTMLElement) el.classList.add("suiq-image-appear");
});

Hooks.on("renderCompendiumDirectory", (app, element) => {
  controlCompendiumDirectory(systemId, element);
});

Hooks.on("updateUser", (user, data) => {
  if (!game.user.isGM) return;
  if (data?.flags?.core?.language) updateAllQuantumE(systemId);
});

Hooks.on("createChatMessage", msg => {
  if (!game.user.isGM) return;

  const roll = msg.rolls?.[0];
  if (roll?.formula === "2d8" && roll.total === 16) {
    onQuantumRoll(systemId);
  }
});

let __suiq_replaying_chat = false;

Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
  if (__suiq_replaying_chat) return true;

  const text = messageText.trim();
  if (!text) return true;

  void (async () => {
    const modules = [
      onQuantumVision,
      onQuantumKeyword,
      onQuantumImport,
      onQuantumImportJournalPage,
      onQuantumShowPage,
    ];

    let triggered = false;

    for (const mod of modules) {
      if (await mod(systemId, text)) {
        triggered = true;
      }
    }

    if (triggered) {
      if (!game.user.isGM) {
        game.socket.emit("system.shut-up-its-quantum", {
          type: "command",
          text
        });
      }
      return;
    }

    __suiq_replaying_chat = true;
    let replay;
    try {
      replay = chatLog.processMessage(text, { speaker: chatData.speaker });
    } finally {
      __suiq_replaying_chat = false;
    }
    await replay;
  })().catch(error => {
    console.error("SUIQ | Chat command processing failed", error);
    ui.notifications.error(error.message);
  });

  return false;
});

let __suiq_lock = false;

Hooks.on("renderDocumentDirectory", async (app) => {
  if (__suiq_lock) return;

  ψ(app);

  const ȹ = [];
  for (const [cond, arr] of testQuantumSync) {
    if (cond()) ȹ.push(...arr);
  }
  if (!ȹ.length) return;

  __suiq_lock = true;
  try {
    for (const p of ȹ) await Ж(p);
    await ui.sidebar.render(true);
  } finally {
    __suiq_lock = false;
  }
});

Hooks.on("renderChatMessageHTML", (message, html, data) => {
  const isFragment = message.flags?.["shut-up-its-quantum"]?.quantumFragment;
  if (!isFragment) return;

  const element = html[0] ?? html;
  if (!(element instanceof HTMLElement)) return;

  element.classList.add("suiq-quantum-fragment");

  let timer = null;
  let holdStart = null;

  element.addEventListener("mouseenter", () => {
    element.classList.add("suiq-resonate");
    holdStart = Date.now();

    timer = setInterval(() => {
      if ((Date.now() - holdStart) / 1000 >= 8) {
        clearInterval(timer);
        triggerDisintegration(message.id, element);
      }
    }, 1000);
  });

  element.addEventListener("mouseleave", () => {
    element.classList.remove("suiq-resonate");
    if (timer) clearInterval(timer);
    timer = null;
    holdStart = null;
  });
});
