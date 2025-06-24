// Importe les questions du quiz depuis le fichier questions.js
import { quiz_Frida } from './questions.js'

// Sélectionne l'élément HTML où la question sera affichée
const AfficherQuestions = document.querySelector(".question")
// Sélectionne l'élément HTML où les options seront affichées
const AfficherOption = document.querySelector(".options")

// Sélectionne le bouton "Suivant" par son identifiant
const suivant = document.querySelector("#next-button")
//const suivant = document.getElementByClass("next-button")
//const suivant = document.getElementById("next-button")

const replayButton = document.getElementById('replay-button')

// Initialise l'index de la question courante à 0
let currentQuestionIndex = 0


function loadQuestion(currentQuestion){
    // Récupère le texte de la première question du quiz
    const question1 = quiz_Frida.questions[currentQuestion].text
    // Affiche la première question dans l'élément sélectionné
    AfficherQuestions.innerText = question1
    // Efface les options précédentes avant d'afficher les nouvelles
    AfficherOption.innerHTML = ""
    // Pour chaque option de la première question, crée un bouton et l'ajoute à la page
    quiz_Frida.questions[currentQuestion].options.forEach(elem => {
        const option_btn = document.createElement('button'); // Crée un bouton
        option_btn.innerText = elem; // Définit le texte du bouton
        option_btn.classList.add('answer'); // Ajoute une classe CSS au bouton
        AfficherOption.appendChild(option_btn); // Ajoute le bouton à l'élément options
    });
}

loadQuestion(currentQuestionIndex)

suivant.addEventListener('click', () => {
    // Incrémente l'index de la question courante
    currentQuestionIndex += 1
    // Vérifie s'il reste des questions à afficher
    if (currentQuestionIndex < quiz_Frida.questions.length) {
        // Afficher la question suivante
        loadQuestion(currentQuestionIndex)
    } else {
        // Si plus de questions, indiquer la fin du quiz
        AfficherQuestions.innerText = 'Bravo quiz fini';
        AfficherOption.innerHTML = ''; // Effacer les options
        suivant.style.display ='none'; // Cacher le bouton Suivant
        replayButton.style.display = 'inline-block' // Reafficher le bouton pour rejouer

    }
})

/*suivant.addEventListener('click', toTheNextPage)

function toTheNextPage(){
    currentQuestionIndex ++
    if(currentQuestionIndex < quiz_Frida.questions.lenght){
        loadQuestion(currentQuestionIndex)
    } else {
        AfficherQuestions.innerText = 'Bravo vous avez fini le quizz'
        AfficherOption.innerHTML = ''
        suivant.style.display='none'
    }
}

*/

// Fonction pour réinitialiser le quiz
replayButton.addEventListener('click', () => {
    currentQuestionIndex = 0 //  Réinitialiser l'index 
    suivant.style.display ='inline-block'; // Reafficher le bouton Suivant
    replayButton.style.display = 'none' // Cacher le bouton pour rejouer
    loadQuestion(currentQuestionIndex)   // Recharger la première question
  
});
