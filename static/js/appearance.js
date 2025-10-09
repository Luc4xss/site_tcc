let mode = "Claro";
let style = "Minimizado";

const mode_selector = document.querySelector("#mode-selector");
const style_selector = document.querySelector("#style-selector");
const font_selector = document.querySelector("#font-size-selector");

// MODO ESCURO E MODO CLARO

function atualizarModo() {
  const mode = localStorage.getItem("user-mode") || "light";

  if (mode_selector) {
    mode_selector.value = mode;
  }

  document.documentElement.classList.remove("light", "dark");
  if (mode === "Escuro") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.add("light");
  }
}

if (mode_selector) {
  mode_selector.addEventListener("change", () => {
    localStorage.setItem("user-mode", mode_selector.value);
    let mode = localStorage.getItem("user-mode");
    atualizarModo();
  });
}

atualizarModo();

// ESTILO TELA CHEIA E MINIMIZADO

function atualizarEstilo() {
  style = localStorage.getItem("user-style");
  if (style_selector) {
    style_selector.value = style;
  }

  if (style == "Minimizado") {
    document.querySelector(".container").style.height = "92%";
    document.querySelector(".container").style.width = "90%";
    document.documentElement.style.setProperty("--border-radius", "0.6rem");
  } else {
    document.querySelector(".container").style.height = "100%";
    document.querySelector(".container").style.width = "100%";
    document.documentElement.style.setProperty("--border-radius", "0rem");
  }
}

if (style_selector) {
  style_selector.addEventListener("change", () => {
    localStorage.setItem("user-style", style_selector.value);
    console.log(localStorage.getItem("user-style"));
    style = localStorage.getItem("user-style");
    atualizarEstilo();
  });
}

atualizarEstilo();

function atualizarFonte(font) {
  font = localStorage.getItem("user-font") || "Media";
  if (font_selector) {
    font_selector.value = font;
  }
  document.documentElement.classList.remove(
    "font-Pequena",
    "font-Media",
    "font-Grande"
  );
  document.documentElement.classList.add("font-" + font);
}

atualizarFonte(localStorage.getItem("user-font"));

if (font_selector) {
  font_selector.addEventListener("change", () => {
    localStorage.setItem("user-font", font_selector.value);
    let font = localStorage.getItem("user-font");
    atualizarFonte(font);
  });
}

// RESETAR CONFIGURAÇÕES

function resetAppearenceSettings() {
  localStorage.setItem("user-font", "Media")
  atualizarFonte();

  localStorage.setItem("user-style", "Tela cheia");
  atualizarEstilo();

  localStorage.setItem("user-mode", "Claro");
  atualizarModo();
}

//  --main-bg: rgb(27, 27, 29);
//  --sec-bg: rgb(39, 41, 44);
