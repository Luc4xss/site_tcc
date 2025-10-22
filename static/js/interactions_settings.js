const interaction_selector = document.querySelector("#interaction-selector");
const likes_btn = document.querySelector("#likes-btn")
const comments_btn = document.querySelector("#comments-btn")
const comment_interactions = document.querySelector(".comments-container");
const like_interactions = document.querySelector(".likes-container");
const message_interactions = document.querySelector(".messages-container")
like_interactions.style.display = "none"


// SELETOR DE COMENTARIOS, MENSAGENS E CURTIDAS PARA A PÁGINA DE INTERAÇÕES E DA PÁGINA DO USUÁRIO

if (comments_btn) {
  comments_btn.addEventListener("click", () => {
    comment_interactions.style.display = "flex";
    like_interactions.style.display = "none";
    comments_btn.querySelector("i").style.color = "var(--font-color)"
    likes_btn.querySelector("i").style.color = "var(--font-color)"
    comments_btn.querySelector("i").classList.add("fa-solid")
    comments_btn.querySelector("i").classList.remove("fa-regular")
    likes_btn.querySelector("i").classList.remove("fa-solid")
    likes_btn.querySelector("i").classList.add("fa-regular")
  })
}

if (likes_btn) {
  likes_btn.addEventListener("click", () => {
    comment_interactions.style.display = "none";
    like_interactions.style.display = "flex";
    likes_btn.querySelector("i").style.color = "var(--font-color)"
    comments_btn.querySelector("i").style.color = "var(--font-color)"
    likes_btn.querySelector("i").classList.add("fa-solid")
    likes_btn.querySelector("i").classList.remove("fa-regular")
    comments_btn.querySelector("i").classList.remove("fa-solid")
    comments_btn.querySelector("i").classList.add("fa-regular")
  })
}

if (interaction_selector) {
  interaction_selector.addEventListener("change", () => {
    if (interaction_selector.value == "likes") {
      message_interactions.style.display = "none";
      comment_interactions.style.display = "none";
      like_interactions.style.display = "flex";

    } else if (interaction_selector.value == "comment") {
      comment_interactions.style.display = "flex";
      like_interactions.style.display = "none";
      message_interactions.style.display = "none";

    } else {
      comment_interactions.style.display = "none";
      like_interactions.style.display = "none";
      message_interactions.style.display = "flex";
    }
  })
}

// BOTÃO DE COPIAR URL

if (document.querySelector("#share-profile-btn")) {
  document.querySelector("#share-profile-btn").addEventListener("click", () => {
    const url = window.location.href;
    let copy_pop_up = document.querySelector(".copy-pop-up")
    navigator.clipboard.writeText(url)
      .then(() => {
        copy_pop_up.style.display = "flex"
        let timeout1 = setTimeout(() => {
          copy_pop_up.classList.add("show")
        }, 10)

        let timeout2 = setTimeout(() => {
          copy_pop_up.classList.remove("show")
        }, 3000)
      })
      .catch(err => {
      })
  })
}