import { SEQUENTIAL_RIVALS } from "../models/spin-rotation.js";
import { importJournalPageIfMissing } from "./quantum-xi.js";

export async function extractImageFromJournal(entryIdWithPage) {
  if (!entryIdWithPage) return null;

  const [uuid, pageIndexStr] = entryIdWithPage.split("::");
  const pageIndex = Number(pageIndexStr ?? "0");

  const journal = await fromUuid(uuid);
  if (!journal) return null;

  const page = journal.pages?.contents?.[pageIndex];
  if (!page) return null;

  return page.src ?? page.image?.src ?? null;
}

function PageRef(ref) {
  const [journalUUID, pageIndexStr] = ref.split("::");
  return {
    journalUUID,
    pageIndex: Number(pageIndexStr ?? 0)
  };
}

export async function revealSequentialChain(chain, index = 0) {
  if (!game.user.isGM) return;
  if (index >= chain.length) return;

  const { journalUUID, pageIndex } = PageRef(chain[index]);
  const journal = await fromUuid(journalUUID);
  if (!journal) return;

  const page = journal.pages.contents[pageIndex];
  if (!page) return;

  const isLast = index === chain.length - 1;

  const popout = new game.suiq.JournalPopout(page, {
    onClosed: async () => {

      await importJournalPageIfMissing(journalUUID, pageIndex);
      if (!isLast) {
        await revealSequentialChain(chain, index + 1);
        return;
      }

      ui.journal?.render(true);
    }
  });

  popout.render(true);

  game.socket.emit("system.shut-up-its-quantum", {
    type: "showPage",
    journalUUID,
    pageIndex
  });
}

function parsePageRef(ref) {
  if (!ref || typeof ref !== "string") return null;
  const [journalUUID, pageIndexStr] = ref.split("::");
  const pageIndex = Number(pageIndexStr);
  if (!journalUUID || Number.isNaN(pageIndex)) return null;
  return { journalUUID, pageIndex };
}

export async function revealSequentialDisplay(chain, index = 0) {
  if (!game.user.isGM) return;
  if (!Array.isArray(chain) || index >= chain.length) return;

  const ref = parsePageRef(chain[index]);
  if (!ref) return;

  const journal = await fromUuid(ref.journalUUID);
  if (!journal) return;

  const page = journal.pages.contents[ref.pageIndex];
  if (!page) return;

  const popout = new game.suiq.JournalPopout(page, {
    onClosed: async () => {
      await revealSequentialDisplay(chain, index + 1);
    }
  });

  popout.render(true);

  game.socket.emit("system.shut-up-its-quantum", {
    type: "showPage",
    journalUUID: ref.journalUUID,
    pageIndex: ref.pageIndex
  });
}

export async function importSequentialPages(chain) {
  if (!game.user.isGM) return;
  if (!Array.isArray(chain) || !chain.length) return;

  const touchedJournals = new Set();

  for (const ref of chain) {
    const [sourceJournalUUID, pageIndexStr] = ref.split("::");
    const pageIndex = Number(pageIndexStr);
    if (!sourceJournalUUID || Number.isNaN(pageIndex)) continue;

    const sourceJournal = await fromUuid(sourceJournalUUID);
    if (!sourceJournal) continue;

    const srcPage = sourceJournal.pages.contents[pageIndex];
    if (!srcPage) continue;

    let target = game.journal.contents.find(j =>
      j.getFlag("shut-up-its-quantum", "originJournal") === sourceJournalUUID
    );

    const alreadyExists = target?.pages.contents.some(p =>
      p.getFlag("shut-up-its-quantum", "originPage") === pageIndex
    );

    if (alreadyExists) continue;

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

    touchedJournals.add(target.id);
  }

  if (touchedJournals.size) {
    ui.journal?.render(true);
  }
}

export async function revealThenImportSequentially(chain) {
  await revealSequentialDisplay(chain);
  await importSequentialPages(chain);
}

export function getSequentialChainForPageRef(ref) {
  for (const [encodedKey, encodedChain] of Object.entries(SEQUENTIAL_RIVALS)) {
    let decodedKey;
    try {
      decodedKey = atob(atob(encodedKey));
    } catch {
      continue;
    }

    if (decodedKey !== ref) continue;

    return encodedChain
      .map(e => {
        try { return atob(atob(e)); }
        catch { return null; }
      })
      .filter(Boolean);
  }
  return null;
}
