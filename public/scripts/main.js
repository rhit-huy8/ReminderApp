var rhit = rhit || {};



rhit.LoginPageController = class {
	constructor() {
		//google sign in
		rhit.fbAuthManager.startFirebaseAuthUi();
	}
}


rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		this._name = "";
	}

	get name() {
		return this._name || this._user.displayName;
	}


	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signOut() {
		firebase.auth().signOut().then(() => {
			console.log("signed out!");
		}).catch((error) => {
			console.log("Sign out error");
		});
	}

	startFirebaseAuthUi() {
		var ui = new firebaseui.auth.AuthUI(firebase.auth());
		ui.start('#firebaseui-auth-container', {
			signInSuccessUrl: '/',
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			],
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}
}


rhit.main = function () {


	//sign in:
	rhit.fbAuthManager = new rhit.FbAuthManager();
	const forwardButton = document.querySelector("#forward");
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		//display forward button
		if (rhit.fbAuthManager.isSignedIn) {
			const forwardButton = document.querySelector("#forward");
			forwardButton.style.display = "block";
		}else{
			forwardButton.style.display = "none";
		}
	});
	if (document.querySelector("#indexPage")) {
		console.log("You are on the login page.");
		new rhit.LoginPageController();
	}
	//redirect to week.html
	forwardButton.onclick = ((event) => {
		window.location.href = "/week.html";
	})

	//sign out:
	document.querySelector("#signOutButton").addEventListener("click", (event) => {
		rhit.fbAuthManager.signOut();
	});

}



rhit.main();