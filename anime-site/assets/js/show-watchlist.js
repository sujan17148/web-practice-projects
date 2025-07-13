const watchListContainer=document.querySelector(".watchList-container")
const watchListAnimeCards=watchListContainer.querySelector(".card-container")
const watchLaterAddedMsg=document.querySelector(".watch-later-msg")
const watchLaterRemovedMsg=document.querySelector(".watch-later-remove-msg")
function hideWacthList(e){
    userProfileCard.classList.add("hidden")
    watchListContainer.classList.add("hidden")
}
const showWatchList=(e)=>{
    menuLinks.style.right = "100%";
    mobileUserProfileCard.classList.add("hidden");
    hideFavourites()
    if(currentUser.watchLater.length>0){
        watchListContainer.querySelector(".no-watch-later").classList.add("hidden")
    }
    else{
        watchListContainer.querySelector(".no-watch-later").classList.remove("hidden")
    }
    watchListContainer.classList.toggle("hidden")
}
// ===============setwatchlater anime object====================
const  getAnimeData=(data)=>{
    const newWatchLaterObject={
        mal_id:data.mal_id,
        title:`${data.title_english || data.title}`,
        imgUrl:`${data.images.webp.large_image_url}`,
        episodes:data.episodes,
        type:`${data.type}`
    }
    existingUsers=existingUsers.map(user=>{
        if(user==currentUser){
            if(!(user.watchLater.find(anime=>anime.mal_id==newWatchLaterObject.mal_id))){
                user.watchLater.push(newWatchLaterObject)
            }  
        }
            return user
     })
     localStorage.setItem("users",JSON.stringify(existingUsers))
     setWatchLaterAnimeCard(currentUser?.watchLater || [])
     
     
}
const fetchAnimeData=async(id)=>{
try{
let response=await fetch(`https://api.jikan.moe/v4/anime/${id}`)
let result=await response.json()
getAnimeData(result.data)
}catch(error){
    console.log(error)
}

}
// ====================================addtowatchlater function section=========================

function addToWatchList(e){
    if(currentUser){
    const button=e.target
    const card=button.closest(".card")
    button.classList.toggle("fa-plus")
    button.classList.toggle("fa-minus")
    let animeId=parseInt(button.dataset.id)
     fetchAnimeData(animeId)
     watchLaterAddedMsg.classList.add("right-5")
     setTimeout(() => {
        watchLaterAddedMsg.classList.remove("right-5")
     }, 3000);
    }
    
    else{
        window.location.href="/pages/login.html"
    }    
}
// =======================removeFromwatchList==================
const removeFromwatchList=(e)=>{
    let button=e.target
    const card=e.target.closest(".card")
    button.classList.toggle("fa-minus")
        button.classList.toggle("fa-plus")
      existingUsers=existingUsers.map(user=>{
        if(user==currentUser){
            user.watchLater=user.watchLater.filter(anime=>anime.mal_id!=parseInt(button.dataset.id))
        } 
        return user;   
     })
     localStorage.setItem("users",JSON.stringify(existingUsers))
     watchLaterRemovedMsg.classList.add("right-5")
     setTimeout(() => {
        watchLaterRemovedMsg.classList.remove("right-5")
     }, 3000);
     setWatchLaterAnimeCard(currentUser?.watchLater || [])
}

//  ==============================dataset attribute note======================
// JavaScript Dataset Attributes Cheat Sheet

// 🎯 Setting a Data Attribute
// <button data-id="123" data-title="Solo Leveling">Add to Watch Later</button>

// 🔍 Retrieving a Data Attribute in JS
// const button = document.querySelector('button');
// const id = button.dataset.id; // "123"
// const title = button.dataset.title; // "Solo Leveling"

// 🔧 Modifying a Data Attribute
// button.dataset.id = "456"; // Changes data-id to 456
// button.dataset.newAttr = "hello"; // Adds data-new-attr="hello"

// 🔥 Bonus: Shortcut to convert all data attributes to an object
// const data = { ...button.dataset };
// console.log(data); // { id: "123", title: "Solo Leveling" }


const setWatchLaterAnimeCard=(data)=>{
    watchListAnimeCards.innerHTML=""
    data.forEach(anime => {
        watchListAnimeCards.innerHTML+=` <a href="/pages/animeDetails.html?id=${anime.mal_id}" class="cards custom-hover rounded-sm bg-gray-100 dark:bg-gray-900  h-full w-full flex items-center gap-3 pl-3 py-3 ">
         <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.imgUrl}" alt="poster">
         <div class="info">
            <h1 class=" text-lg  font-medium leading-snug dark:text-dark-textColor text-textColor ">${anime.title}</h1>
            <div class="additional-info flex gap-1 items-center flex-wrap text-base mt-1.5 ">
             <span class="subtitles bg-[#B0E3AF] py-0.5 px-1  rounded-sm flex items-center gap-0.5 ">
                 <i class="fa-solid fa-closed-captioning"></i>
                 <span>${anime.episodes}</span>
             </span>
             <span class="dubbed bg-[#E3B5CD] py-0.5 px-1  rounded-sm flex items-center gap-0.5 ">
                 <i class="fa-solid fa-microphone"></i>
                 <span>${anime.episodes}</span>
             </span>
             <span class="anime-type text-textColor dark:text-dark-textColor font-medium text-[15px] ">. ${anime.type}</span>
            </div>
         </div>
     </a>`
        
    });
}


setWatchLaterAnimeCard(currentUser?.watchLater || [])
// using event listener on whole body and checking if it is addToWatchListButton then adding functionlity
document.body.addEventListener("click",(e)=>{
    if(e.target.classList.contains("add-to-watch-later")){
        e.preventDefault()
        if(e.target.classList.contains("fa-plus")){
            addToWatchList(e)
        }
        else if(e.target.classList.contains("fa-minus")){
            removeFromwatchList(e)
        }
    }
}) 


// ===============removing+ sign if already watchlater anime on load========================
window.iswatchLaterAnime=()=>{
    let watchLaterAnime = currentUser.watchLater.map(anime => anime.mal_id);
    let plusIcon=document.querySelectorAll(".fa-plus")
    plusIcon.forEach(icon=>{
        if(watchLaterAnime.includes(parseInt(icon.dataset.id))){
            icon.classList.remove("fa-plus")
            icon.classList.add("fa-minus")
        }
    })
}
window.addEventListener("load",iswatchLaterAnime)