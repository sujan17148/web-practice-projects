const cardContainer=document.querySelector(".cardcontainer")
let count=1
let cardsMatched=0
let firstCard=null
let secondCard=null
const images=[
   "images/luffy.jpeg",
   "images/goku.jpeg",
   "images/jinwoo.jpeg",
   "images/madara.jpeg",
   "images/saitama.jpeg",
   "images/wardress.jpeg",
   "images/shingen.jpeg",
   "images/naruto.jpeg"

]

const restartButton=document.querySelector(".maincontainer .restart")
restartButton.addEventListener("click",(e)=>{
    document.querySelector(".gameover").style.display="none"
    cardContainer.innerHTML=""
addCard()
autoFlip()

})
const setCardOrder=()=>{
  let order=new Set();
  while (order.size<16){
    order.add(Math.floor(Math.random()*16+1)) 
  }
  return [...order]
}
const addCard=()=>{
    let cardOrder=setCardOrder()
    for(let i=0;i<16;i++){
    cardContainer.innerHTML+=`<div style="order: ${cardOrder[i]};" class="container flip ">
<div class="box">
    <div class="front"></div>
    <div class="back"><img src="${images[i%8]}" alt="images"></div>
</div>
</div>`
    }
    

}
const checkWinner=(firstCard,secondCard)=>{
    let firstValue=firstCard.querySelector(".back>img").getAttribute("src")
    let secondValue=secondCard.querySelector(".back>img").getAttribute("src")
    if(firstValue==secondValue){
        cardsMatched++
        if(cardsMatched==8){
            setTimeout(()=>{gameOver()},500)
        }
    }
    else{
     cardContainer.style.pointerEvents="none" //disable click
        setTimeout(() => {
            firstCard.classList.remove("flip")
            secondCard.classList.remove("flip")
            cardContainer.style.pointerEvents="auto" //enables click 
        }, 1000);
    }
}
const flip=(event)=>{
if(count==1){
     firstCard=event.target.closest(".container")
    firstCard.classList.add("flip")
    count++
}
else if(count==2){
     secondCard=event.target.closest(".container")
    secondCard.classList.add("flip")
    count++
    checkWinner(firstCard,secondCard)
    count=1
}

}
function autoFlip(){
    setTimeout(() => {
        let cards=cardContainer.querySelectorAll(".container")
        cards.forEach(e=>e.classList.remove("flip"))
    }, 3000);
}
cardContainer.addEventListener("click",(e)=>{
if(e.target.classList.contains("front")){
    flip(e)

}
})
function gameOver(){
    document.querySelector(".gameover").style.display="initial"
}
addCard()
autoFlip()

