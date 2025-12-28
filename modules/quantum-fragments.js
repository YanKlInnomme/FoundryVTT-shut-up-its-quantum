import { scheduleMindLatticeRevealFromFragment, scheduleEpocCacheVisionFromFragment } from "./quantum-xi.js";

function pickUUIDFromPool(pool, used) {
  const avail = pool.filter(id => !used.includes(id));
  if (!avail.length) return null;
  return avail[Math.floor(Math.random() * avail.length)];
}

export async function sendQuantumMessage(uuid, speaker="Franz S.") {
  const page = await fromUuid(uuid);
  if (!page) return null;

  const html = `
  <div style="padding:6px 10px;">
    <div style="font-size:0.85rem;color:#aaa;float:left;margin-left:10px">${page.name}</div>
    <div style="clear:both"></div>
    <div>${page.text?.content ?? ""}</div>
  </div>`;

  return await ChatMessage.create({
    speaker: {alias:speaker},
    content: html,
    flags: {"shut-up-its-quantum": {quantumFragment:true}}
  });
}

async function moveUUID(uuid, sourceKey, destKey, systemId){
  const src = game.settings.get(systemId,sourceKey) || [];
  const dst = game.settings.get(systemId,destKey)   || [];

  const i = src.indexOf(uuid);
  if(i>=0) src.splice(i,1);

  await game.settings.set(systemId,sourceKey,src);
  await game.settings.set(systemId,destKey,[...dst,uuid]);
}

export async function drawQuantumMessage(systemId){
  const reserve = game.settings.get(systemId,"quantum⧉") || [];
  const used = game.settings.get(systemId,"quantumℰ") || [];

  const uuid = pickUUIDFromPool(reserve,used);
  if(!uuid) return null;

  const msg = await sendQuantumMessage(uuid);
  if (msg) {
    moveUUID(uuid, "quantum⧉", "quantumℰ", systemId);
    const fragmentUuid = uuid;
    scheduleMindLatticeRevealFromFragment(systemId, fragmentUuid);
    scheduleEpocCacheVisionFromFragment(systemId, fragmentUuid);
  }

  return msg;
}

let quantumFragmentTimer = null;

export function triggerQuantumFragment(systemId) {
  const delay = Math.floor(Math.random() * 88) + 1;

  if (quantumFragmentTimer) clearTimeout(quantumFragmentTimer);

  quantumFragmentTimer = setTimeout(async () => {
    const used = game.settings.get(systemId, "quantumℰ") || [];
    const pool = game.settings.get(systemId, "quantumℰ1") || [];

    const uuid = pickUUIDFromPool(pool, used);
    if (!uuid) return;

    const msg = await sendQuantumMessage(uuid);
    if (msg) {
      await moveUUID(uuid, "quantumℰ1", "quantumℰ", systemId);
      const fragmentUuid = uuid;
      scheduleMindLatticeRevealFromFragment(systemId, fragmentUuid);
      scheduleEpocCacheVisionFromFragment(systemId, fragmentUuid);
    }
  }, delay * 1000);
}

export async function drawQuantumImage(systemId, entries) {

  for (const entry of entries) {

    const [uuid, pageIndexStr] = entry.split("::");
    const pageIndex = Number(pageIndexStr ?? 0);

    const journal = await fromUuid(uuid);
    const page = journal.pages?.contents?.[pageIndex];
    const src = page.src ?? page.image?.src;

    const pop = new foundry.applications.apps.ImagePopout({
      src,
      shareable: true,
      window: { title: page.name || journal.name }
    });

    await pop.render(true);
    pop.shareImage();
  }
}