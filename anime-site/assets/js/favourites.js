// ===============fetching navbar==============
const header=document.querySelector("header")
const fetchNavbar= async()=>{
    try{
    let response= await fetch("/pages/navbar.html")
    let result=await response.text()
    header.innerHTML=result
    const scripts=header.querySelectorAll("script")
    scripts.forEach(script=>{
        let newScript=document.createElement("script")
       if(script.src){
        newScript.setAttribute("src",script.src)
       }
       document.body.appendChild(newScript)
    })
    document.dispatchEvent(new Event("navbarLoaded"))
    }catch(error){
        console.log(error)
    }

    }
fetchNavbar()
// ==========fetchfooter=============
const footer=document.querySelector("footer")
const fetchFooter=async()=>{
    try{
      let response=await fetch(`/pages/footer.html`)
      let result=await response.text()
      footer.innerHTML=result
    }catch(error){
console.log(error)
    }
}
fetchFooter()


// ============settingwatchlater section=========================
const watchLaterAnime=document.querySelector(".watch-later-cards")
let temporaryCurrentUserEmail = sessionStorage.getItem("currentUserGmail");
let temporaryExistingUsers = JSON.parse(localStorage.getItem("users"));

let temporaryCurrentUser = temporaryCurrentUserEmail
  ? temporaryExistingUsers.find((user) => user.email == temporaryCurrentUserEmail)
  : temporaryExistingUsers.find((user) => user.isLogged);

  let notLoggedInMsg=document.querySelector(".main-section .notLoggedIn-msg")
  let heroSection=document.getElementById("hero-section")
  if(!temporaryCurrentUser){
    notLoggedInMsg.classList.remove("hidden")
    notLoggedInMsg.classList.add("flex")
    heroSection.classList.add("hidden","lg:hidden")

  }
  else{
    notLoggedInMsg.classList.add("hidden")
    heroSection.classList.remove("hidden","lg:hidden")
  }
  const setWatchLaterCard=(data)=>{
    let noWatchLaterMsg=document.querySelector(".watch-later-section .no-watch-later")
    watchLaterAnime.innerHTML=""
if(data.length>0){
    watchLaterAnime.innerHTML=""
noWatchLaterMsg.classList.add("hidden")
    data.forEach(anime => {
        watchLaterAnime.innerHTML+=` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="card custom-hover relative rounded-sm bg-primary dark:bg-dark-primary custom-shadow 
          h-full w-full flex items-center gap-3 pl-3 py-3 my-3 ">
         <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.imgUrl}" alt="poster">
         <div class="info">
            <h1 class=" text-base lg:text-lg font-normal leading-snug lg:font-medium dark:text-dark-textColor text-textColor ">${anime.title}</h1>
            <div class="additional-info flex gap-1 items-center flex-wrap text-base mt-1.5 ">
             <span class="subtitles bg-[#B0E3AF] py-0.5 px-1 font-medium text-sm lg:text-base  rounded-sm flex items-center gap-0.5 ">
                 <i class="fa-solid fa-closed-captioning"></i>
                 <span>${anime.episodes}</span>
             </span>
             <span class="dubbed bg-[#E3B5CD] py-0.5 px-1  rounded-sm font-medium text-sm lg:text-base  flex items-center gap-0.5 ">
                 <i class="fa-solid fa-microphone"></i>
                 <span>${anime.episodes}</span>
             </span>
             <span class="anime-type text-textColor dark:text-dark-textColor font-medium text-sm lg:text-base ">. ${anime.type}</span>
            </div>
         </div>
          <div class="buttons text-xl font-medium absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-2">
           <button data-id="${anime.mal_id}"  class="fa-regular fa-heart add-to-favourites text-secondary   rounded-full h-8 w-8  flex items-center justify-center"></button>
         <button data-id="${anime.mal_id}" class="add-to-watch-later  fa-solid fa-plus dark:text-primary text-dark-primary  hover:bg-gray-300   rounded-full h-8 w-8 hover:text-primary flex items-center justify-center"></button></div>
     </a>`
        
    });
    
}
else{
    noWatchLaterMsg.classList.remove("hidden")
}
  }
setWatchLaterCard(temporaryCurrentUser?.watchLater || [])

// ================fetchFavouritesection====================
const favouriteAnime=document.querySelector(".favourite-anime-cards")
const setFavouriteCard=(data)=>{
    let noFavouritesMsg=document.querySelector(".favourite-section .no-favourites")
if(data.length>0){
noFavouritesMsg.classList.add("hidden")
favouriteAnime.innerHTML=""
data.forEach(anime=>{
    favouriteAnime.innerHTML+=`<a href="/pages/animeDetails.html?id=${anime.mal_id}" class="custom-recommended-anime-card custom-hover relative ">
                <img src="${anime.imgUrl}" class="h-full  rounded-md  object-cover w-full" alt="anime-poster">
                <button data-id="${anime.mal_id}"  class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl rounded-full h-8 w-8 text-secondary custom-hover flex items-center justify-center"></button>
            </a>`
})
}
else{
noFavouritesMsg.classList.remove("hidden")
}
}
setFavouriteCard(temporaryCurrentUser?.favourites || [])
// ==============fetching popular section=================
const popularCardSection=document.querySelector(".popular-section")
const fetchPopularSection = async () => {
    try {
        let response = await fetch("/pages/popular-card.html")
        if(!response.ok) throw new Error("response error")
        else {
            let result = await response.text()
            popularCardSection.innerHTML = result

            // Extracting all scripts and adding them to animeDetails.js
            const scripts = popularCardSection.querySelectorAll("script");
            scripts.forEach((script) => {
                const newScript = document.createElement("script");
                if(script.src){
                    newScript.setAttribute("src", script.src)
                }
                document.body.appendChild(newScript);
            });
        }
    } catch (error) {
        console.log(error)
    }
}
fetchPopularSection()



