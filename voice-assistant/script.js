window.speechSynthesis.cancel()
const listeningButton = document.querySelector(".start-button")
const inputBox = document.querySelector(".input-container input")
let word = "hello! how can I help you sir?"
const key="AIzaSyDh16kvNwK0m38_ZwtCNTMXzy-paWA-P9k"
const apiURl=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`

const websites = [
    { "title": "Google", "url": "https://www.google.com" },
    { "title": "YouTube", "url": "https://www.youtube.com" },
    { "title": "Facebook", "url": "https://www.facebook.com" },
    { "title": "Twitter", "url": "https://www.twitter.com" },
    { "title": "Instagram", "url": "https://www.instagram.com" },
    { "title": "Wikipedia", "url": "https://www.wikipedia.org" },
    { "title": "Amazon", "url": "https://www.amazon.com" },
    { "title": "Yahoo", "url": "https://www.yahoo.com" },
    { "title": "Reddit", "url": "https://www.reddit.com" },
    { "title": "Bing", "url": "https://www.bing.com" },
    { "title": "LinkedIn", "url": "https://www.linkedin.com" },
    { "title": "Netflix", "url": "https://www.netflix.com" },
    { "title": "Pinterest", "url": "https://www.pinterest.com" },
    { "title": "eBay", "url": "https://www.ebay.com" },
    { "title": "WhatsApp", "url": "https://www.whatsapp.com" },
    { "title": "Quora", "url": "https://www.quora.com" },
    { "title": "Spotify", "url": "https://www.spotify.com" },
    { "title": "Twitch", "url": "https://www.twitch.tv" },
    { "title": "Tumblr", "url": "https://www.tumblr.com" },
    { "title": "Snapchat", "url": "https://www.snapchat.com" },
    { "title": "TikTok", "url": "https://www.tiktok.com" },
    { "title": "Dropbox", "url": "https://www.dropbox.com" },
    { "title": "Microsoft", "url": "https://www.microsoft.com" },
    { "title": "Vimeo", "url": "https://www.vimeo.com" },
    { "title": "Slack", "url": "https://www.slack.com" },
    { "title": "Walmart", "url": "https://www.walmart.com" },
    { "title": "BBC", "url": "https://www.bbc.com" },
    { "title": "GitHub", "url": "https://www.github.com" },
    { "title": "Stack Overflow", "url": "https://stackoverflow.com" },
    { "title": "WordPress", "url": "https://www.wordpress.com" },
    { "title": "Reddit", "url": "https://www.reddit.com" },
    { "title": "Adobe", "url": "https://www.adobe.com" },
    { "title": "Hulu", "url": "https://www.hulu.com" },
    { "title": "BBC News", "url": "https://www.bbc.com/news" },
    { "title": "CNN", "url": "https://www.cnn.com" },
    { "title": "The New York Times", "url": "https://www.nytimes.com" },
    { "title": "IMDb", "url": "https://www.imdb.com" },
    { "title": "Spotify", "url": "https://www.spotify.com" },
    { "title": "Chase", "url": "https://www.chase.com" },
    { "title": "Target", "url": "https://www.target.com" },
    { "title": "Flickr", "url": "https://www.flickr.com" },
    { "title": "Baidu", "url": "https://www.baidu.com" },
    { "title": "GitLab", "url": "https://www.gitlab.com" },
    { "title": "Alibaba", "url": "https://www.alibaba.com" },
    { "title": "Trello", "url": "https://www.trello.com" },
    { "title": "Zoom", "url": "https://www.zoom.us" },
    { "title": "Coursera", "url": "https://www.coursera.org" },
    { "title": "Yahoo Mail", "url": "https://mail.yahoo.com" },
    { "title": "Spotify", "url": "https://www.spotify.com" },
    { "title": "WhatsApp Web", "url": "https://web.whatsapp.com" },
    { "title": "Stack Exchange", "url": "https://stackexchange.com" },
    { "title": "Khan Academy", "url": "https://www.khanacademy.org" },
    {"title":"calculator", "url":"https://www.google.com/search?q=calculator"}
]
// =============speechrecognitation=================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

recognition.addEventListener("result", (e) => {
    word = e.results[0][0].transcript;
    word = word[0].toUpperCase() + word.slice(1)
})
recognition.addEventListener("end", () => {
    listeningButton.innerHTML = `<i class="fa-solid fa-microphone"></i> Start Listening`
    console.log(word)
    console.log("listening stopped")
    takeCommand(word.toLowerCase())
})
const listening = () => {
    listeningButton.innerHTML = `<i class="fa-solid fa-microphone"></i> Listening...`
    word = ""
    recognition.start()
    console.log("listening")
}
listeningButton.addEventListener("click", listening)


// ================speakingafterenterring text==============
inputBox.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() == "enter") {
        word = ""
        word = inputBox.value
        inputBox.value = ""
        takeCommand(word.toLowerCase())
    }
})
// ===================speechSynthesis======================
function speak(text) {
    window.speechSynthesis.cancel()
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = "en-Us"
    utterence.pitch = 0.5
    console.log(utterence)
    window.speechSynthesis.speak(utterence)
}
function wishMe(){
    let day=new Date();
    let hrs=day.getHours();
if(hrs>=0 && hrs<12){
    speak("Good Moring sir...")
}
else if(hrs>=12 && hrs<17){
    speak("Good Afternoon sir...")
}
else if(hrs>=17 && hrs>22){
    speak("Good Evening sir...")
}
else {
    speak("Good Night sir...")
}

}

function takeCommand(message) {
   if(message){
    if (message.includes("hello") || message.includes("hey") || message.includes("hi")) {
        speak("Hello sir, how can I help you?")
    }
    else if(message.includes("who are you") || message.includes("what is your name") || message.includes("what's your name") || message.includes("identify yourself") || message.includes("what is your identity") || message.includes("what's your identity")){
        speak("I am an AI voice assistant made by subham  kumar sir...")
    }
    else if (message.includes("open")) {
        openWebsite(message)
    }
    else if (message.includes("joke")) {
        fetchJoke()
    }
    else if(message.includes("time") && (message.includes("current") || message.includes("right now"))){
        let time = new Date().toLocaleTimeString();
        speak(`The current time is ${time}`);
    }
    else if(message.includes("date") && (message.includes("today")|| message.includes("todays") || message.includes("right now") )){
        let date = new Date().toLocaleDateString();
        speak(`The today's date is ${date}`);
    }
    else if (message.includes("thanks") || message.includes("thank you")) {
        speak("you are welcome sir! If you need any help feel free to ask")
    }
    else if (message.includes("what") || message.includes("why") || message.includes("how") || message.includes("where") || message.includes("when") || message.includes("who")){
        askGemini(message) 
    } 
    else{
        askGemini(message)
    }
   }
    else {
        speak("Sorry sir! could not understant you")

    }

    function openWebsite(message) {
        let site = websites.find(ele => message.includes(ele.title.toLowerCase()))
        if (site) {
            speak(`Opening ${site.title}...`)
            window.open(site.url, "_blank")
        }
        else {
            speak("Sorry, I couldn't find that website.");
        }
    }
}

async function fetchJoke() {
    try {
        let response = await fetch("https://v2.jokeapi.dev/joke/Any")
        let result = await response.json()
        console.log(result)
        let joke = result.setup ? `${result.setup} ....... ${result.delivery}` : result.joke;
      speak(joke)
    } catch (error) {
        speak("sorry sir!But could not find a joke right now")
    }
}

async function askGemini(query) {
   try{
    let response=await fetch(apiURl,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: query } // Query passed dynamically
                    ]
                }
            ]
        })
    })
    let data= await response.json()
    let output=data.candidates[0].content.parts[0].text
    output=output.replace(/[*_-]/g,"")
    speak(output)
    console.log(output)

   }catch(error){
    console.log(error)
   }
}

wishMe()