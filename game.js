// Importe les questions du quiz depuis le fichier questions.js
import { quiz_Frida } from './questions.js'

// Sélectionne l'élément HTML où la question sera affichée
const AfficherQuestions = document.querySelector(".question")
// Sélectionne l'élément HTML où les options seront affichées
const AfficherOption = document.querySelector(".options")
// Récupère le texte de la première question du quiz
const question1 = quiz_Frida.questions[0].text

// Affiche la première question dans l'élément sélectionné
AfficherQuestions.innerText = question1

// Pour chaque option de la première question, crée un bouton et l'ajoute à la page
quiz_Frida.questions[0].options.forEach(elem => {
    const option_btn = document.createElement('button'); // Crée un bouton
    option_btn.innerText = elem; // Définit le texte du bouton
    option_btn.classList.add('answer'); // Ajoute une classe CSS au bouton
    AfficherOption.appendChild(option_btn); // Ajoute le bouton à l'élément options
});
