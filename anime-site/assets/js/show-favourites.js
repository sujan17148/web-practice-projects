const favouriteAnimeContainer = document.querySelector(".favourites-container")
const favouriteAnimeCards=favouriteAnimeContainer.querySelector(".card-container")
const favouriteAddedMsg=document.querySelector(".favourite-msg")
const favourieRemovedMsg=document.querySelector(".favourite-remove-msg")
function hideFavourites() {
    userProfileCard.classList.add("hidden")
    favouriteAnimeContainer.classList.add("hidden")
}
const showFavourites=(e)=>{
    menuLinks.style.right = "100%";
    mobileUserProfileCard.classList.add("hidden");
    hideWacthList()
    if(currentUser.favourites.length>0){
        favouriteAnimeContainer.querySelector(".no-favourites").classList.add("hidden")
    }
    else{
        favouriteAnimeContainer.querySelector(".no-favourites").classList.remove("hidden")
    }
    favouriteAnimeContainer.classList.toggle("hidden")
}


// ===============setFavourites anime object====================
const  getFavouriteAnimeData=(data)=>{
    const newFavouritesAnimeObject={
        mal_id:data.mal_id,
        title:`${data.title_english || data.title}`,
        imgUrl:`${data.images.webp.large_image_url}`,
        episodes:data.episodes,
        type:`${data.type}`
    }
    existingUsers=existingUsers.map(user=>{
        if(user==currentUser){
            if(!(user.favourites.find(anime=>anime.mal_id==newFavouritesAnimeObject.mal_id))){
                user.favourites.push(newFavouritesAnimeObject)
            }  
        }
            return user
     })
     localStorage.setItem("users",JSON.stringify(existingUsers))
     setFavouriteAnimeCard(currentUser?.favourites || [])
     
}
const fetchFavouriteAnimeData=async(id)=>{
try{
let response=await fetch(`https://api.jikan.moe/v4/anime/${id}`)
let result=await response.json()
getFavouriteAnimeData(result.data)
}catch(error){
    console.log(error)
}

}
// ====================================addtofavourites function section=========================
const addToFavourites=(e)=>{
    if(currentUser){
        const button=e.target
            button.classList.toggle("fa-regular")
            button.classList.toggle("fa-solid")
        const card=button.closest(".card")
        let animeId=parseInt(button.dataset.id)
         fetchFavouriteAnimeData(animeId)
         favouriteAddedMsg.classList.add("right-5")
         setTimeout(() => {
            favouriteAddedMsg.classList.remove("right-5")
         }, 3000);
        }
        else{
            window.location.href="/pages/login.html"
        }
}

const setFavouriteAnimeCard=(data)=>{
    favouriteAnimeCards.innerHTML=""
    data.forEach(anime => {
        favouriteAnimeCards.innerHTML+=` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="cards custom-hover rounded-sm bg-gray-100  dark:bg-gray-900 h-full w-full flex items-center gap-3 pl-3 py-3 ">
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
// =======================removeFromfavourites==================
const removeFromFavourites=(e)=>{
    let button=e.target
    const card=e.target.closest(".card")
    button.classList.toggle("fa-solid")
        button.classList.toggle("fa-regular")
      existingUsers=existingUsers.map(user=>{
        if(user==currentUser){
            user.favourites=user.favourites.filter(anime=>anime.mal_id!=parseInt(button.dataset.id))
        } 
        return user;   
     })
     localStorage.setItem("users",JSON.stringify(existingUsers))
     favourieRemovedMsg.classList.add("right-5")
     setTimeout(() => {
        favourieRemovedMsg.classList.remove("right-5")
     }, 3000);
     setFavouriteAnimeCard(currentUser?.favourites || [])
}
setFavouriteAnimeCard(currentUser?.favourites || [])
document.body.addEventListener("click",(e)=>{
    if(e.target.classList.contains("add-to-favourites")){
        e.preventDefault();
        if(e.target.classList.contains("fa-regular")){
            addToFavourites(e)
        }
        else if(e.target.classList.contains("fa-solid")){
            removeFromFavourites(e)
        }
    }
})

// ==================addhearttofavourite===============
window.isFavouriteAnime=()=>{
    let favouriteAnime = currentUser.favourites.map(anime => anime.mal_id);
    let heartIcon=document.querySelectorAll(".fa-heart")
    heartIcon.forEach(icon=>{
        if(favouriteAnime.includes(parseInt(icon.dataset.id))){
            icon.classList.remove("fa-regular")
            icon.classList.add("fa-solid")
        }
    })
}
window.addEventListener("load",isFavouriteAnime)

