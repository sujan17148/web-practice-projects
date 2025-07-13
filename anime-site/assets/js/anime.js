let currentPage = 1
let lastPage = 1
let params=new URLSearchParams(window.location.search)
const animeContainer = document.querySelector(".animes .anime-container")
const title=document.querySelector(".animes .title")
let filter= params.get("filter")
let genre=params.get("genre")
const paginationContainer = document.querySelector(".pagination")
const firstPageButton = paginationContainer.querySelector(".fa-angles-left")
const lastPageButton = paginationContainer.querySelector(".fa-angles-right")
const nextPageButton = paginationContainer.querySelector(".fa-angle-right")
const previousPageButton = paginationContainer.querySelector(".fa-angle-left")
const header = document.querySelector("header")
const loader=document.querySelector(".loader")


const urls=[
    {url:`https://api.jikan.moe/v4/anime?status=airing&order_by=popularity&page=`,title:"Top Airing Animes"},
    {url:`https://api.jikan.moe/v4/anime?status=airing&order_by=popularity&page=`,title:"Trending Animes"},
    {url:`https://api.jikan.moe/v4/top/anime?page=`,title:"Top Rated Animes"},
    {url:`https://api.jikan.moe/v4/anime?order_by=popularity&page=`,title:"Most Popular Animes"},
    {url:`https://api.jikan.moe/v4/anime?status=upcoming&order_by=popularity&page=`,title:"Upcoming Animes"}
]
const genres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 4, name: "Comedy" },
    { id: 8, name: "Drama" },
    { id: 10, name: "Fantasy" },
    { id: 14, name: "Horror" },
    { id: 7, name: "Mystery" },
    { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" },
    { id: 36, name: "Slice of Life" },
    { id: 30, name: "Sports" },
    { id: 37, name: "Supernatural" },
    { id: 41, name: "Thriller" }
];
const setApiUrl=()=>{
    if(filter){
       let selectedItem=urls.find(item=>item.title.toLowerCase().replace(/\s+/g, "")==filter.toLowerCase())
            title.textContent=selectedItem.title
       return selectedItem.url
    }
    else if(genre){
        let selectedItem=genres.find(item=>item.name.toLowerCase().replace(/\s+/g,"")==genre.toLowerCase())
        title.textContent=`${selectedItem.name} Animes`
        return `https://api.jikan.moe/v4/anime?genre=${selectedItem.id}&page=`
    }
    else {
        title.textContent="Top Animes"
        return `https://api.jikan.moe/v4/top/anime?page=`
    }
    }
// ===========fetchNavbar================
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


const setCard = (result) => {
    loader.classList.add("hidden")
    for (let i = 0; i < result.data.length; i++) {
        //here we used a tag but if we had used div or something else then to achieve anchor tag feature to navigate to details page we would need to attach a click event and inside the function we would have to use window.location.hred=""/pages/animeDetails.html?id=${animeId}" by passing animeId to that function
        let animeId = result.data[i].mal_id
        animeContainer.innerHTML += `<a href="/pages/animeDetails.html?id=${animeId}"  class="custom-hover block custom-anime-card pb-1 rounded-md overflow-hidden">
                    <div class="imgcard h-full  ">
                        <div class="img h-[80%]  md:h-[83%] relative">
                            <img class=" h-full  object-cover w-full  bg-sky-400 " src=${result.data[i].images.webp.image_url}
                                alt="anime poster">
                                <button data-id="${animeId}" class="fa-regular fa-heart add-to-favourites absolute right-2 bottom-2 text-xl text-secondary rounded-full h-8 w-8 custom-hover flex items-center justify-center"></button>
                        </div>
    
                        <div class="animeinfo flex gap-x-3 gap-y-1 items-center flex-wrap mt-2  md:mt-3 md: text-md md:font-medium text-sm px-2 text-primary font-medium">
                            <p class="anime-title inline-block  w-full text-ellipsis text-nowrap overflow-hidden ">${result.data[i].title_english || result.data[i].title}</p>
                            <spam class="genre basis-[45%] text-ellipsis text-nowrap overflow-hidden ">${setGenre(result.data[i].genres)} </spam>
                            <span class="episod-time">. ${result.data[i].duration.slice(0, 6)}</span>
                        </div>
                    </div>
                </a>`

    }
    isFavouriteAnime()
    iswatchLaterAnime()
}
const calculateCurrentPage=(result)=>{
    paginationContainer.addEventListener("click",(e)=>{
    
        if (e.target.classList.contains('page-number')) {
            currentPage = Number(e.target.textContent);
            updatePagination(currentPage, lastPage);
            fetchAnimes(currentPage);
            return;
        }
    
        
        if(e.target==firstPageButton){
            currentPage=1
        }
        else if(e.target==lastPageButton){
            currentPage=lastPage
        }
        else if(e.target==nextPageButton && currentPage < lastPage){
            currentPage++
        }
        else if(e.target==previousPageButton && currentPage > 1){
            currentPage--
        }
        else {
            return ;
        }
        updatePagination(currentPage,lastPage)
        fetchAnimes(currentPage)
    })
    updatePagination(currentPage,lastPage)
    }
    const fetchAnimes = async (currentPage = 1) => {
        try {
            let apiUrl = setApiUrl()
            let response = await fetch(`${apiUrl+currentPage}`)
            let result = await response.json()
            lastPage = result.pagination.last_visible_page
            animeContainer.innerHTML = ""
            setCard(result)
        } catch (error) {
            console.log(error)
        }
    }
    function updatePagination(currentPage,lastPage){
        const pageButtons = Array.from(paginationContainer.children)
        .filter(btn => btn.classList.contains('page-number'));
    
    // Determine the range of page numbers to display
    let startPage;
    
    if (currentPage <= 4) {
        // First 4 pages: always show 1, 2, 3, 4
        startPage = 1;
    } else if (currentPage >= lastPage - 3) {
        // Last 4 pages: show last 4 pages
        startPage = lastPage - 3;
    } else {
        // Middle pages: center current page
        startPage = currentPage - 2;
    }
    
    // Update page number buttons
    pageButtons.forEach((btn, index) => {
        
        // Update button text
        btn.textContent = startPage;
        
        // Remove custom-currentPage from all buttons first
        btn.classList.remove('custom-currentPage');
        
        // Add custom-currentPage to the active page
        if (startPage === currentPage) {
            btn.classList.add('custom-currentPage');
        }
        startPage++
        // Always show numbered buttons
        btn.style.display = 'inline-block';
    });
    
    // Handle navigation button visibility
    // First page: hide first and previous buttons
    if (currentPage === 1) {
        firstPageButton.style.display = 'none';
        previousPageButton.style.display = 'none';
    } 
    // Last page: hide last and next buttons
    else if (currentPage === lastPage) {
        lastPageButton.style.display = 'none';
        nextPageButton.style.display = 'none';
    } 
    // Middle pages: show all navigation buttons
    else {
        firstPageButton.style.display = 'inline-block';
        previousPageButton.style.display = 'inline-block';
        nextPageButton.style.display = 'inline-block';
        lastPageButton.style.display = 'inline-block';
    }
    }

    fetchAnimes()
calculateCurrentPage()
function setGenre(genre) {
    if (genre.length == 0) {
        return "Romantic"
    }
    else return `${genre[0].name}`
}