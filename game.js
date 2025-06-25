import { quiz_Frida } from './questions.js' // Importe les questions du quiz depuis le fichier questions.js
const AfficherQuestions = document.querySelector(".question") // Sélectionne l'élément HTML où la question sera affichée
const AfficherOption = document.querySelector(".options") // Sélectionne l'élément HTML où les options seront affichées
const suivant = document.querySelector("#next-button") // Sélectionne le bouton "Suivant" par son identifiant
const replayButton = document.getElementById('replay-button')// Sélectionne le bouton "Rejouer" par son identifiant

let currentQuestionIndex = 0// Initialise l'index de la question courante à 0
let score = 0 // Initialise le score du joueur à 0

function loadQuestion(currentQuestion){
    const question1 = quiz_Frida.questions[currentQuestion].text // Récupère le texte de la première question du quiz
    AfficherQuestions.innerText = question1    // Affiche la première question dans l'élément sélectionné
    AfficherOption.innerHTML = "" // Efface les options précédentes avant d'afficher les nouvelles
    let incrementationId = 1// Pour chaque option de la première question, crée un bouton et l'ajoute à la page

    quiz_Frida.questions[currentQuestion].options.forEach(elem => {
        const option_btn = document.createElement('button'); // Crée un bouton
        option_btn.innerText = elem; // Définit le texte du bouton
        option_btn.classList.add('answer'); // Ajoute une classe CSS au bouton
        option_btn.setAttribute("id",`reponse${incrementationId}`)
        AfficherOption.appendChild(option_btn); // Ajoute le bouton à l'élément options
        incrementationId ++
    });

    const boutonOption = document.querySelectorAll('.answer') // Ajoute un écouteur d'événement à chaque bouton réponse
    boutonOption.forEach(element => { 
        element.addEventListener('click', checkAnswer) 
    })

}

loadQuestion(currentQuestionIndex)

suivant.addEventListener('click', () => {
    suivant.disabled = true
    currentQuestionIndex += 1// Incrémente l'index de la question courante
    let totalQuestion = parseInt(quiz_Frida.questions.length)
    if (currentQuestionIndex < totalQuestion) {    // Vérifie s'il reste des questions à afficher
        loadQuestion(currentQuestionIndex) // Afficher la question suivante
    } 
    else {// Si plus de questions, indiquer la fin du quiz
        if(score == totalQuestion){
            AfficherQuestions.innerText = "Félicitations, tu as obtenu le score parfait de : " + score + '/' + totalQuestion;    
        } 
        else if(score == 0) {
            AfficherQuestions.innerText = "T'y est un tigre le sang : " + score + '/' + totalQuestion;
        } 
        else if(score > totalQuestion / 2){
            AfficherQuestions.innerText = 'Bravo, tu as obtenu : ' + score + '/' + totalQuestion;
        } 
        else if(score <= totalQuestion / 2){
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
    score = 0 //  Réinitialiser le score
    currentQuestionIndex = 0 //  Réinitialiser l'index 
    suivant.style.display ='inline-block'; // Reafficher le bouton Suivant
    replayButton.style.display = 'none' // Cacher le bouton pour rejouer
    loadQuestion(currentQuestionIndex)   // Recharger la première question
  
});



function checkAnswer(event){
    const answerId = document.getElementsByClassName("answer") //Récupère tous les éléments avec la classe "answer".
    let reponse = quiz_Frida.questions[currentQuestionIndex].correct_answer // stockage de la réponse
    let choix = event.target.innerText  //Récupère le texte de la réponse choisie par l'utilisateur.

    if (choix == reponse){ // lorsqu'on a la bonne réponse
        event.target.style.border = "5px solid green" //Met une bordure verte autour de la réponse sélectionnée.
        suivant.disabled = false//Active le bouton "suivant".
        score ++//Incrémente le score.
        for(let i=0; i < answerId.length; i ++){//Désactive tous les boutons de réponse. 
            answerId[i].disabled = true
        }
    }
    else{ // lorsqu'on pas la bonne réponse
        event.target.style.border = "5px solid red" // Met une bordure rouge autour de la réponse sélectionnée.
        suivant.disabled = false //Active le bouton "suivant".
        for(let i=0; i < answerId.length; i ++){//Désactive tous les boutons de réponse.
            answerId[i].disabled = true
            if(answerId[i].innerText == reponse){//Met une bordure verte autour de la bonne réponse.
                answerId[i].style.border = "5px solid green"  
            }
        }
    }

}


