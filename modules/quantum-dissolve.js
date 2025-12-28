export async function dissolveMessage(msg, delay=8000, fade=1200) {
  if (!msg || !msg.id) return;

  setTimeout(() => {
    const el = document.querySelector(`[data-message-id="${msg.id}"]`);
      
    if (!el) {
      try { msg.delete(); } catch(e){}
      return;
    }

    el.classList.add("suiq-disintegrate");

    setTimeout(() => {
      try { msg.delete(); } catch(e){}
    }, fade);

  }, delay);
}

export async function triggerDisintegration(messageId, element, fade = 1200) {
  if (!element) return;

  element.classList.add("suiq-disintegrate");

  setTimeout(async () => {

    if (element && element.parentElement) {
      element.parentElement.removeChild(element);
    }

    if (game.user.isGM) {
      const msg = game.messages.get(messageId);
      if (msg) {
        try {
          await msg.delete();
        } catch (e) {
          console.warn("Failed to delete message", e);
        }
      }
    }

  }, fade);
}

