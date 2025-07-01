import { quiz } from './questions.js' // Importe les questions du quiz depuis le fichier questions.js

/*****************************************************Importation Du Dom********************************************************************** */
const DisplayQuestions = document.querySelector(".question")
const DisplayOption = document.querySelector(".options")
const nextButton = document.querySelector("#next-button")
const replayButton = document.getElementById('replay-button')
const scoreButton = document.getElementById('scoreRegister')
const scoreBoard = document.getElementById('score')
const timer = document.getElementById("timer")
const progressBar = document.getElementById("progress")

/*****************************************************creation variable********************************************************************** */
let currentQuestionIndex = 0// Initialise l'index de la question courante à 0
let score = 0 // Initialise le score du joueur à 0
let numCategories = 0 // Initialise la catégorie à 0, on pourrait la laisser vide
let categories = quiz.categories[numCategories] // on récupère la liste des catégories
let time = "" //variable tampon function setTimer
let remainingTime = 15 //temps donner pour répondre
let totalTime = 0  //temps total d'une personne pour un quiz

/*****************************************************Appel fonction depart********************************************************************** */

choiceQuiz()

/*****************************************************Fonction********************************************************************** */

function choiceQuiz(){
    DisplayQuestions.style.height = "100px" // je rechange la valeur du height car on la modifie a la fin pour afficher les gifs au résultat
    nextButton.style.display ='none'
    scoreButton.style.display ='none'
    DisplayQuestions.innerText = "Choisis ton Quiz" // changer l'affichage
    DisplayOption.innerHTML = ''   // on vide l'affichage des options
    let incrementationQuiz = 0    // permet de donner un id aux boutons de quiz --> voir dans boucle forEach

    quiz.categories.forEach(categorieName => {
        const option_btn = document.createElement('button') // Crée un bouton
        option_btn.innerText = categorieName.nom // Définit le texte du bouton
        option_btn.classList.add('classQuiz') // Ajoute une classe CSS au bouton
        option_btn.setAttribute("id",incrementationQuiz)
        DisplayOption.appendChild(option_btn) // Ajoute le bouton à l'élément options
        incrementationQuiz ++
        
    })

    const quizButtons = document.querySelectorAll('.classQuiz') // Ajoute un écouteur d'événement à chaque bouton réponse
    quizButtons.forEach(element => { 
        element.addEventListener('click', checkQuiz) // lance la fonction checkQuiz
    })

}

function checkQuiz(event){
    numCategories = parseInt(event.target.id)
    categories = quiz.categories[numCategories] // on récupère le numéro de catégorie  
    progressBar.max = parseInt(categories.questions.length)
    progressBar.value = 0
    progressBar.style.display = 'inline-block'
    scoreBoardUpdate()
    loadQuestion(currentQuestionIndex)
}

function loadQuestion(currentQuestion){
    setTimer()
    nextButton.style.display ='inline-block'
    const question1 = categories.questions[currentQuestion].text // Récupère le texte de la première question du quiz
    DisplayQuestions.innerHTML = `<p><u>Question ${currentQuestionIndex +1} :</u> ${question1}</p>` // Affiche la première question dans l'élément sélectionné
    DisplayOption.innerHTML = "" // Efface les options précédentes avant d'afficher les nouvelles
    let incrementationId = 1// Pour chaque option de la première question, crée un bouton et l'ajoute à la page

    randomQuestion().forEach(elem => {
        const newButton = document.createElement('button') // Crée un bouton
        newButton.innerText = elem // Définit le texte du bouton
        newButton.classList.add('answer') // Ajoute une classe CSS au bouton
        newButton.setAttribute("id",`reponse${incrementationId}`)
        DisplayOption.appendChild(newButton) // Ajoute le bouton à l'élément options
        incrementationId ++
    })

    const answersButtons = document.querySelectorAll('.answer') // Ajoute un écouteur d'événement à chaque bouton réponse
    answersButtons.forEach(element => { 
        element.addEventListener('click', checkAnswer) 
    })

}

function checkAnswer(event){
    clearInterval(time)
    const answerId = document.getElementsByClassName("answer") //Récupère tous les éléments avec la classe "answer".
    let answer = categories.questions[currentQuestionIndex].correct_answer // stockage de la réponse
    let choice = event.target.innerText  //Récupère le texte de la réponse choisie par l'utilisateur.

    if (choice == answer){ // lorsqu'on a la bonne réponse
        event.target.style.border = "5px solid green" //Met une bordure verte autour de la réponse sélectionnée.
        nextButton.disabled = false//Active le bouton "suivant".
        score ++//Incrémente le score.
        for(let i=0; i < answerId.length; i ++){//Désactive tous les boutons de réponse. 
            answerId[i].disabled = true
        }
    }
    else{ // lorsqu'on pas la bonne réponse
        event.target.style.border = "5px solid red" // Met une bordure rouge autour de la réponse sélectionnée.
        nextButton.disabled = false //Active le bouton "suivant".
        for(let i=0; i < answerId.length; i ++){//Désactive tous les boutons de réponse.
            answerId[i].disabled = true
            if(answerId[i].innerText == answer){//Met une bordure verte autour de la bonne réponse.
                answerId[i].style.border = "5px solid green"  
            }
        }
    }

}

function nextQuestion(){
    totalTime += (15 - remainingTime)
    nextButton.disabled = true
    currentQuestionIndex += 1// Incrémente l'index de la question courante
    progressBar.value = currentQuestionIndex 
    let totalQuestion = parseInt(categories.questions.length)
    if (currentQuestionIndex < totalQuestion) {    // Vérifie s'il reste des questions à afficher
        loadQuestion(currentQuestionIndex) // Afficher la question suivante
    } 
    //FIN QUIZ
    else {
        timer.style.display ='none'
        DisplayQuestions.style.height = "400px"

        //Affichage quand score Parfait
        if(score == totalQuestion){
            DisplayQuestions.innerHTML = `<p>Félicitations, tu as obtenu le score parfait de : ${score} / ${totalQuestion} </p>` +
                            "<img class = gif src = https://www.icegif.com/wp-content/uploads/2023/05/icegif-105.gif alt = score_parfait />"
        }
        
        //Affichage quand le score est de 0
        else if(score == 0) {
            DisplayQuestions.innerHTML = `<p> T'y est un tigre le sang : ${score} / ${totalQuestion} </p>` +
                            "<img class = gif src = https://media.tenor.com/ih7NzdreP3sAAAAM/hungry-tiger-cub-licking-tiger-cub.gif alt = Tigre />"

        }

        //Affichage quand score au dessus de la moyenne
        else if(score > totalQuestion / 2){
            DisplayQuestions.innerHTML = `<p>Bravo, tu as obtenu : ${score} / ${totalQuestion} </p>` +
                            "<img class = gif src = https://media.tenor.com/R4hfEKhV_SEAAAAM/good-job-awesome.gif alt = score_correct />"
        } 

        //Affichage quand score en dessous de la moyenne
        else if(score <= totalQuestion / 2){
            DisplayQuestions.innerHTML = `Pas fou ça tu peux mieux faire : ${score} / ${totalQuestion}` +
                            "<img class = gif src = https://media.tenor.com/QsOGinNNNU0AAAAM/not-very-good-benjamin.gif alt = score_horrible />"
        }

        // Si ça marche pas au moins ça nous le dit
        else{
            DisplayQuestions.innerText = "Tout est cassé" + score + '/' + totalQuestion
        }
        
        DisplayOption.innerHTML = '' // Effacer les options
        nextButton.style.display ='none' // Cacher le bouton Suivant
        replayButton.style.display = 'inline-block' // Reafficher le bouton pour rejouer
        highScore()

    }

}

function nextQuiz(){
    totalTime = 0
    progressBar.style.display ='none'
    scoreBoard.style.display ='none'
    score = 0 //  Réinitialiser le score
    currentQuestionIndex = 0 //  Réinitialiser l'index 
    nextButton.style.display ='inline-block' // Reafficher le bouton Suivant
    replayButton.style.display = 'none' // Cacher le bouton pour rejouer
    choiceQuiz()   // Recharger la page de sélection ( la première page quoi )
}


/*****************************************************features********************************************************************** */

function setTimer(){
    timer.style.display ='inline-block'
    remainingTime = 15
    timer.innerText = `Temps restant : ${remainingTime}s`
    time = setInterval(() => {
    remainingTime = (remainingTime - 0.01).toFixed(2)
    timer.innerText = `Temps restant : ${remainingTime}s`
    if (remainingTime <= 0) {
        clearInterval(time)
        nextQuestion()
    }
    }, 10)
}

function randomQuestion(){
    let random = categories.questions[currentQuestionIndex].options
    random.sort(() => Math.random() - 0.5)
    return random
}


function highScore(){
    scoreButton.style.display ='inline-block'

    const text = document.createElement('p')
    text.setAttribute = ("class", "question")

    text.innerText = "choisir votre pseudo" 
    DisplayOption.appendChild(text) 

    const input = document.createElement('input') 
    input.setAttribute("id","pseudo") 
    DisplayOption.appendChild(input) 
    
    scoreButton.addEventListener('click', () => {
        let pseudo = document.getElementById("pseudo").value
        if (pseudo.length <= 10 ){
            if (!pseudo.includes("_")){
                if (pseudo == "delete"){
                    localStorage.clear()
                    scoreBoardUpdate()
                }
                else if (pseudo != ""){
                    localStorage.setItem(`${pseudo}_${categories.nom}`, `${score}/${categories.questions.length}/${totalTime.toFixed(2)}`)
                    scoreBoardUpdate()
                    DisplayOption.innerHTML = ""
                    scoreButton.style.display ='none'
                }
            }
        }    
    })
}


function scoreBoardUpdate(){
    scoreBoard.style.display ='inline-block'
    scoreBoard.innerText = "Meilleurs scores"
    scoreBoard.innerHTML += `<br>${categories.nom}`
    let localArray = Object.keys(localStorage)
        .filter(key => key.endsWith(`_${categories.nom}`))
        .map(key => {
            return {
                pseudo: key.split("_")[0],
                value: localStorage.getItem(key).split("/")[0],
                scoreMax: localStorage.getItem(key).split("/")[1],
                time: localStorage.getItem(key).split("/")[2]
            }
        })
    localArray.sort((a, b) => a.time - b.time)
    localArray.sort((a, b) => b.value - a.value)
    for (let player of localArray) {
        scoreBoard.innerHTML += `<br>${player.pseudo}: ${player.value}/${player.scoreMax} ` //${player.time}sec
    }
}


/***************************************addEventListener**********************************************/

// bouton suivant
nextButton.addEventListener('click',nextQuestion)

// bouton pour réinitialiser le quiz
replayButton.addEventListener('click',nextQuiz)

// touche entré lance bouton suivant
document.addEventListener("keydown",(e) =>{
    if(e.key === "Enter" ){
        nextButton.click()
    }
})

