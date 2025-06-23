import { quiz_Frida } from './questions.js'

const AfficherQuestions = document.querySelector(".question")
const AfficherOption = document.querySelector(".options")
const question1 = quiz_Frida.questions[0].text

AfficherQuestions.innerText = question1

quiz_Frida.questions[0].options.forEach(elem => {
    const option_btn = document.createElement('button');
    option_btn.innerText = elem;
    option_btn.classList.add('answer');
    AfficherOption.appendChild(option_btn);
});
