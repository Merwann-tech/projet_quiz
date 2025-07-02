import { quiz } from './questions.js' // Importe les questions du quiz depuis le fichier questions.js

/*****************************************************Importation Du Dom********************************************************************** */
const DISPLAY_QUESTIONS = document.querySelector(".question")
const DISPLAY_OPTION = document.querySelector(".options")
const NEXT_BUTTON = document.querySelector("#next-button")
const REPLAY_BUTTON = document.getElementById('replay-button')
const SCORE_BUTTON = document.getElementById('scoreRegister')
const SCOREBOARD = document.getElementById('score')
const TIMER = document.getElementById("timer")
const PROGRESS_BAR = document.getElementById("progress")

/*****************************************************creation variable********************************************************************** */
let currentQuestionIndex = 0// Initialise l'index de la question courante à 0
let score = 0 // Initialise le score du joueur à 0
let numCategories = 0 // Initialise la catégorie à 0, on pourrait la laisser vide
let categories = quiz.categories[numCategories] // on récupère la liste des catégories
let time = "" //variable tampon function setTimer
let remainingTime = 15 //temps donner pour répondre
let totalTime = 0  //temps total d'une personne pour un quiz
let toggleF2 = true

/*****************************************************Appel fonction depart********************************************************************** */

choiceQuiz()

/*****************************************************Fonction********************************************************************** */

//Fonction qui va lancer l'interface et permettre à l'utilisateur de choisir un quiz
function choiceQuiz(){
    DISPLAY_QUESTIONS.style.height = "100px" // je rechange la valeur du height car on la modifie a la fin pour afficher les gifs au résultat
    NEXT_BUTTON.style.display ='none'
    SCORE_BUTTON.style.display ='none'
    DISPLAY_QUESTIONS.innerText = "Choisis ton Quiz" // changer l'affichage
    DISPLAY_OPTION.innerHTML = ''   // on vide l'affichage des options
    let incrementationQuiz = 0    // permet de donner un id aux boutons de quiz --> voir dans boucle forEach

    quiz.categories.forEach(categorieName => {
        const OPTION_BTN = document.createElement('button') // Crée un bouton
        OPTION_BTN.innerText = categorieName.nom // Définit le texte du bouton
        OPTION_BTN.classList.add('classQuiz') // Ajoute une classe CSS au bouton
        OPTION_BTN.setAttribute("id",incrementationQuiz) // Permet de rajouter une id au bouton et permet de sélectionner le bon questionnaire
        DISPLAY_OPTION.appendChild(OPTION_BTN) // Ajoute le bouton à l'élément options
        incrementationQuiz ++                            // Permet de changer l'id de chacun des quiz
        OPTION_BTN.addEventListener('click', checkQuiz) // lance la fonction checkQuiz
    })
}

//Fonction qui permet d'afficher le quiz choisi par l'utilisateur et initialise la progress bar de ce quiz
//Affiche le scoreboard
function checkQuiz(event){
    numCategories = parseInt(event.target.id)
    categories = quiz.categories[numCategories] // on récupère le numéro de catégorie  
    PROGRESS_BAR.max = parseInt(categories.questions.length)
    PROGRESS_BAR.value = 0
    PROGRESS_BAR.style.display = 'inline-block'
    scoreBoardUpdate()
    loadQuestion(currentQuestionIndex)
}

//Fonction qui permet d'afficher la question en cours et les différentes options de réponses
//Affiche le timer et affiche le bouton suivant
function loadQuestion(currentQuestion){
    setTimer()
    NEXT_BUTTON.style.display ='inline-block'
    const QUESTION1 = categories.questions[currentQuestion].text // Récupère le texte de la première question du quiz
    DISPLAY_QUESTIONS.innerHTML = `<p><u>Question ${currentQuestionIndex +1} :</u> ${QUESTION1}</p>` // Affiche la première question dans l'élément sélectionné
    DISPLAY_OPTION.innerHTML = "" // Efface les options précédentes avant d'afficher les nouvelles
    let incrementationId = 1// Pour chaque option de la première question, crée un bouton et l'ajoute à la page

    //Boucle qui créer les différentes réponses
    randomQuestion().forEach(elem => {
        const NEW_BUTTON = document.createElement('button') // Crée un bouton
        NEW_BUTTON.innerText = elem // Définit le texte du bouton
        NEW_BUTTON.classList.add('answer') // Ajoute une classe CSS au bouton
        NEW_BUTTON.setAttribute("id",`reponse${incrementationId}`)
        DISPLAY_OPTION.appendChild(NEW_BUTTON) // Ajoute le bouton à l'élément options
        incrementationId ++
        NEW_BUTTON.addEventListener('click', checkAnswer) 
    })
}

//Fonction qui permet d'afficher la bonne réponse et rends un affichage différent en fonction du choix
function checkAnswer(event){
    clearInterval(time)
    const ANSWER_ID = document.getElementsByClassName("answer") //Récupère tous les éléments avec la classe "answer".
    let answer = categories.questions[currentQuestionIndex].correct_answer // stockage de la réponse
    let choice = event.target.innerText  //Récupère le texte de la réponse choisie par l'utilisateur.

    if (choice == answer){ // lorsqu'on a la bonne réponse
        event.target.style.border = "5px solid green" //Met une bordure verte autour de la réponse sélectionnée.
        NEXT_BUTTON.disabled = false//Active le bouton "suivant".
        score ++//Incrémente le score.
        for(let i=0; i < ANSWER_ID.length; i ++){//Désactive tous les boutons de réponse. 
            ANSWER_ID[i].disabled = true
        }
    }
    else{ // lorsqu'on pas la bonne réponse
        event.target.style.border = "5px solid red" // Met une bordure rouge autour de la réponse sélectionnée.
        NEXT_BUTTON.disabled = false //Active le bouton "suivant".
        for(let i=0; i < ANSWER_ID.length; i ++){//Désactive tous les boutons de réponse.
            ANSWER_ID[i].disabled = true
            if(ANSWER_ID[i].innerText == answer){//Met une bordure verte autour de la bonne réponse.
                ANSWER_ID[i].style.border = "5px solid green"  
            }
        }
    }

}

//Fonction qui permet de charger la question suivante du quiz
function nextQuestion(){
    totalTime += (15 - remainingTime)
    NEXT_BUTTON.disabled = true
    currentQuestionIndex += 1// Incrémente l'index de la question courante
    PROGRESS_BAR.value = currentQuestionIndex 
    let totalQuestion = parseInt(categories.questions.length)
    if (currentQuestionIndex < totalQuestion) {    // Vérifie s'il reste des questions à afficher
        loadQuestion(currentQuestionIndex) // Afficher la question suivante
    } 
    //FIN QUIZ
    else {
        DISPLAY_QUESTIONS.style.height = "400px"
        TIMER.innerText = `Press f2 for more informations`
        //Affichage quand score Parfait
        if(score == totalQuestion){
            DISPLAY_QUESTIONS.innerHTML = `<p>Félicitations, tu as obtenu le score parfait de : ${score} / ${totalQuestion} en ${totalTime.toFixed(2)}sec</p>` +
                            "<img class = gif src = https://www.icegif.com/wp-content/uploads/2023/05/icegif-105.gif alt = score_parfait />"
        }
        
        //Affichage quand le score est de 0
        else if(score == 0) {
            DISPLAY_QUESTIONS.innerHTML = `<p> T'y est un tigre le sang : ${score} / ${totalQuestion} en ${totalTime.toFixed(2)}sec</p>` +
                            "<img class = gif src = https://media.tenor.com/ih7NzdreP3sAAAAM/hungry-tiger-cub-licking-tiger-cub.gif alt = Tigre />"

        }

        //Affichage quand score au dessus de la moyenne
        else if(score > totalQuestion / 2){
            DISPLAY_QUESTIONS.innerHTML = `<p>Bravo, tu as obtenu : ${score} / ${totalQuestion} en ${totalTime.toFixed(2)}sec</p>` +
                            "<img class = gif src = https://media.tenor.com/R4hfEKhV_SEAAAAM/good-job-awesome.gif alt = score_correct />"
        } 

        //Affichage quand score en dessous de la moyenne
        else if(score <= totalQuestion / 2){
            DISPLAY_QUESTIONS.innerHTML = `<p>Pas fou ça tu peux mieux faire : ${score} / ${totalQuestion} en ${totalTime.toFixed(2)}sec</p>` +
                            "<img class = gif src = https://media.tenor.com/QsOGinNNNU0AAAAM/not-very-good-benjamin.gif alt = score_horrible />"
        }

        // Si ça marche pas au moins ça nous le dit
        else{
            DISPLAY_QUESTIONS.innerText = "Tout est cassé" + score + '/' + totalQuestion
        }
        
        DISPLAY_OPTION.innerHTML = '' // Effacer les options
        NEXT_BUTTON.style.display ='none' // Cacher le bouton Suivant
        REPLAY_BUTTON.style.display = 'inline-block' // Reafficher le bouton pour rejouer
        highScore()

    }

}

//Fonction qui permet de recharger l'écran de sélection des quiz et remets à 0 les variables
//Désaffiche le highscore et le timer
function nextQuiz(){
    totalTime = 0
    TIMER.style.display ='none'
    PROGRESS_BAR.style.display ='none'
    SCOREBOARD.style.display ='none'
    score = 0 //  Réinitialiser le score
    currentQuestionIndex = 0 //  Réinitialiser l'index 
    NEXT_BUTTON.style.display ='inline-block' // Reafficher le bouton Suivant
    REPLAY_BUTTON.style.display = 'none' // Cacher le bouton pour rejouer
    choiceQuiz()   // Recharger la page de sélection ( la première page quoi )
}


/*****************************************************features********************************************************************** */

// Fonction gestion du timer.
function setTimer(){
    TIMER.style.display ='inline-block'                         // Affichage du timer
    remainingTime = 15                                          // Réinitialise le timer
    TIMER.innerText = `Temps restant : ${remainingTime}s`       // Affiche le timer
    time = setInterval(() => {                                  // lance la fonction set interval toutes les 10 millisecondes
    remainingTime = (remainingTime - 0.01).toFixed(2)           // enlève 0.01 seconde toutes les 10 millisecondes
    TIMER.innerText = `Temps restant : ${remainingTime}s`       // actualise l'affichage du timer
    if (remainingTime <= 0) {                                   //* Quand timer arrive à zéro, reset le timer et attend la question suivante 
        clearInterval(time)                                     //*
        nextQuestion()                                          //*
    }
    }, 10)                                                      //répete la boucle toutes les 10 millisecondes
}

// Fonction randomisation des questions.
function randomQuestion(){
    let random = categories.questions[currentQuestionIndex].options // récupère les options en cours dans une variable random.
    random.sort(() => Math.random() - 0.5)                          // on les mélange. On choisit un nombre entre 0 et 1 --> si < 0, on recule l'élément dans le tableau. si == 0, on ne bouge pas, si > 0, on avance l'élément dans le tableau
    return random                                                   // on les renvoit.
}

// Fonction qui gère le stockage des scores (local storage)
function highScore(){
    SCORE_BUTTON.style.display ='inline-block'

    const TEXT = document.createElement('p')  //* on créer une balise paragraphe
    TEXT.setAttribute = ("class", "question") //*
    TEXT.innerText = "choisir votre pseudo"   //*
    DISPLAY_OPTION.appendChild(TEXT)           //*

    const INPUT = document.createElement('input') //* on créer une balise input
    INPUT.setAttribute("id","pseudo")             //*
    DISPLAY_OPTION.appendChild(INPUT)              //*
    

    //Action qui s'effectue quand on appuie sur le bouton enregistré
    SCORE_BUTTON.addEventListener('click', () => {
        let pseudo = document.getElementById("pseudo").value
        if (pseudo.length <= 10 ){  // si le pseudo a moins de 10 caractères
            if (!pseudo.includes("_")){ // si le pseudo n'a pas de "underscore"
                if (pseudo == "delete"){    //* si qqun écrit "delete", on efface le local storage
                    localStorage.clear()    //*
                    scoreBoardUpdate()      //*
                }
                else if (pseudo != ""){ // si le pseudo n'est pas vide
                    localStorage.setItem(`${pseudo}_${categories.nom}`, `${score}/${categories.questions.length}/${totalTime.toFixed(2)}`)  //On enregistre dans le local storage nos données
                    scoreBoardUpdate()
                    DISPLAY_OPTION.innerHTML = "" // on retire l'input et le texte ( <p></p> <input></input> )
                    SCORE_BUTTON.style.display ='none'   // on supprime le bouton enregistré
                }
            }
        }    
    })
}

// Fonction qui gère l'affichage des scores. 
function scoreBoardUpdate(){
    SCOREBOARD.style.display ='inline-block' // on affiche le scoreboard
    SCOREBOARD.innerText = "Meilleurs scores"   // on écrit "Meilleurs scores"
    SCOREBOARD.innerHTML += `<br>${categories.nom}` // on ecrit la catégorie

    let localArray = Object.keys(localStorage)  // On créer un tableau temporaire
        .filter(key => key.endsWith(`_${categories.nom}`))  // on stocke seulement une partie de l'information, celles de la catégorie en cours
        .map(key => {   //.map sert à préciser les différentes catégories de notre tableau
            return {
                pseudo: key.split("_")[0],                          //* On récupere le pseudo
                value: localStorage.getItem(key).split("/")[0],     //* On récupere le score
                scoreMax: localStorage.getItem(key).split("/")[1],  //* On récupere le score maximal 
                time: localStorage.getItem(key).split("/")[2]       //* On récupère le temps mis
            }
        })
    localArray.sort((a, b) => a.time - b.time)  // On le trie par temps
    localArray.sort((a, b) => b.value - a.value) // On le trie par score
    

    if (toggleF2 == true){ //On affiche notre information dans le highscore sans le timer
        for (let player of localArray) {
        SCOREBOARD.innerHTML += `<br>${player.pseudo}: ${player.value}/${player.scoreMax}`
    }
    }
    else { //On affiche notre information dans le highscore avec le timer
        for (let player of localArray) {
            SCOREBOARD.innerHTML += `<br>${player.pseudo}: ${player.value}/${player.scoreMax} ${player.time}sec` 
    }
    }

}


/***************************************addEventListener**********************************************/

// bouton suivant
NEXT_BUTTON.addEventListener('click',nextQuestion)

// bouton pour réinitialiser le quiz
REPLAY_BUTTON.addEventListener('click',nextQuiz)

// touche entré lance bouton suivant
document.addEventListener("keydown",(e) =>{
    if(e.key === "Enter" ){
        NEXT_BUTTON.click()
        SCORE_BUTTON.click()
    }
})

// touche F2 change le scoreboard
document.addEventListener("keydown",(e) =>{
    if(SCOREBOARD.style.display == 'inline-block'){
        if(e.key === "F2" ){
            if (toggleF2 == true){
                toggleF2 = false
                scoreBoardUpdate()
            }
            else if (toggleF2 == false){
                toggleF2 = true
                scoreBoardUpdate()
            }
        }
    }
})
// le 100 commit !!!!!!!!
