const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

import Fetch from "../Slice/fetch.js";
const fetchModule = new Fetch("http://localhost:3002", 10000);

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

const submitsignUp = document.getElementById('submitsignUp');
const submitsignIn = document.getElementById('submitsignIn');

submitsignUp.addEventListener('click', async (e) => {

	try {
		
		e.preventDefault();
	
		const emailRegister=document.getElementById('emailRegister')
		const passwordRegister=document.getElementById('passwordRegister')
		const usernameRegister=document.getElementById('usernameRegister')
	
		if(emailRegister.value=="" || passwordRegister.value=="" || usernameRegister.value==""){
			 return console.log("Please fill all the fields")
		 }

		const data = {
			email: emailRegister.value,
			password: passwordRegister.value,
			username: usernameRegister.value
		};
	
		let call = await fetchModule.request("POST", data, "/register");
		
		if(call.status==200){
			
			container.classList.remove("right-panel-active");
			emailRegister.value="";
			passwordRegister.value="";
			usernameRegister.value="";
			const alertSuccess = await slice.getInstance("ToastAlert", {color:"green", text:"You have successfully registered", icon:"success"});
			alertSuccess.show();


		}else{
			const alertSuccess = await slice.getInstance("ToastAlert", {color:"red", text:"That email is already registered to another account", icon:"error"});
			alertSuccess.show();
		}

	} catch (error) {
		console.log(error)
		
	}


});

