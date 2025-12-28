export function addSUIQLinksToSettings(app, html) {
  const gameSettingsHeader = html.querySelector("h4.divider");
  if (!gameSettingsHeader) {
    console.error("No header <h4.divider> found in parameters");
    return;
  }

  const currentLang = game.i18n.lang;

  const logoMap = {
    "fr": {
      "light": "logo-fr.svg",
      "dark": "logo-fr-dark.svg"
    }
  };

  const defaultLogos = {
    "light": "logo.svg",
    "dark": "logo-dark.svg"
  };

  function getCurrentTheme() {
    if (html.classList.contains("theme-dark")) return "dark";
    if (html.classList.contains("theme-light")) return "light";
    return game.settings.get("core", "uiConfig")?.colorScheme?.interface || "light";
  }

  function getLogoPath() {
    const theme = getCurrentTheme();

    let logoFile;
    if (logoMap[currentLang]?.[theme]) {
      logoFile = logoMap[currentLang][theme];
    } else if (logoMap[currentLang]) {
      logoFile = logoMap[currentLang]["light"] || Object.values(logoMap[currentLang])[0];
    } else {
      logoFile = defaultLogos[theme] || defaultLogos["light"];
    }

    return `systems/shut-up-its-quantum/assets/${logoFile}`;
  }

  // Création de la section personnalisée
  const section = document.createElement("section");
  section.classList.add("settings", "flexcol");

  section.innerHTML = `
    <h4 class="divider">${game.i18n.localize("WORLD.FIELDS.system.label")}</h4>
    <div class="SUIQ system-badge">
      <img class="dynamic-logo" src="${getLogoPath()}">
    </div>
  `;

  const linkKeys = [
    { icon: "fa-solid fa-bookmark", key: "Site" },
    { icon: "fab fa-github", key: "Git" },
    { icon: "fa-regular fa-mug-hot fa-bounce", key: "Donation" }
  ];

  for (let i = 0; i < linkKeys.length; i++) {
    const link = linkKeys[i];
    const localizedText = game.i18n.localize(`SUIQ.Links.${link.key}Title`);
    const localizedURL = game.i18n.localize(`SUIQ.Links.${link.key}URL`);
    const linkSection = document.createElement("section");
    linkSection.classList.add("settings", "flexcol");

    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<i class="${link.icon}"></i> ${localizedText} <sup><i class="fa-light fa-up-right-from-square"></i></sup>`;

    if (i === linkKeys.length - 1) {
      button.style.marginBottom = "1rem";
    }

    button.addEventListener("click", ev => {
      ev.preventDefault();
      window.open(localizedURL, "_blank");
    });

    linkSection.appendChild(button);
    section.appendChild(linkSection);
  }

  gameSettingsHeader.parentNode.insertBefore(section, gameSettingsHeader);

  // Observer pour changer le logo selon thème
  const logoImg = section.querySelector(".dynamic-logo");
  const observer = new MutationObserver(() => {
    const newSrc = getLogoPath();
    if (logoImg.getAttribute("src") !== newSrc) {
      logoImg.setAttribute("src", newSrc);
    }
  });
  observer.observe(html, { attributes: true, attributeFilter: ["class"] });
}

const settings = [
  { key: "quantumω", name: "Quantωm", config: false, type: Number, default: 0 },
  { key: "quantumΩ", name: "QuantuΩ", config: false, type: Number, default: 0 },
  { key: "quantumξ", name: "Quanξum", config: false, type: Number, default: 0 },
  { key: "quantumΞ", name: "quantΞm", config: false, type: Number, default: 1 },

  { key: "quantumℰ", name: "Quantuℰ", config: false, type: Array, default: [] },
  { key: "quantumℰ1", name: "Quantuℰ1", config: false, type: Array, default: [] },
  { key: "quantumℰ2", name: "Quantuℰ2", config: false, type: Array, default: [] },
  { key: "quantumℰ3", name: "Quantuℰ3", config: false, type: Array, default: [] },
  { key: "quantum⇑", name: "Quan⇑um", config: false, type: Array, default: [] },
  { key: "quantum⧉", name: "Qu⧉ntum", config: false, type: Array, default: [] },
  { key: "quantum⊘", name: "Qu⊘ntum", config: false, type: Array, default: [] },
  { key: "quantum𐊧", name: "Quant𐊧m", config: false, type: Array, default: [] },
  { key: "quantum⟁", name: "Qu⟁ntum", config: false, type: Array, default: [] },
  { key: "quantumջ", name: "Quջntum", config: false, type: Array, default: [] },

  { key: "quantumɎ",  name: "QuantɎm",  config: false, type: Boolean, default: false },

  { key: "quantum◇A", name: "SUIQ.Settings.SquareA.Name", hint: "SUIQ.Settings.SquareA.Hint", config: true, type: Boolean, default: false },
  { key: "quantum◇B", name: "SUIQ.Settings.SquareB.Name", hint: "SUIQ.Settings.SquareB.Hint", config: false, type: Boolean, default: false },
  { key: "quantum◇C", name: "SUIQ.Settings.SquareC.Name", hint: "SUIQ.Settings.SquareC.Hint", config: false, type: Boolean, default: false }
];

export function registerSUIQSettings(systemId) {
  for (const s of settings) {
    game.settings.register(systemId, s.key, {
      name: s.name,
      hint: s.hint,
      scope: "world",
      config: s.config,
      type: s.type,
      default: s.default,
      onChange: () => {
        if (s.key.startsWith("quantum◇")) {
          refreshQuantumGateConfig(systemId);
        }
      }
    });
  }
}

export function refreshQuantumGateConfig(systemId) {
  const A = game.settings.get(systemId, "quantum◇A");
  const B = game.settings.get(systemId, "quantum◇B");

  const settings = game.settings.settings;
  settings.get(`${systemId}.quantum◇B`).config = A;
  settings.get(`${systemId}.quantum◇C`).config = A && B;

  if (ui.settings) ui.settings.render(true);
}