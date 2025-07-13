// Global variables and constants
let recommendedData = []
const param = new URLSearchParams(window.location.search)
let animeId = param.get("id")
const animeApi = `https://api.jikan.moe/v4/anime/${animeId}`
const recommendedAnimeApi = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
let currentPage = 1
let perPage = 25
const nextButton = document.querySelector(".recommended .pagination .right")
const previousButton = document.querySelector(".recommended .pagination .left")
const popularCardSection = document.querySelector(".popular")
const header = document.querySelector("header")
const detailsSection = document.getElementById("details-section")
const recommendedSection = document.querySelector(".recommended .cards")
const detailsSectionLoader=detailsSection.querySelector(".loader")
const recommendedLoader=recommendedSection.querySelector(".loader")



// Fetch Navbar Section
const fetchNavbar = async () => {
    try {
        let response = await fetch("/pages/navbar.html")
        let result = await response.text()
        header.innerHTML = result
        const scripts = header.querySelectorAll("script")
        scripts.forEach(script => {
            let newScript = document.createElement("script")
            if(script.src) {
                newScript.setAttribute("src", script.src)
            }
            document.body.appendChild(newScript)
        })
    } catch (error) {
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
// Fetch Anime Details and Set the Details Card
const fetchAnimeDetails = async () => {
    try {
        let response = await fetch(animeApi)
        let result = await response.json()
        setDetailsCard(result.data)
    } catch (error) {
        console.log(error)
    }
}
// Set Anime Details Card in the Details Section
const setDetailsCard = (data) => {
    detailsSectionLoader.classList.add("hidden")
    detailsSection.innerHTML = `<div class="pt-7 card mx-3 lg:pt-15 lg:mx-10 custom-shadow justify-between flex flex-wrap lg:flex-nowrap py-4 gap-x-4  w-[100vw-3px] lg:w-[100vw-10px]  bg-primary dark:bg-dark-primary">
        <div class="main-info lg:pl-50 flex w-full lg:w-[70%]  items-center gap-x-5 lg:gap-x-14  flex-col sm:flex-row sm:items-start">
            <a href="/pages/watch.html?id=${data.mal_id}">
            <img class="aspect-[9/16] mb-3 max-w-40 sm:max-w-44 object-cover rounded-sm   "
                    src="${data.images.webp.large_image_url}" alt="anime Poster"></a>

            <div class="additional-info space-y-2 flex flex-col sm:items-start  items-center gap-3.5 ">
                <h1 class=" title text-2xl font-semibold text-textColor dark:text-dark-textColor lg:text-4xl ">${data.title_english || data.title}</h1>
                <div class="flex items-center gap-x-3 flex-wrap">
                    <div class="info flex items-center gap-1 font-medium text-sm   ">
                        <span class="rating rounded-sm bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary  py-0.5 px-1  ">${data.rating.split(" ")[0]}</span>
                        <span class="quality rounded-sm bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary  py-0.5 px-1 ">HD</span>
                        <span class="subtitles bg-[#B0E3AF] py-0.5 px-1  rounded-sm flex items-center gap-0.5 ">
                            <i class="fa-solid fa-closed-captioning"></i>
                            <span>${data.episodes}</span>
                        </span>
                        <span class="dubbed bg-[#E3B5CD] py-0.5 px-1  rounded-sm flex items-center gap-0.5 ">
                            <i class="fa-solid fa-microphone"></i>
                            <span>${data.episodes}</span>
                        </span>
                    </div>

                    <span class="anime-type text-textColor dark:text-dark-textColor font-medium text-[15px] ">. ${data.type}</span>
                    <span class="anime-duration text-textColor dark:text-dark-textColor font-medium text-[15px] ">. ${data.duration.slice(0, 6)}</span>
                </div>
                <div class="buttons flex gap-3">
                    <a data-id="${data.mal_id}" href="/pages/watch.html?id=${data.mal_id}"
                        class="watch-streaming bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary text-sm md:text-md font-medium pointer rounded-md py-2.5  px-4 md:px-5 lg:px-6 flex gap-2 justify-center items-center custom-hover">
                        <i class="fa-solid fa-play"></i>
                        Watch Now
                    </a>

                    <button data-id="${data.mal_id}" class="login fa-plus add-to-watch-later bg-[#615F62] text-primary text-sm md:text-md font-medium pointer rounded-md py-2.5 px-4 md:px-5 lg:px-6 flex gap-2 justify-center items-center custom-hover">
                        Watch Later
                        <i class="fa-solid fa-angle-right"></i>
                    </button>

                     <button data-id="${data.mal_id}" class="fa-regular fa-heart add-to-favourites text-xl text-secondary -ml-5 md:text-md font-medium pointer rounded-md py-2.5 px-4 md:px-5 lg:px-6 flex gap-2 justify-center items-center">
                    </button>
                </div>

                <div class="description hidden   text-textColor dark:text-dark-textColor sm:block  w-[70%] ">
                    <p class="overflow-ellipsis line-clamp-3">${data.synopsis}</p>
                </div>

                <div class="share-div self-start  flex items-center  gap-1">
                    <img class="h-14 w-14 object-cover animate-bounce rounded-full" src="/assets/images/animePic.webp"
                        alt="animephoto">
                    <div class="flex  font-medium flex-col">
                        <span class="text-secondary dark:text-dark-secondary ">Share Anime</span>
                        <span class="text-textColor dark:text-dark-textColor ">With Your Friends</span>
                    </div>

                </div>
            </div>
        </div>

        <div class="rightdiv dark:text-primary text-dark-primary w-full h-full lg:w-[30%] text-medium font-medium  py-3 pl-3 pr-10 ">
            <div class="info  space-y-2  py-4 flex flex-col ">
                <span class="japanese-title">Japanese: ${data.title_japanese || data.titles[2].title}</span>
                <span class="aired-date">Aired: ${data.aired.from.slice(0, 10).trim()}</span>
                <span class="ranking">Ranking: ${data.rank}</span>
                <span class="anime-duration">Duration: ${data.duration.slice(0, 6)}</span>
                <span class="status">Status: ${data.status}</span>
                <span class="anime-rating">Rating:<i class="fa-solid fa-star text-yellow-300 "></i>  ${data.score}</span>
                <span class="genre">Genre: ${data.genres.map(animeGenre => animeGenre.name)}</span>
                <span class="studio">Studio: ${data.studios.map(animeStudio => animeStudio.name)}</span>
                <span class="producer">Producer: ${data.producers.map(animeProducer => animeProducer.name)}</span>
            </div>
        </div>`
        isFavouriteAnime()
    iswatchLaterAnime()
}

// Fetch Recommended Anime Data and Set the Cards
const fetchRecommendedAnime = async (recommendedAnimeApi,fetchTry=0,maxTries=4,delay=1000) => {
    try {
        let response = await fetch(recommendedAnimeApi)
        if(response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        recommendedData = result
        if(result.data.length == 0) throw new Error("no recommended anime found")
        paginateRecommandedData(result.data)
    } catch (error) {
       if(error.message=="too many requests" && fetchTry<maxTries){
        await new Promise(resolve=>setTimeout(resolve,delay))
        return fetchRecommendedAnime(recommendedAnimeApi,fetchTry+1,maxTries,delay*2)
       }
       else if(error.message=="no recommended anime found" && fetchTry<maxTries ){
        await new Promise(resolve=>setTimeout(resolve,delay))
        return fetchRecommendedAnime(`https://api.jikan.moe/v4/anime/${Math.floor(Math.random()*2000 +1)}/recommendations`,fetchTry+1,maxTries,delay*2)
       }
        console.log(error)
    }
}

// Set Recommended Cards for the Recommended Anime
const setRecommendedCards = (data) => {
    recommendedSection.innerHTML = ""
    recommendedLoader.classList.add("hidden")
    data.forEach((anime, index) => {
        recommendedSection.innerHTML += `<a href="/pages/animeDetails.html?id=${anime.entry.mal_id}" class="custom-recommended-anime-card custom-hover relative ">
                <img src="${anime.entry.images.webp.large_image_url}" class="h-full rounded-md  object-cover w-full" alt="anime-poster">
                <button data-id="${anime.entry.mal_id}" class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl text-secondary rounded-full h-8 w-8  custom-hover flex items-center justify-center"></button>
            </a>`
    });
    isFavouriteAnime()
    iswatchLaterAnime()
}

// Pagination for Recommended Anime
const updatePagination = (e) => {
    if (e.target == nextButton) {
        currentPage++
    }
    else if (e.target == previousButton) {
        currentPage--
    }
    paginateRecommandedData(recommendedData.data)
}

// Paginate and Display Recommended Data
const paginateRecommandedData = (data) => {
    if (data.length <= 25) {
        previousButton.classList.add("hidden")
        nextButton.classList.add("hidden")
    }
    else if (currentPage == 1 && currentPage == Math.ceil(data.length / perPage)) {
        previousButton.classList.add("hidden")
        nextButton.classList.add("hidden")
    }
    else if (currentPage == 1) {
        previousButton.classList.add("hidden")
    }
    else if (currentPage == Math.ceil(data.length / perPage)) {
        nextButton.classList.add("hidden")
    }
    else {
        nextButton.classList.remove("hidden")
        previousButton.classList.remove("hidden")
    }
    let startIndex = (currentPage - 1) * perPage
    let lastIndex = currentPage * perPage
    let paginatedData = data.slice(startIndex, lastIndex)
    setRecommendedCards(paginatedData)
}

// Fetch Popular Section
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

// Event Listeners for Pagination
nextButton.addEventListener("click", updatePagination)
previousButton.addEventListener("click", updatePagination)



// Initial Fetch Calls
fetchAnimeDetails()
fetchPopularSection()
fetchRecommendedAnime(recommendedAnimeApi)


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
detailsSection.addEventListener("click",(e)=>{  
    if(e.target.classList.contains("watch-streaming")){
        e.preventDefault()
        streamingSitePopUp.classList.toggle("hidden")
        fetchstremingsiteLink(Number(e.target.dataset.id))
    }
    else if(e.target==crossButton){
        streamingSitePopUp.classList.add("hidden")
        streamingSitePopUp.classList.remove("flex")
    }
})
streamingSitePopUp.addEventListener("click",(e)=>{
    if(e.target==crossButton){
        streamingSitePopUp.classList.add("hidden")
    }
})
