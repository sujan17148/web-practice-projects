const spellingDashDiv=document.querySelector(".gamelogic .spelling-dash")
const hintDiv=document.querySelector(".gamelogic .hint")
const stickSvg=document.querySelector(".hangman-svg > img")
const restartButton=document.querySelector(".hangmancontainer  .restart")
let wrongGuess=0
let guessedWord=[]
let handleEvent=null
const generateDash=(word)=>{
for(let i=0;i<word.length;i++){
    spellingDashDiv.innerHTML+=`<span class="dash"><p></></span>`
}
}
const checkWord =(word)=>{
    guessedWord.length=word.length
    guessedWord.fill("")
    if(handleEvent){
        document.removeEventListener("keydown",handleEvent)
    }
    
handleEvent=(e)=>{
if(/^[a-zA-Z]$/.test(e.key)){
    if(wrongGuess<6){
        if(word.toLowerCase().includes(e.key.toLocaleLowerCase())){
            let indexes=[]
           for (let i=0;i<word.length;i++){
            if(word.charAt(i)==e.key){
                indexes.push(i)
            }
           }
           fillDash(indexes,e)
           if(guessedWord.join("").toLowerCase()==word.toLowerCase()){
            gameWon()
           }
        }
        else{
            wrongGuess++
            updateWrongGuess()
            updateStickManSvg()
            if(wrongGuess==6){
                gameover(word)
            }
        }
    }
}

}
document.addEventListener("keydown",handleEvent)
}
const showHint=(wordDefination)=>{
    hintDiv.innerHTML=` <h3>Hint:${wordDefination}</h3>
           <h3>wrong guess: <span>${wrongGuess}/6</span> </h3>`
}
async function generateWord(){
   try {
    let response = await fetch("https://api.datamuse.com/words?rel_trg=random&md=d&max=100");

    let data = await response.json()
    let validWords=data.filter(element=>element.word.length>7 && element.word.length<11 && element.defs!= undefined)
    if(validWords.length>0 ){
        let randomPosition=Math.floor(Math.random()*validWords.length)
      let word= validWords[randomPosition].word
      let wordDefination = validWords[randomPosition].defs[0]
      console.log(word, wordDefination)
      generateDash(word)
      showHint(wordDefination)
      checkWord(word)
    }
    else throw new Error("no words found")
   } catch (error) {
    console.log(error)
   }
}
function fillDash(indexes,e){

    indexes.forEach(index => {
       let dash= spellingDashDiv.querySelector(`.dash:nth-child(${index +1}) p`)
       dash.textContent=`${e.key}`
       guessedWord[index+1]=`${e.key}`
    });

}
function updateWrongGuess(){
    let guessCount=hintDiv.querySelector("h3:last-child>span")
    guessCount.textContent=`${wrongGuess}/6`
}
function updateStickManSvg(){
stickSvg.setAttribute("src", `images/hangman${wrongGuess}.svg`)
}
function gameover(word){
    let gameoverDiv=document.querySelector(".hangmancontainer .gameover")
    gameoverDiv.style.display="flex"
    gameoverDiv.querySelector("h3").textContent=`Game Over!`
     gameoverDiv.querySelector("h3").style.color="red"
    gameoverDiv.querySelector("h3:last-child").textContent=`The word was ${word}`

}
function gameWon(){
    let gameoverDiv=document.querySelector(".hangmancontainer .gameover")
    gameoverDiv.style.display="flex"
     gameoverDiv.querySelector("h3").textContent=`You Won!`
     gameoverDiv.querySelector("h3").style.color="green"
    gameoverDiv.querySelector("h3:last-child").textContent=`you guessed the word ${guessedWord.join("")} correctly`

}
generateWord()

restartButton.addEventListener("click",(e)=>{
    spellingDashDiv.innerHTML=""
    guessedWord=[]
    hintDiv.innerHTML=""
    wrongGuess=0
    updateStickManSvg()
    let gameoverDiv=document.querySelector(".hangmancontainer .gameover")
    gameoverDiv.style.display="none"
    generateWord()
    
    
})