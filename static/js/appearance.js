let mode = "Claro";
let style = "Minimizado";

const mode_selector = document.querySelector("#mode-selector");
const style_selector = document.querySelector("#style-selector");

// MODO ESCURO E MODO CLARO

function atualizarModo() {
  mode = localStorage.getItem("user-mode");
  if (mode_selector) {
    mode_selector.value = mode;
  }
  if (mode == "Claro") {
    document.documentElement.style.setProperty("--main-bg", "#ffffff");
    document.documentElement.style.setProperty("--sec-bg", "#ebebee");
    document.documentElement.style.setProperty("--font-color", "#575757");
    document.documentElement.style.setProperty("--hover-bg", "#d9d9e0");

    // ESTILIZAÇÃO PARA A PÁGINA DE CONFIGURAÇÕES

    if (document.querySelector(".options-container")) {
      document.querySelector(".options-container").style.background =
        "var(--main-bg)";
    }

    // ESTILIZAÇÃO PARA A PÁGINA PRINCIPAL

    if (document.querySelector(".main-content header")) {
      document.querySelector(".main-content header").style.background =
        "var(--main-bg)";
      document.querySelector(".question-picker-container").style.background =
        "var(--main-bg)";
      document.querySelector(".comment").style.background = "var(--main-bg)";
      document.querySelector(".container").style.background = "var(--sec-bg)";
      document.querySelector(".btn-container").style.background =
        "var(--main-bg)";
      document.querySelector(".sec-btn-container").style.background =
        "var(--main-bg)";
      document.querySelector(".comment").style.background = "var(--main-bg)";
    }

    // ESTILIZAÇÃO PARA A PÁGINA DA IA

    if (document.querySelector("#ia-footer-warn")) {
      document.documentElement.style.setProperty("--border", "#dcdee7");

      document.querySelector(".form-area").style.background = "var(--main-bg)";
      document.querySelector(".text-container").style.background =
        "var(--main-bg)";
      document.querySelector("#language-selector").style.background =
        "var(--main-bg)";
      document.querySelector("#prompt-selector").style.background =
        "var(--main-bg)";
    }

    // ESTILIZAÇÃO PARA A PÁGINA DO PERFIL
    if (document.querySelector(".profile-container")) {
      document.querySelector(".infos").style.background =
        "var(--profile-title-bg)";
      document.querySelector(".profile-preview").style.background =
        "var(--main-bg)";
      document.querySelector(".warn-container").style.background =
        "var(--profile-title-bg)";
    }
  } else {
    document.documentElement.style.setProperty("--main-bg", "#1b1b1d");
    document.documentElement.style.setProperty("--sec-bg", "#27292c");
    document.documentElement.style.setProperty("--font-color", "#ffffff");
    document.documentElement.style.setProperty("--hover-bg", "#262629");

    // ESTILIZAÇÃO PARA A PÁGINA DE CONFIGURAÇÕES

    if (document.querySelector(".options-container")) {
      document.querySelector(".options-container").style.background =
        "var(--sec-bg)";
    }

    // ESTILIZAÇÃO PARA A PÁGINA PRINCIPAL

    if (document.querySelector(".main-content header")) {
      document.querySelector(".left-bar").style.border =
        "0rem 0.2rem solid var(--sec-bg) 0rem 0rem";
      document.querySelector(".search-input").style.background =
        "var(--main-bg)";
      document.querySelector(".search-input").style.border =
        "0.1rem solid var(--sec-bg)";
      document.querySelector(".comment").style.background = "var(--sec-bg)";
      document.querySelector("#no-found-error").style.background =
        "var(--main-bg)";
    }

    // ESTILIZAÇÃO PARA A PÁGINA DA IA

    if (document.querySelector("#ia-footer-warn")) {
      document.documentElement.style.setProperty("--border", "#46474b");
      document.documentElement.style.setProperty("--font-color", "#f0f0f0");

      document.querySelector(".form-area").style.background = "var(--sec-bg)";
      document.querySelector("#language-selector").style.background =
        "var(--sec-bg)";
      document.querySelector("#prompt-selector").style.background =
        "var(--sec-bg)";
    }

    // ESTILIZAÇÃO PARA A PÁGINA DO PERFIL
    if (document.querySelector(".profile-container")) {
      document.querySelectorAll(".input-content input").forEach((e) => {
        e.style.color = "var(--sec-bg)";
      });
    }
  }
}

atualizarModo();

if (mode_selector) {
  mode_selector.addEventListener("change", () => {
    localStorage.setItem("user-mode", mode_selector.value);
    mode = localStorage.getItem("user-mode");
    atualizarModo();
  });
}

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

atualizarEstilo();

if (style_selector) {
  style_selector.addEventListener("change", () => {
    localStorage.setItem("user-style", style_selector.value);
    console.log(localStorage.getItem("user-style"));
    style = localStorage.getItem("user-style");
    atualizarEstilo();
  });
}

//  --main-bg: rgb(27, 27, 29);
//  --sec-bg: rgb(39, 41, 44);
