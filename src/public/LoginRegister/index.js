const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

import mainFetch from "../Slice/fetch.js";




const emailRegister=document.getElementById('emailRegister')
const passwordRegister=document.getElementById('passwordRegister')
const usernameRegister=document.getElementById('usernameRegister')

const emailLogin=document.getElementById('emailLogin')
const passwordLogin=document.getElementById('passwordLogin')


const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');


registerForm.addEventListener('submit', async (e) => {
	
	try {
		
		e.preventDefault();
		
		const alertError = await slice.getInstance("ToastAlert", {color:"red", text:"Something went wrong, please try again.", icon:"error"});
		
		if(emailRegister.value=="" || passwordRegister.value=="" || usernameRegister.value=="" || !isValidEmail(emailRegister.value)){
			return alertError.show();
		}
		
		const data = {
			email: emailRegister.value,
			password: passwordRegister.value,
			username: usernameRegister.value
		};
		
	
		let call = await mainFetch.request("POST", data, "/register");
		
		console.log(call)
		
		if(call.status==200){
			
			container.classList.remove("right-panel-active");
			emptyRegisterFields();
			const alertSuccess = await slice.getInstance("ToastAlert", {color:"green", text:"Check your email for account validation.", icon:"success"});
			alertSuccess.show();

		}else if(call.status==409){
			const alertRegistered = await slice.getInstance("ToastAlert", {color:"red", text:"That email is already registered to another account", icon:"error"});
			emptyRegisterFields();
			alertRegistered.show();
		} else {
			
			alertError.show();
		}

	} catch (error) {
		console.log(error)
		
	}


});


loginForm.addEventListener('submit', async (e) => {
	
	try {
		
		e.preventDefault();
		
		const alertError = await slice.getInstance("ToastAlert", {color:"red", text:"Something went wrong, please try again.", icon:"error"});
		
		if(emailLogin.value=="" || passwordLogin.value=="" || !isValidEmail(emailLogin.value)){
			return alertError.show();
		}
		
		const data = {
			email: emailLogin.value,
			password: passwordLogin.value,
			
		};
		

		
		let call = await mainFetch.request("POST", data, "/login");
		
		console.log(call)
		
		if(call.status==200){
			
			window.location.href = "/home";

		}else if(call.status==403){
			const alertMissmatch = await slice.getInstance("ToastAlert", {color:"red", text:"Email and password dont match", icon:"error"});
			alertMissmatch.show();
		} else {
			
			alertError.show();
		}

	} catch (error) {
		console.log(error)
		
	}


});


function emptyRegisterFields(){
	emailRegister.value="";
	passwordRegister.value="";
	usernameRegister.value="";
}

const isValidEmail = email => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

