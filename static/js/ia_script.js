const send_button = document.querySelector("#send-script-btn");
const title = document.querySelector(".title");
const script_text = document.querySelector("#script-text");
const prompt_selector = document.querySelector("#prompt-selector");
const language_selector = document.querySelector("#language-selector");
const form_area = document.querySelector(".form-area");
const scroll_area = document.querySelector(".scroll-area");

const messages_container = document.querySelector(".messages-container");

const user_question = document.querySelector(".user-question-container");
const ia_answer = document.querySelector(".ia-response-container");

// EVENTO DO TEXT AREA

script_text.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();

  }
});

// EVENTO DE SELEÇÃO DE PROMPT

prompt_selector.addEventListener("change", () => {
  if (
    prompt_selector.value == "Olá, crie um código: " ||
    prompt_selector.value == "Olá, traduza meu código: "
  ) {
    document.querySelector("#language-selector").classList.remove("hide");
  } else {
    document.querySelector("#language-selector").classList.add("hide");
    language_selector.value = "";
  }
});

// EVENTO DE ENVIO DA MENSAGEM PARA A IA

const enviarMensagem = async (e) => {
  if (e) e.preventDefault();

  if (script_text.value) {
    form_area.style.top = "84%";
    title.classList.add("hide");
    scroll_area.classList.remove("hide");

    document.querySelector(".spinner").classList.remove("hide");
    send_button.querySelector("i").classList.add("hide");
    send_button.querySelector("i").style.display = "none";

    const código = script_text.value.trim();
    const pergunta =
      prompt_selector.value.trim() + código + language_selector.value.trim();
    script_text.value = "";
    console.log(pergunta);

    let question_box = user_question.cloneNode(true);
    question_box.querySelector(".user-question-text").textContent = código;
    question_box.classList.remove("hide");
    messages_container.appendChild(question_box);

    let answer_box = ia_answer.cloneNode(true);
    answer_box.querySelector(".ia-response-text").textContent = ".";
    answer_box.classList.remove("hide");
    messages_container.appendChild(answer_box);
    let timer = 0;

    let interval = setInterval(() => {
      timer++;
      answer_box.querySelector(".ia-response-text").textContent += ".";
      if ((timer / 3) % 2 == 0) {
        answer_box.querySelector(".ia-response-text").textContent = "";
      }
    }, 200);

    try {
      const response = await fetch("http://localhost:5000/perguntar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pergunta }),
      });

      const data = await response.json();
      clearInterval(interval);

      const respostaMarkdown = data.resposta || data.erro;
      answer_box.querySelector(".ia-response-text").innerHTML = marked.parse(respostaMarkdown);

      document.querySelector(".spinner").classList.add("hide");
      send_button.querySelector("i").classList.remove("hide");
      send_button.querySelector("i").style.display = "block";
      const scroll_area = document.querySelector(".scroll-area")
      scroll_area.scrollTo({
        top: scroll_area.scrollHeight,
        behavior: "smooth"
      });
      answer_box.querySelector(".copy-text-btn").style.display = "flex"
      answer_box.querySelector(".copy-text-btn").addEventListener("click", (e) => {
        console.log('oi')
        pre = answer_box.querySelector("pre code")
        console.log(pre)
        const text_to_copy = pre.innerText;
        let copy_pop_up = document.querySelector(".copy-pop-up")

        navigator.clipboard.writeText(text_to_copy)
          .then(() => {
            copy_pop_up.style.display = "flex"
            let timeout1 = setTimeout(() => {
              copy_pop_up.classList.add("show")
            }, 10)

            let timeout2 = setTimeout(() => {
              copy_pop_up.classList.remove("show")
            }, 3000)
          })
      })


    } catch (error) {
      clearInterval(interval);
      answer_box.querySelector(".ia-response-text").textContent =
        "Erro na comunicação com a IA.";
    }
  }
};

send_button.addEventListener("click", enviarMensagem);


const close_left_bar_btn = document.querySelector("#close-left-bar-btn")
const open_left_bar_btn = document.querySelector("#open-left-bar-btn")

const left_bar = document.querySelector(".left-bar")
close_left_bar_btn.addEventListener('click', () => {
  left_bar.style.width = "10%"
  let timeout = setTimeout(() => {
    left_bar.style.display = "none"
  }, 100)
})

open_left_bar_btn.addEventListener('click', () => {
  left_bar.style.display = "flex"
  let timeout = setTimeout(() => {
    left_bar.style.width = "70%"
  }, 10)
})
