const gmailInput=document.querySelector("#gmail")
const passwordInput=document.querySelector("#password")
const loginButton=document.querySelector("button[type=submit]")
const form=document.querySelector("form")
const eyeIcon=document.querySelector(".formgroup i:last-child") 
const rememberCheckBox=document.querySelector(".checkbox-container input")
let password=""
let currentUser=""
const checkGmail=()=>{
    let errorMesssage=document.querySelector(" #gmail +.errormsg")
try{
    if(!gmailInput.value){
        throw new Error("*gmail can't be empty")
    }
    let existingUser=JSON.parse(localStorage.getItem("users")) || []
        if(!(existingUser.some(user=>user.email.toLowerCase().startsWith(gmailInput.value.toLowerCase())))) throw new Error("*user does not exist")
            currentUser=existingUser.find(user=>user.email==gmailInput.value)
               if(currentUser){
                password=currentUser.password
               }
    gmailInput.classList.add("correct")
    gmailInput.classList.remove("error");
     errorMesssage.textContent=""
     return true
    
}catch(error){
    gmailInput.classList.remove("correct")   
    gmailInput.classList.add("error");
    errorMesssage.textContent=error.message
    return false
}
}
const checkPassword=()=>{   
    let errorMesssage=document.querySelector("#password +.errormsg")
    try {
        if(!passwordInput.value){
            throw new Error("*password can't be empty")
        }
        if(passwordInput.value.length<8){
            throw new Error("*password too small")
        }
        let existingUser=JSON.parse(localStorage.getItem("users")) || []
        if(password!=passwordInput.value) throw new Error("*password did not match")
            passwordInput.classList.add("correct")
        passwordInput.classList.remove("error");
         errorMesssage.textContent=""
         return true
    } catch (error) {
        passwordInput.classList.remove("correct")   
        passwordInput.classList.add("error");
        errorMesssage.textContent=error.message
        return false
    }
}
gmailInput.addEventListener("input",checkGmail)
passwordInput.addEventListener("input",checkPassword)

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    if( checkGmail() && checkPassword()){
        let existingUsers=JSON.parse(localStorage.getItem("users")) || []
         existingUsers=existingUsers.map(user=>{
         if(user.email== currentUser.email){
             return { ...user, isLogged: true }// only change isLogged value of current user
         }
         else {
            return  {...user, isLogged:false}
        }; // keeps other user loggedout
        })
        if(!rememberCheckBox.checked){
            sessionStorage.setItem("currentUserGmail",currentUser.email)
        }
        else{
            localStorage.setItem("users",JSON.stringify(existingUsers))
        }
        alert("login successful")
       setTimeout(() => {
        window.location.href = `/pages/index.html`;
       }, 300);
    }
})

eyeIcon.addEventListener("click", (e)=>{
    e.target.classList.toggle( "fa-eye")
    e.target.classList.toggle("fa-eye-slash")
    if(!e.target.classList.contains("fa-eye")){
        passwordInput.setAttribute("type","text")
    }
    else{
        passwordInput.setAttribute("type","password")
    }
})


let currentTheme=localStorage.getItem("theme")
document.documentElement.classList.add(`${currentTheme}`)