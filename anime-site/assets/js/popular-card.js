const popularAnimeCard=document.querySelector(".popular-card .card-container")
const mostPoplarAnime=`https://api.jikan.moe/v4/top/anime?limit=17`
const setPopularAnimeCard=(data)=>{
    popularAnimeCard.innerHTML=""
    data.forEach(anime => {
        popularAnimeCard.innerHTML+=` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="card custom-hover relative rounded-sm bg-primary dark:bg-dark-primary shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,_0.7)] dark:shadow-[5px_5px_10px_rgba(255,255,255,0.1),-5px_-5px_10px_rgba(0,0,0,_0.7)] h-full w-full flex items-center gap-3 pl-3 py-3 ">
         <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.images.webp.large_image_url}" alt="poster">
         <div class="info">
            <h1 class=" text-base lg:text-lg dark:text-primary text-dark-primary font-normal lg:font-medium ">${anime.title_english || anime.title}</h1>
            <div class="additional-info flex gap-1 items-center flex-wrap font-medium text-sm lg:text-base mt-1.5 ">
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
          <div class="buttons text-xl font-medium absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-2">
           <button data-id="${anime.mal_id}" class="fa-regular fa-heart add-to-favourites text-secondary rounded-full h-8 w-8 custom-hover flex items-center justify-center"></button>
         <button data-id="${anime.mal_id}" class="add-to-watch-later  fa-solid fa-plus dark:text-primary text-dark-primary  hover:bg-gray-300   rounded-full h-8 w-8 hover:text-primary   custom-hover flex items-center justify-center"></button></div>
     </a>`
        
    });
    isFavouriteAnime()
    iswatchLaterAnime()
}
const fetchMostPopularAnime= async()=>{
    try{
        let cacheData=JSON.parse(localStorage.getItem("popularSectionDetails"))
        if(!cacheData || cacheData.data.length==0){
            console.log("fetching from api")
            let response=await fetch(mostPoplarAnime)
            let result=await response.json()
            localStorage.setItem("popularSectionDetails",JSON.stringify(result))
            setPopularAnimeCard(result.data)
        }
        else{
            setPopularAnimeCard(cacheData.data)
            console.log("fetching from local storage")
        }
        
    }catch(error){
        console.log(error)
    }
}
fetchMostPopularAnime()
