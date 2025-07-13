const param = new URLSearchParams(window.location.search)
let animeTitle = encodeURIComponent(param.get("query").replace(/-/g, " "))
const baseUrl = "https://api.jikan.moe/v4/anime"
const header = document.querySelector("header")
const searchSection=document.querySelector(".search-result-section")
const popularCardSection = document.querySelector(".popular-section")
searchSection.querySelector("h3").textContent=`Search result for ${param.get("query")}`
const foundAnime=document.querySelector(".anime-container")

const setSearchedAnimeCards=(data)=>{
    data.forEach(anime=>{
    foundAnime.innerHTML+=`<a href="/pages/animeDetails.html?id=${anime.mal_id}"  class=" block custom-hover custom-recommended-anime-card pb-1 rounded-md overflow-hidden">
                <div class="imgcard h-full ">
                    <div class="img h-[80%]  md:h-[83%] relative">
                        <img class=" h-full  object-cover w-full  bg-sky-400 " src=${anime.images.webp.image_url}
                            alt="anime poster">

                        <div class="icons absolute left-2 bottom-1 flex gap-2 items-center  ">
                            <span class="subtitles bg-[#B0E3AF] px-1 rounded-sm flex items-center gap-0.5 ">
                                <i class="fa-solid fa-closed-captioning"></i>
                                <span class="text-sm font-normal ">${anime.episodes}</span>
                            </span>
                            <span class="dubbed bg-[#E3B5CD] flex items-center gap-0.5 px-1 rounded-sm ">
                                <i class="fa-solid fa-microphone"></i>
                                <span class="text-sm font-normal ">25</span>
                            </span>
                            <span
                                class=" episods bg-[#615F62] text-white px-1.5 rounded-sm text-sm font-normal ">${anime.episodes}</span>
                        </div>
                         <button data-id="${anime.mal_id}" class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl text-secondary rounded-full h-8 w-8 custom-hover flex items-center justify-center"></button>

                    </div>

                    <div class="animeinfo flex gap-x-3 gap-y-1 items-center flex-wrap mt-2  md:mt-3 md: text-md md:font-medium text-sm px-2 text-primary font-medium">
                        <p class="anime-title inline-block  w-full text-ellipsis text-nowrap overflow-hidden ">${anime.title_english || anime.title}</p>
                        <spam class="genre basis-[45%] text-ellipsis text-nowrap overflow-hidden ">${setGenre(anime.genres)} </spam>
                        <span class="episod-time">. ${anime.duration.slice(0,6)}</span>
                    </div>
                </div>
            </a>`
    })
    isFavouriteAnime()
    iswatchLaterAnime()
}
const fetchSearchedAnime=async()=>{
    try{
        let apiUrl=`${baseUrl}?q=${animeTitle}`
let response =await fetch(apiUrl)
let result= await response.json()
setSearchedAnimeCards(result.data)
    }catch(error){
        console.log(error)
    }
}
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

const fetchPopularSection = async () => {
    try {
        let response = await fetch("/pages/popular-card.html")
        if (!response.ok) throw new Error("response error")
        else {
            let result = await response.text()
            popularCardSection.innerHTML = result

            //extracting all  script and adding it to  animedetalis.js
            const scripts = popularCardSection.querySelectorAll("script");
            scripts.forEach((script) => {
                const newScript = document.createElement("script");
                if (script.src) {
                    newScript.setAttribute("src", script.src)
                }
                document.body.appendChild(newScript);
            });
        }


    } catch (error) {
        console.log(error)
    }
}
fetchNavbar()
fetchSearchedAnime()
fetchPopularSection()
window.addEventListener("load",isFavouriteAnime)
function setGenre(genre){
    if(genre.length==0){
        return "Romantic"
    }
    else return `${genre[0].name}`
}

