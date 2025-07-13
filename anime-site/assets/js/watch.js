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
    
    }catch(error){
        console.log(error)
    }
    }
    fetchNavbar()

// ### encodeURIComponent() vs encodeURI()

// 1️⃣ encodeURIComponent()

// - **Purpose**: Used to encode **only a part** of a URL, such as query parameter values.
// - **How it works**: Encodes **special characters** (like spaces, `:`, `/`, `&`, `?`, `=`), **but does not preserve the URL structure** (e.g., `:`, `/`, `?` will be encoded).
// - **Example**:
//   ```javascript
//   const title = "Attack on Titan: Final Season";
//   const encodedTitle = encodeURIComponent(title);
//   console.log(encodedTitle);
//   // Output: Attack%20on%20Titan%3A%20Final%20Season


// ### encodeURI()

// - **Purpose**: Used to encode the **entire URL**, preserving the **URL structure** (e.g., `/`, `:`, `&`).
// - **How it works**: Encodes special characters like spaces and symbols but **leaves structural URL parts** (like `:`, `/`, `?`, `&`, `=`) **as they are**.
  
// - **Example**:
//   ```javascript
//   const url = "https://example.com/search?query=Attack on Titan: Final Season";
//   const encodedUrl = encodeURI(url);
//   console.log(encodedUrl);
//   // Output: https://example.com/search?query=Attack%20on%20Titan:%20Final%20Season
let recommendedData = []
let fetchTry = 0
const param = new URLSearchParams(window.location.search)
let animeId = param.get("id")
const animeApi = `https://api.jikan.moe/v4/anime/${animeId}`
const recommendedAnimeApi = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
const animeEpisodesApi=`https://api.jikan.moe/v4/anime/${animeId}/episodes`
let currentPage = 1
let perPage = 25
const nextButton = document.querySelector(".recommended .pagination .right")
const previousButton = document.querySelector(".recommended .pagination .left")
const recommendedSection = document.querySelector(".recommended .cards")
const popularCardSection=document.querySelector(".popular")
const additionalAnimeInfo=document.querySelector(".anime-info ")
const watchSection=document.querySelector(".watch")
const header=document.querySelector("header")


const animeEpisodesContainer=document.querySelector(".main-section .episodes-box")

const setRecommendedCards = (data) => {
  recommendedSection.innerHTML = ""
  data.forEach((anime, index) => {
      recommendedSection.innerHTML += `<a href="/pages/animeDetails.html?id=${anime.entry.mal_id}" class=" custom-hover custom-recommended-anime-card relative ">
              <img src="${anime.entry.images.webp.large_image_url}" class="h-full  rounded-md  object-cover w-full" alt="anime-poster">
              <button data-id="${data.mal_id}" class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl hover:bg-gray-300 rounded-full h-8 w-8 hover:text-primary dark:hover:text-dark-secondary  custom-hover flex items-center justify-center"></button>
          </a>`
          isFavouriteAnime()
          iswatchLaterAnime()
  });

}
const updatePagination = (e) => {
  if (e.target == nextButton) {
      currentPage++
  }
  else if (e.target == previousButton) {
      currentPage--
  }
  paginateRecommandedData(recommendedData.data)

}
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
// Fetch Recommended Anime Data and Set the Cards
const fetchRecommendedAnime = async (recommendedAnimeApi) => {
    try {
        let response = await fetch(recommendedAnimeApi)
        if(response.status == 429) throw new Error("too many requests")
        let result = await response.json()
        recommendedData = result
        if(result.data.length == 0) throw new Error("no recommended anime found")
        paginateRecommandedData(result.data)
    } catch (error) {
        if(fetchTry < 3) {
            fetchTry++
            console.log("Retrying......")
            if(error.message == "too many requests") {
                return await fetchRecommendedAnime(recommendedAnimeApi)
            }
            return await fetchRecommendedAnime(`https://api.jikan.moe/v4/anime/${Math.floor(Math.random() * 2000 - 1)}/recommendations`)
        }
        console.log(error)
    }
}

const fetchPopularSection= async ()=>{
  try{
  let response=await fetch("/pages/popular-card.html")
  if(!response.ok) throw new Error("response error")
      else{
          let result=await response.text()
          popularCardSection.innerHTML=result

              //extracting all  script and adding it to  animedetalis.js
          const scripts = popularCardSection.querySelectorAll("script");
          scripts.forEach((script) => {
              const newScript = document.createElement("script");
              if(script.src){
                  newScript.setAttribute("src",script.src)
              }
              document.body.appendChild(newScript);
          });
      }
 

  }catch(error){
      console.log(error)
  }
}

const setEpisodesList=(data)=>{
  animeEpisodesContainer.innerHTML=""
  data.forEach(episode=>{
       animeEpisodesContainer.innerHTML+=`<div class="episodes py-2 ">
                    <span class="episode-number ">${episode.mal_id}. </span>
                    <span class="episode-name"> ${episode.title}</span>
                   </div>`
  })
}
const fetchAnimeEpisodes=async ()=>{
  try{
   let response =await fetch(animeEpisodesApi)
   let result=await response.json()

   setEpisodesList(result.data)
  }catch(error){
    console.log(error)
  }
}
const setAnimeDetails=(data)=>{
additionalAnimeInfo.innerHTML=` <a href="/pages/watch.html?id=${data.mal_id}"><img
                        class="aspect-[9/16]  mb-3 max-w-20  object-cover rounded-sm   "
                        src="${data.images.webp.large_image_url}" alt="anime Poster"></a>

                <div class="additional-info space-y-3 flex flex-col items-start ">
                    <h1 class=" title text-2xl font-semibold text-textColor dark:text-dark-textColor lg:text-4xl   ">${data.title_english || data.title}</h1>
                    <div class="flex items-center gap-x-3 flex-wrap ">
                        <div class="info flex items-center gap-1 font-medium text-sm   ">
                            <span class="rating rounded-sm bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary  py-0.5 px-1  ">${data.rating.split(" ")[0]}</span>
                            <span class="quality rounded-sm bg-secondary dark:bg-dark-secondary text-primary dark:text-dark-primary py-0.5 px-1 ">HD</span>
                            <span class="subtitles bg-[#B0E3AF] py-0.5 px-1  rounded-sm flex items-center gap-0.5 ">
                                <i class="fa-solid fa-closed-captioning"></i>
                                <span>${data.episodes}</span>
                            </span>
                            <span class="dubbed bg-[#E3B5CD] py-0.5 px-1  rounded-sm flex items-center gap-0.5 ">
                                <i class="fa-solid fa-microphone"></i>
                                <span>${data.episodes}</span>
                            </span>
                        </div>

                        <span class="anime-type text-textColor font-medium text-[15px] ">. ${data.type}</span>
                        <span class="anime-duration text-textColor font-medium text-[15px] ">. ${data.duration.slice(0, 6)}</span>
                    </div>
                       <p class="overflow-ellipsis line-clamp-3 text-textColor dark:text-dark-textColor ">${data.synopsis}</p>
                   <div class="flex items-center gap-2 mt-4  ">
                    <a class="inline-block py-2 px-4 bg-secondary dark:bg-dark-secondary hover:bg-accent  dark:hover:bg-dark-secondary custom-hover text-primary dark:text-dark-primary rounded-sm " href="/pages/animeDetails.html?id=${data.mal_id}">ViewDetails <i class="fa-solid fa-angle-right ml-1.5 "></i></a>
                    <button data-id="${data.mal_id}" class="fa-regular fa-heart add-to-favourites   rounded-full h-8 w-8 text-textColor dark:text-dark-textColor custom-hover text-xl flex items-center justify-center"></button>
                   </div>
                </div>`
                isFavouriteAnime()
    iswatchLaterAnime()
}
const fetchAnime=async()=>{
  try{
   let response=await fetch(animeApi)
   let result=await response.json()
   setSomeInfo(result.data)   
   setAnimeDetails(result.data)
  }catch(error){
    console.log(error)
  }
}

function setSomeInfo(data){
    const animeTitle= document.createElement("h1")
    animeTitle.classList.add("text-center","font-medium","text-lg","text-secondary","dark:text-dark-secondary","my-1.5")
    animeTitle.textContent=` you are Now watching ${data.title_english || data.title}`
    watchSection.prepend(animeTitle)

    const rating=document.querySelector(".info-container .rating")
    rating.innerHTML=`<i class="fa-solid fa-star text-yellow-400 mr-1.5"></i> ${data.score}`
}
nextButton.addEventListener("click", updatePagination)
previousButton.addEventListener("click", updatePagination)

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

fetchAnimeEpisodes()
fetchRecommendedAnime(recommendedAnimeApi)
fetchAnime()
fetchPopularSection()
window.addEventListener("load",isFavouriteAnime)


  