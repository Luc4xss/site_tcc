// SISTEMA DE CURTIDAS

if (document.querySelector(".like-comment-btn")) {
  document.querySelectorAll(".like-comment-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const comentarioId = btn.dataset.id;

      const response = await fetch(`/like/${comentarioId}`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.status === "success") {
        const icon = btn.querySelector("i");
        const countElem = btn.nextElementSibling;
        let count = parseInt(countElem.innerText);

        if (data.action === "liked") {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style.color = "red";
          countElem.innerText = count + 1;
        } else {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
          icon.style.color = "var(--font-color)";
          countElem.innerText = count - 1;
        }
      }
    });
  });
}

// SISTEMA DE NOTIFICAÇÕES

const option_text = document.querySelectorAll(".option .link-text");
let open = false;

const notification_button = document.querySelector("#notification-btn");
notification_button.addEventListener("click", (e) => {
  e.preventDefault();
  if (open) {
    document.querySelector(".left-bar").classList.remove("minimized");
    document.querySelector(".left-bar").style.minWidth = "27rem";
    document.querySelectorAll(".option i").forEach((e) => {
      e.classList.add("hide");
    });
    option_text.forEach((e) => {
      e.style.display = "block";
    });

    document.querySelector(".notifications-bar").classList.remove("open");

    open = false;
  } else {
    document.querySelector(".left-bar").classList.add("minimized");
    document.querySelector(".left-bar").style.minWidth = "7.6rem";
    document.querySelectorAll("i").forEach((e) => {
      e.classList.remove("hide");
    });
    option_text.forEach((e) => {
      e.style.display = "none";
    });

    document.querySelector(".notifications-bar").classList.add("open");
    open = true;
  }
});
