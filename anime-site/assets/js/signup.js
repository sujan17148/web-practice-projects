const confirmPassword = document.querySelector("#confirmpassword")
const username = document.querySelector("#username")
const gmailInput = document.querySelector("#gmail")
const passwordInput = document.querySelector("#password")
const signUpButton = document.querySelector("button[type=submit]")
const form = document.querySelector("form")
const eyeIcon = document.querySelector(".formgroup i:last-child")
let users=JSON.parse(localStorage.getItem("users")) || [] //creating an array for all userdetails
const checkUsername = () => {
    let errorMesssage = document.querySelector(" #username +.errormsg")
    try {
        if (!username.value) {
            throw new Error("*username can't be empty")
        }
        if (/[A-Z]/.test(username.value)){
            throw new Error("*username can't contain capital letters")
        }
        username.classList.add("correct")
        username.classList.remove("error");
        errorMesssage.textContent = ""
        return true

    } catch (error) {
        username.classList.remove("correct")
        username.classList.add("error");
        errorMesssage.textContent = error.message
        return false
    }
}
const checkGmail = () => {
    let errorMesssage = document.querySelector(" #gmail +.errormsg")
    try {
        if (!gmailInput.value) {
            throw new Error("*gmail can't be empty")
        }
        if (!gmailInput.value.endsWith("@gmail.com") || !/[a-z]/.test(gmailInput.value) || !/[\d]/.test(gmailInput.value)) {
            throw new Error("*Incorrect gmail format")
        }
        let existingUser=JSON.parse(localStorage.getItem(`users`)) || []
        if(existingUser.some(user=>user.email==gmailInput.value)) throw new Error("user exists, please use another  gmail")
        gmailInput.classList.add("correct")
        gmailInput.classList.remove("error");
        errorMesssage.textContent = ""
        return true

    } catch (error) {
        gmailInput.classList.remove("correct")
        gmailInput.classList.add("error");
        errorMesssage.textContent = error.message
        return false
    }
}
const checkPassword = () => {
    let errorMesssage = document.querySelector("#password +.errormsg")
    try {
        if (!passwordInput.value) {
            throw new Error("*password can't be empty")
        }
        if (passwordInput.value.length < 8) {
            throw new Error("*password too small")
        }
        if (!/[a-z]/.test(passwordInput.value)) {
            throw new Error("*password must contain a small aplhabet")
        }
        if (!/[A-Z]/.test(passwordInput.value)) {
            throw new Error("*password must contain a capital alphabet")
        }
        if (!/[0-9]/.test(passwordInput.value)) {
            throw new Error("*password must conatain a number")
        }
        if (!/[!@#$%^&*()]/.test(passwordInput.value)) {
            throw new Error("*password must contain a special character")
        }
        passwordInput.classList.add("correct")
        passwordInput.classList.remove("error");
        errorMesssage.textContent = ""
        return true
    } catch (error) {
        passwordInput.classList.remove("correct")
        passwordInput.classList.add("error");
        errorMesssage.textContent = error.message
        return false
    }
}
username.addEventListener("input", checkUsername)
gmailInput.addEventListener("input", checkGmail)
passwordInput.addEventListener("input", checkPassword)

const formSubmit = (e) => {

    e.preventDefault()
    if (checkUsername() && checkGmail() && checkPassword()) {
        let user={
            username:`${username.value}`,
            email:`${gmailInput.value}`,
            password:`${passwordInput.value}`,
            isLogged:false,
            watchLater:[],
            favourites:[]
          }
          users.push(user)
          localStorage.setItem(`users`,JSON.stringify(users))
          alert("signUp successful")
             setTimeout(() => {
                window.location.href="/pages/login.html"
             }, 300);
         
    } 
   
    }
form.addEventListener("submit", formSubmit)


const showPassWord = (e) => {
    e.target.classList.toggle("fa-eye")
    e.target.classList.toggle("fa-eye-slash")
    if (!e.target.classList.contains("fa-eye")) {
        passwordInput.setAttribute("type", "text")
    }
    else {
        passwordInput.setAttribute("type", "password")
    }
}
eyeIcon.addEventListener("click", showPassWord)
const checkConfirmPassword = () => {
    let errorMesssage = document.querySelector(" #confirmpassword +.errormsg")
    try {
        if (!confirmPassword.value) throw new Error("*this field can't be empty")
        if (confirmPassword.value != passwordInput.value) throw new Error("password did't matched")


        confirmPassword.classList.add("correct")
        confirmPassword.classList.remove("error");
        errorMesssage.textContent = ""
        return true
    } catch (error) {
        confirmPassword.classList.remove("correct")
        confirmPassword.classList.add("error");
        errorMesssage.textContent = error.message
        return false
    }
}

confirmPassword.addEventListener("input", checkConfirmPassword)

let currentTheme=localStorage.getItem("theme")
document.documentElement.classList.add(`${currentTheme}`)


