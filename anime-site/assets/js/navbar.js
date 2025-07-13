const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// ========================darkmodetoggle======================== 
const toggleButton=document.querySelector(".toggle-button")
// ==========setting theme on load=======
let currentTheme=localStorage.getItem("theme")
document.documentElement.classList.add(`${currentTheme}`)
const changeTheme=(e)=>{
  document.documentElement.classList.toggle("dark")
  let theme=document.documentElement.classList.contains("dark") ? "dark":"light"
  localStorage.setItem("theme",theme)
}
toggleButton.addEventListener("click",debounce(changeTheme,300))

// =================== Login and Logout Handling ===================
const pcLoginButton = document.getElementById("pc-login");
const userProfileCard = document.querySelector(".user-profile");
const LogoutMsg = document.querySelector(".logoutMsg");

const mobileLoginButton=document.getElementById("mobile-login")
const mobileUserProfileCard=document.querySelector(".mobile-user-profile")

let currentUserEmail = sessionStorage.getItem("currentUserGmail");
let existingUsers = JSON.parse(localStorage.getItem("users")) || [];

let currentUser = currentUserEmail
  ? existingUsers.find((user) => user.email == currentUserEmail) || null
  : existingUsers.find((user) => user.isLogged) || null;
  console.log(currentUser)

pcLoginButton.textContent= currentUser ? currentUser.username:"👤 login"
mobileLoginButton.textContent= currentUser ? currentUser.username:"👤 login"

// showing user profile on login button click
const settingUser = (e) => {
  if(currentUser) {
    e.preventDefault();
    pcLoginButton.setAttribute("href", "/pages/index.html");
    userProfileCard.classList.toggle("hidden");
    userProfileCard.querySelector(".logout").addEventListener("click", logoutUser);
    userProfileCard.querySelector(".watch-later").addEventListener("click",showWatchList)
    userProfileCard.querySelector(".favourites").addEventListener("click",showFavourites)
  } else {
    pcLoginButton.setAttribute("href", "/pages/login.html");
  }
};
const settingMobileUser=(e)=>{
  if(currentUser){
    e.preventDefault()
    mobileLoginButton.setAttribute("href", "/pages/index.html");
    mobileUserProfileCard.classList.toggle("hidden")
    mobileUserProfileCard.querySelector(".logout").addEventListener("click", logoutUser);
    mobileUserProfileCard.querySelector(".watch-later").addEventListener("click",showWatchList)
    mobileUserProfileCard.querySelector(".favourites").addEventListener("click",showFavourites)
  }
  else{
    mobileLoginButton.setAttribute("href", "/pages/login.html");
  }
}
pcLoginButton.addEventListener("click", settingUser);
mobileLoginButton.addEventListener("click",settingMobileUser)

function logoutUser(e) {
  menuLinks.style.right = "100%";
  mobileUserProfileCard.classList.add("hidden");
  if (LogoutMsg.classList.contains("hidden")) {
    LogoutMsg.classList.remove("hidden");
    LogoutMsg.classList.add("flex");
  } else {
    LogoutMsg.classList.add("hidden");
  }
}

function cancelLogout() {
  LogoutMsg.classList.add("hidden");
  userProfileCard.classList.add("hidden");
  
}

function confirmLogout() {
  if (currentUserEmail) {
    sessionStorage.removeItem("currentUserGmail");
  }
  existingUsers = existingUsers.map(user=>{
    if(user==currentUser){
      return {...user,isLogged:false}
    }
    else{
      return user;
    }
  })
  localStorage.setItem("users", JSON.stringify(existingUsers));
  window.location.reload();
  userProfileCard.classList.add("hidden");
  LogoutMsg.classList.add("hidden");
}

// =================== Navbar Menu Toggle ===================
const menuIcon = document.querySelector(".navbar .fa-bars");
const menuLinks = document.querySelector(".navbar  .mobilemenu");

menuIcon.addEventListener("click", (e) => {
  if (e.target == menuIcon) {
    menuLinks.style.right = "0";
  }
});

menuLinks.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-x")) {
    menuLinks.style.right = "100%";
  }
});

// =================== Search Functionality ===================
const recommendedSearch = document.querySelector(".recomendedsearch");
const mobileSearchBar = document.querySelector(".mobilesearch");
const mobileInputSearch = document.querySelector(".mobilesearch .searchbar");
const inputSearch = document.querySelector(".searchbox .search");
const inputSearchButton = document.querySelector(".searchbox .fa-magnifying-glass");

mobileSearchBar.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-magnifying-glass")) {
    mobileSearchBar.querySelector(".search").classList.toggle("hidden");
  }
  mobileInputSearch.focus();
});

document.querySelector(".mobilesearch .fa-x").addEventListener("click", (e) => {
  mobileSearchBar.querySelector(".search").classList.add("hidden");
});

const mobileSearch = (e) => {
  if (e.key.toLowerCase() == "enter") {
    let simplifiedUrl = mobileInputSearch.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.location.href = `/pages/search.html?query=${simplifiedUrl}`;
  }
};

mobileInputSearch.addEventListener("keydown", mobileSearch);

inputSearch.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() == "enter") {
    let simplifiedUrl = inputSearch.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.location.href = `/pages/search.html?query=${simplifiedUrl}`;
  }
});

inputSearchButton.addEventListener("click", (e) => {
  if (e.target == inputSearchButton) {
    let simplifiedUrl = inputSearch.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.location.href = `/pages/search.html?query=${simplifiedUrl}`;
  }
});
// =================== Search Recommendations ===================
const setRecommendedSearch = (data) => {
  recommendedSearch.innerHTML = "";
  data.forEach((anime) => {
    recommendedSearch.innerHTML += `<a href="/pages/animeDetails.html?id=${anime.mal_id}" class="border-b-2 block pt-3 px-3 pb-1.5  my-1   border-b-primary ">${anime.title_english || anime.title}</a>`;
  });
  if (!inputSearch.value) {
    recommendedSearch.innerHTML = "";
  }
};

const fetchSearchRecommendation = async (api) => {
  try {
    let response = await fetch(api);
    let result = await response.json();
    setRecommendedSearch(result.data);
  } catch (error) {
    console.log(error);
  }
};

inputSearch.addEventListener("input", debounce(searchRecommend, 300));

function searchRecommend() {
  let recommendApi = `https://api.jikan.moe/v4/anime?q=${inputSearch.value}&limit=5`;
  fetchSearchRecommendation(recommendApi);
}

// =================== Random Anime Fetcher ===================
const chooseRandomAnime = document.querySelectorAll(".random-anime");

async function fetchRandomAnime() {
  try {
    let response = await fetch("https://api.jikan.moe/v4/random/anime");
    let result = await response.json();
    chooseRandomAnime.forEach(random=>random.setAttribute(
      "href",
      `/pages/animeDetails.html?id=${result.data.mal_id ?? Math.floor(Math.random() * 2000 - 1)}`
    ));
  } catch (error) {
    console.log(error);
  }
}
fetchRandomAnime();



