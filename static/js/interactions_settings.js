const interaction_selector = document.querySelector("#interaction-selector");
const likes_btn = document.querySelector("#likes-btn")
const comments_btn = document.querySelector("#comments-btn")
const comment_interactions = document.querySelector(".comments-container");
const like_interactions = document.querySelector(".likes-container");
like_interactions.style.display = "none"


if (comments_btn) {
  comments_btn.addEventListener("click", () => {
    comment_interactions.style.display = "flex";
    like_interactions.style.display = "none";
    comments_btn.querySelector("i").style.color = "black"
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
    likes_btn.querySelector("i").style.color = "black"
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
      comment_interactions.style.display = "none";
      like_interactions.style.display = "flex";

    } else {
      comment_interactions.style.display = "flex";
      like_interactions.style.display = "none";
    }
  })
}
