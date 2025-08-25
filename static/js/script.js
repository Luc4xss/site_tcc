const show = document.querySelector("#btn-showpassword");
let mostrando = false;
let icone = document.querySelector("i");
let input = document.querySelectorAll("input");

show.addEventListener("click", (e) => {
  if (mostrando == false) {
    let password = document
      .querySelector("#senha")
      .setAttribute("type", "text");
    icone.classList.remove("fa-eye-slash");
    icone.classList.add("fa-eye");

    mostrando = true;
  } else {
    let password = document
      .querySelector("#senha")
      .setAttribute("type", "password");
    icone.classList.remove("fa-eye");
    icone.classList.add("fa-eye-slash");

    mostrando = false;
  }
});

if (document.querySelector(".question-picker-container")) {
  container.addEventListener("wheel", (evt) => {
    if (evt.deltaY !== 0) {
      evt.preventDefault();
      container.scrollLeft += evt.deltaY;
    }
  });
}

input.forEach((e) => {
  e.addEventListener("click", () => e.classList.remove("login-error"));
});
