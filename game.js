// Importe les questions du quiz depuis le fichier questions.js
import { quiz_Frida } from './questions.js'
// Sélectionne l'élément HTML où la question sera affichée
const AfficherQuestions = document.querySelector(".question")
// Sélectionne l'élément HTML où les options seront affichées
const AfficherOption = document.querySelector(".options")
// Sélectionne le bouton "Suivant" par son identifiant
const suivant = document.querySelector("#next-button")
const replayButton = document.getElementById('replay-button')
const nombreQuestion = quiz_Frida.questions.lenght
// Initialise l'index de la question courante à 0
let currentQuestionIndex = 0

let score = 0

function loadQuestion(currentQuestion){
    // Récupère le texte de la première question du quiz
    const question1 = quiz_Frida.questions[currentQuestion].text
    // Affiche la première question dans l'élément sélectionné
    AfficherQuestions.innerText = question1
    // Efface les options précédentes avant d'afficher les nouvelles
    AfficherOption.innerHTML = ""
    // Pour chaque option de la première question, crée un bouton et l'ajoute à la page
    let incrementationId = 1


    quiz_Frida.questions[currentQuestion].options.forEach(elem => {
        const option_btn = document.createElement('button'); // Crée un bouton
        option_btn.innerText = elem; // Définit le texte du bouton
        option_btn.classList.add('answer'); // Ajoute une classe CSS au bouton
        option_btn.setAttribute("id",`reponse${incrementationId}`)
        AfficherOption.appendChild(option_btn); // Ajoute le bouton à l'élément options
        incrementationId ++
    });

        //On place nos addEventListener ici car on souhaite qu'ils soient instanciés tout le temps
        //de cette façon, ils seront chargés a chaque changement de question
    const boutonOption = document.querySelectorAll('.answer')

    boutonOption.forEach(element => {
        element.addEventListener('click',checkAnswer)
    })

}

loadQuestion(currentQuestionIndex)

suivant.addEventListener('click', () => {
    suivant.disabled = true
    // Incrémente l'index de la question courante
    currentQuestionIndex += 1
    // Vérifie s'il reste des questions à afficher
    let totalQuestion = parseInt(quiz_Frida.questions.length)
    if (currentQuestionIndex < totalQuestion) {
        // Afficher la question suivante
        loadQuestion(currentQuestionIndex)
    } else {
        // Si plus de questions, indiquer la fin du quiz
        if(score == totalQuestion){
            AfficherQuestions.innerText = "Félicitations, tu as obtenu le score parfait de : " + score + '/' + totalQuestion;    
        } else if(score == 0) {
            AfficherQuestions.innerText = "T'y est un tigre le sang : " + score + '/' + totalQuestion;
        } else if(score > totalQuestion / 2){
            AfficherQuestions.innerText = 'Bravo, tu as obtenu : ' + score + '/' + totalQuestion;
        } else if(score <= totalQuestion / 2){
            AfficherQuestions.innerText = 'Pas fou ça tu peux mieux faire : ' + score + '/' + totalQuestion;
        }
        else{
            AfficherQuestions.innerText = "Tout est cassé" + score + '/' + totalQuestion;
        }
        
        AfficherOption.innerHTML = ''; // Effacer les options
        suivant.style.display ='none'; // Cacher le bouton Suivant
        replayButton.style.display = 'inline-block' // Reafficher le bouton pour rejouer

    }
})


// Fonction pour réinitialiser le quiz
replayButton.addEventListener('click', () => {
    currentQuestionIndex = 0 //  Réinitialiser l'index 
    suivant.style.display ='inline-block'; // Reafficher le bouton Suivant
    replayButton.style.display = 'none' // Cacher le bouton pour rejouer
    loadQuestion(currentQuestionIndex)   // Recharger la première question
  
});



function checkAnswer(event){
    const answerId = document.getElementsByClassName("answer")
    let reponse = quiz_Frida.questions[currentQuestionIndex].correct_answer // stockage de la réponse
    let choix = event.target.innerText  

    if (choix == reponse){ // lorsqu'on a la bonne réponse
        event.target.style.border = "5px solid green" 
        suivant.disabled = false
        score ++
        for(let i=0; i < answerId.length; i ++){
            answerId[i].disabled = true
        }
    }
    else{ // lorsqu'on pas la bonne réponse
        event.target.style.border = "5px solid red" 
        suivant.disabled = false
        for(let i=0; i < answerId.length; i ++){
            answerId[i].disabled = true
            if(answerId[i].innerText == reponse){
                answerId[i].style.border = "5px solid green"  
            }
        }
    }

}


