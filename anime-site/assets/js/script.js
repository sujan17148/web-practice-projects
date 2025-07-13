const animeWrapper = document.querySelector(".hero-container  .wrapper")
const topAnimeApi = `https://api.jikan.moe/v4/top/anime?page=1&limit=10`
let fetchTry = 0
const header = document.querySelector("header")
const footer = document.querySelector("footer")
const fetchNavbar = async () => {
    try {
        let response = await fetch("/pages/navbar.html")
        let result = await response.text()
        header.innerHTML = result
        const scripts = header.querySelectorAll("script")
        scripts.forEach(script => {
            let newScript = document.createElement("script")
            if (script.src) {
                newScript.setAttribute("src", script.src)
            }
            document.body.appendChild(newScript)
        })

    } catch (error) {
        console.log(error)
    }
}
fetchNavbar()

const fetchFooter = async () => {
    try {
        let response = await fetch(`/pages/footer.html`)
        let result = await response.text()
        footer.innerHTML = result
    } catch (error) {
        console.log(error)
    }
}
fetchFooter()

const fetchTopAnime = async (fetchTry = 0, maxTries = 3, delay = 1000) => {
    try {
        let response = await fetch(topAnimeApi)
        if (response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        if (!result || result.data.length == 0) throw new Error("no data found")
        setCards(result)
        setTopRatedAnimeCard(result.data.slice(0, 5))
        setsliderAnimation(result.data.length)
    } catch (error) {
        if (error.message == "too many requests" || error.message == "no data found" && fetchTry < maxTries) {
            await new Promise((resolve) => setTimeout(resolve, delay));

            // 🔁 Retry with exponential backoff
            return fetchTopAnime(fetchTry + 1, maxTries, delay * 2)
        }
        console.log(error)
    }
}
const setCards = (result) => {
    for (let i = 0; i < result.data.length; i++) {
        let animeId = result.data[i].mal_id
        animeWrapper.innerHTML += `
<div class="slide bg-primary dark:bg-dark-primary relative  pl-3 h-full min-w-screen flex justify-center md:justify-start">

                <div class="anime-poster  absolute top-0  right-0 w-full md:w-2/3 h-full  overflow-hidden">
                    <img class="h-full w-full object-cover" src="${result.data[i].images.webp.large_image_url}" alt="anime-poster">
                </div>


   <div class=" left-info-section w-fit h-full   relative z-10">
    <div class="mobile-info md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
        <h1 class="text-xl font-semibold text-nowrap  text-primary dark:text-dark-primary mb-1">${result.data[i].title_english || result.data[i].title}</h1>
        
        <div class="buttons flex space-x-2 mt-1 text-base ">
            <a data-id="${animeId}" href="/pages/watch.html?id=${animeId}" class="watch-streaming  bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary  font-medium pointer rounded-md h-10 w-32  px-1 text-base flex gap-1 justify-center items-center custom-hover">
                <i class="fa-solid fa-play"></i>
                Watch Now
            </a>
            
            <a href="/pages/animeDetails.html?id=${animeId}" class="animeDetails bg-[#615F62] text-primary  font-medium pointer rounded-md h-10 w-32  text-base px-1 flex gap-1 justify-center items-center hover:scale-110 active:scale-95 custom-hover">
                Details
                <i class="fa-solid fa-angle-right"></i>
            </a>
        </div>
    </div>
          
    <div class="animeinfo hidden md:flex w-[45%] h-full flex-col mx-3 md:mx-3 lg:mx-5 justify-center">
        <span class="position text-secondary dark:text-dark-secondary font-medium text-lg md:text-xl lg:text-xl mb-2 md:mb-3 lg:mb-4">
            #${result.data[i].rank} spotlight
        </span>
        
        <h1 class="text-base font-medium md:text-3xl text-textColor dark:text-dark-textColor lg:text-5xl md:font-medium lg:font-semibold  md:mb-4 lg:mb-5 w-[85%]">
            ${result.data[i].title_english || result.data[i].title}
        </h1>
        
        <div class="info flex flex-wrap space-x-2 md:space-x-3 lg:space-x-4 mb-3 md:mb-4 text-textColor dark:text-dark-textColor lg:mb-5">
            <span class="type hidden lg:inline-block">
                <i class="fa-solid fa-play"></i>
                <span>${result.data[i].type}</span>
            </span>
            
            <span class="duration">
                <i class="fa-solid fa-clock"></i>
                <span>.${result.data[i].duration.slice(0, 6)}</span>
            </span>
            
            <span class="release-date hidden lg:inline-block">
                <i class="fa-solid fa-calendar"></i>
                <span>${result.data[i].year}</span>
            </span>
            
            <span class="quality px-1 text-sm font-normal flex items-center justify-center rounded-sm bg-[#B0E3AF]">
                HD
            </span>
            
            <div class="icons flex gap-2 items-center text-sm font-normal">
                <span class="subtitles bg-[#B0E3AF] px-1 rounded-sm flex items-center gap-0.5">
                    <i class="fa-solid fa-closed-captioning"></i>
                    <span class="">${result.data[i].episodes}</span>
                </span>
                <span class="episods bg-[#615F62] text-white dark:text-black px-1.5 rounded-sm">${result.data[i].episodes}</span>
            </div>
        </div>
        
        <div class="decription w-[85%] text-textColor dark:text-dark-textColor">
            <p class="md:line-clamp-2 lg:line-clamp-3 overflow-hidden text-ellipsis">
                ${result.data[i].synopsis}
            </p>
        </div>
        
        <div class="buttons flex space-x-3 md:space-x-3 lg:space-x-4 md:mt-4 lg:mt-5">
            <a data-id="${animeId}" href="/pages/watch.html?id=${animeId}" class="watch-streaming bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary text-sm md:text-md font-medium pointer rounded-md py-2.5 px-4 md:px-5 lg:px-6 flex gap-2 justify-center items-center hover:scale-110 active:scale-95 transition-all duration-300 ease-linear">
                <i class="fa-solid fa-play"></i>
                Watch Now
            </a>
            
            <a href="/pages/animeDetails.html?id=${animeId}" class="anime-details bg-[#615F62] text-primary text-sm md:text-md font-medium pointer rounded-md py-2.5 px-4 md:px-5 lg:px-6 flex gap-2 justify-center items-center hover:scale-110 active:scale-95 transition-all duration-300 ease-linear">
                Details
                <i class="fa-solid fa-angle-right"></i>
            </a>
        </div>
    </div>
   </div>
</div>`
    }
}
const setsliderAnimation = (length) => {
    let i = 0;
    setInterval(() => {
        i++;
        animeWrapper.style.transition = "transform 0.6s ease-in-out"
        animeWrapper.style.transform = `translateX(${-100 * (i % length)}vw)`;
    }, 2300);
}
fetchTopAnime()

// ===============top-airing-section==================
const topAiringCards = document.querySelector(".top-airing .top-airing-cards")
const setTopAiringCard = (data) => {
    document.querySelector(".top-airing .loader").classList.add("hidden")
    topAiringCards.innerHTML = ""
    data.forEach((anime, index) => {
        topAiringCards.innerHTML += `<a href="/pages/animeDetails.html?id=${anime.mal_id}" class="custom-recommended-anime-card custom-hover relative ">
                <img src="${anime.images.webp.large_image_url}" class="h-full rounded-md  object-cover w-full" alt="anime-poster">
                <button data-id="${anime.mal_id}" class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl text-secondary rounded-full h-8 w-8  custom-hover flex items-center justify-center"></button>
            </a>`
    });
    isFavouriteAnime()
}
const fetchTopAiringAnime = async (fetchTry = 0, maxTries = 3, delay = 1000) => {
    let url = `https://api.jikan.moe/v4/anime?order_by=popularity&status=airing&limit=20`
    try {
        let response = await fetch(url)
        if (response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        if (!result || result.data == 0) throw new Error("no data found")
        setTopAiringCard(result.data)
    } catch (error) {
        if (error.message == "too many requests" || error.message == "no data found" && fetchTry < maxTries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchTopAiringAnime(fetchTry++, maxTries, delay * 2)
        }
        console.log(error)
    }
}
fetchTopAiringAnime()

// ======================animeListSection====================

//toprated secton
const topRatedAnimeList = document.querySelector(".top-rated")
const setTopRatedAnimeCard = (data) => {
    document.querySelector(".top-rated-animeList .loader").classList.add("hidden")
    topRatedAnimeList.innerHTML = ""
    data.forEach(anime => {
        topRatedAnimeList.innerHTML += ` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="card max-h-[135px] custom-hover relative rounded-sm bg-primary dark:bg-dark-primary custom-shadow h-full w-full flex items-center gap-3 pl-3 py-3 ">
     <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.images.webp.large_image_url}" alt="poster">
     <div class="info">
        <h1 class=" text-base lg:text-lg dark:text-primary text-dark-primary font-normal lg:font-medium leading-snug ">${anime.title_english || anime.title}</h1>
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
 </a>`

    });
}


//popular section
const mostPopularAnimeList = document.querySelector(".most-popular")
const setMostPopularAnimeCard = (data) => {
    document.querySelector(".most-popular-animeList .loader").classList.add("hidden")
    mostPopularAnimeList.innerHTML = ""
    data.forEach(anime => {
        mostPopularAnimeList.innerHTML += ` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="card max-h-[135px] custom-hover relative rounded-sm bg-primary dark:bg-dark-primary custom-shadow h-full w-full flex items-center gap-3 pl-3 py-3 ">
     <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.images.webp.large_image_url}" alt="poster">
     <div class="info">
        <h1 class=" text-base lg:text-lg dark:text-primary text-dark-primary font-normal lg:font-medium leading-snug ">${anime.title_english || anime.title}</h1>
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
 </a>`

    });
}
const fetchMostPopularAnime = async (fetchTry = 0, maxTries = 3, delayTime = 1000) => {
    let url = `https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=5`
    try {
        console.log("fetching from api")
        let response = await fetch(url)
        if (response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        if (result.data.length == 0) throw new Error("no data found")
        setMostPopularAnimeCard(result.data)

    }
    catch (error) {
        if (error.message == "too many requests" || error.message == "no data found" && fetchTry < maxTries) {
            await new Promise((resolve) => setTimeout(resolve, delayTime));

            // 🔁 Retry with exponential backoff
            return fetchMostPopularAnime(fetchTry + 1, maxTries, delayTime * 2)
        }
        console.log(error)
    }
}
fetchMostPopularAnime()
//moviessection
const animeMoviesList = document.querySelector(".movies")
const setAnimeMovieCard = (data) => {
    document.querySelector(".movies-list .loader").classList.add("hidden")
    animeMoviesList.innerHTML = ""
    data.forEach(anime => {
        animeMoviesList.innerHTML += ` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="card max-h-[135px] custom-hover relative rounded-sm bg-primary dark:bg-dark-primary custom-shadow h-full w-full flex items-center gap-3 pl-3 py-3 ">
     <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.images.webp.large_image_url}" alt="poster">
     <div class="info">
        <h1 class=" text-base lg:text-lg dark:text-primary text-dark-primary font-normal lg:font-medium leading-snug ">${anime.title_english || anime.title}</h1>
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
 </a>`

    });
}
const fetchAnimeMovies = async (fetchTry = 0, maxTries = 3, delayTime = 1000) => {
    try {
        let url = `https://api.jikan.moe/v4/top/anime?type=movie&limit=5`
        let response = await fetch(url)
        if (response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        if (result.data.length == 0) throw new Error("no data found")
        setAnimeMovieCard(result.data)
    } catch (error) {
        if (error.message == "too many requests" || error.message == "no data found" && fetchTry < maxTries) {
            await new Promise((resolve) => setTimeout(resolve, delayTime));

            // 🔁 Retry with exponential backoff
            return fetchAnimeMovies(fetchTry + 1, maxTries, delayTime * 2)
            console.log(error)
        }
    }
}
fetchAnimeMovies()


// ===============upcomingsection================
const upcomingsection = document.querySelector(".upcoming-anime-container .upcoming-anime")
const setUpcomingCard = (data) => {
    document.querySelector(".upcoming-anime-container .loader").classList.add("hidden")
    upcomingsection.innerHTML = ""
    data.forEach(anime => {
        upcomingsection.innerHTML += `<a href="/pages/animeDetails.html?id=${anime.mal_id}" class="custom-recommended-anime-card custom-hover relative ">
                <img src="${anime.images.webp.large_image_url}" class="h-full rounded-md  object-cover w-full" alt="anime-poster">
                <button data-id="${anime.mal_id}" class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl text-secondary rounded-full h-8 w-8  custom-hover flex items-center justify-center"></button>
            </a>`
    });
    isFavouriteAnime()
}
const fetchUpcomingAnimes = async (fetchTry = 0, maxTries = 5, delay = 1000) => {
    try {
        let url = `https://api.jikan.moe/v4/anime?status=upcoming&order_by=popularity&limit=15`
        let response = await fetch(url)
        if (response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        if (result.data.length == 0) throw new Error("no data found")
        setUpcomingCard(result.data)

    } catch (error) {
        if (error.message == "too many requests" || error.message == "no data found" && fetchTry < maxTries) {
            await new Promise((resolve) => setTimeout(resolve, delay));

            // 🔁 Retry with exponential backoff
            return fetchUpcomingAnimes(fetchTry + 1, maxTries, delay * 2)
        }
        console.log(error)
    }
}
fetchUpcomingAnimes()

// ==============trendinganime=================
const trendingSection = document.querySelector(".trending-anime")
const setTrendingAnime = (data) => {
    document.querySelector(".trending-anime-container .loader").classList.add("hidden")
    trendingSection.innerHTML = ""
    data.forEach(anime => {
        trendingSection.innerHTML += ` <a  href="/pages/animeDetails.html?id=${anime.mal_id}" class="card max-h-[135px] my-2.5 custom-hover relative rounded-sm bg-primary dark:bg-dark-primary custom-shadow h-full w-full flex items-center gap-3 pl-3 py-3 ">
     <img class="max-w-16 aspect-[9/13] rounded-md object-cover " src="${anime.images.webp.large_image_url}" alt="poster">
     <div class="info">
        <h1 class=" text-base lg:text-lg dark:text-primary text-dark-primary font-normal lg:font-medium leading-snug ">${anime.title_english || anime.title}</h1>
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
 </a>`
    })
}
const fetchTrendingAnimes = async (fetchTry = 0, maxTries = 3, delayTime = 1000) => {
    try {
        let url = `https://api.jikan.moe/v4/anime?status=airing&order_by=popularity&limit=10`
        let response = await fetch(url)
        if (response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        if (result.data.length == 0) throw new Error("no data found")
        setTrendingAnime(result.data)
    } catch (error) {
        if (error.message == "too many requests" || error.message == "no data found" && fetchTry < maxTries) {
            await new Promise((resolve) => setTimeout(resolve, delayTime));

            // 🔁 Retry with exponential backoff
            return fetchTrendingAnimes(fetchTry + 1, maxTries, delayTime * 2)
            console.log(error)
        }
    }
}
fetchTrendingAnimes()


// ==============streamingsitepopup==================
const streamingSitePopUp=document.querySelector(".streaming-site-popup")
const linksContainer=streamingSitePopUp.querySelector(".links")
const crossButton=streamingSitePopUp.querySelector(".fa-x")
const setStreamingSiteLinks=(data)=>{
    linksContainer.innerHTML=""
    if(!data || data.length==0){
            linksContainer.innerHTML = `<p class="font-semibold text-secondary dark:text-dark-secondary">OOPS! No Streaming Links Available</p>`;
            return ;
    }


        for(let i=0;i<Math.min(3,data.length);i++){
            linksContainer.innerHTML+=`
            <a class="hover:text-secondary dark:hover:text-dark-secondary" target="_blank" href="${data[i].url}">${data[i].name}</a>
            `   
        }

}

const fetchstremingsiteLink=async(id)=>{
   try{
   let response=await fetch(`https://api.jikan.moe/v4/anime/${id}/streaming`)
   let result=await response.json()
        setStreamingSiteLinks(result.data)
   }catch(error){
    console.log(error)
   }
}
animeWrapper.addEventListener("click",(e)=>{
    if(e.target.classList.contains("watch-streaming")){
        e.preventDefault()
        streamingSitePopUp.classList.toggle("hidden")
        fetchstremingsiteLink(Number(e.target.dataset.id))
    }
    else if(e.target==crossButton){
        streamingSitePopUp.classList.add("hidden")
        streamingSitePopUp.classList.remove("flex")
    }

    console.log("clicked")
})
streamingSitePopUp.addEventListener("click",(e)=>{
    if(e.target==crossButton){
        streamingSitePopUp.classList.add("hidden")
    }
})


