const interaction_selector = document.querySelector("#interaction-selector");
const comment_interactions = document.querySelector(".comment-container");
const like_interactions = document.querySelector(".likes-container");
like_interactions.style.display = "none"


interaction_selector.addEventListener("change", () => {
  if (interaction_selector.value == "likes") {
    comment_interactions.style.display = "none";
    like_interactions.style.display = "flex";

  } else {
    comment_interactions.style.display = "flex";
    like_interactions.style.display = "none";

  }
});
