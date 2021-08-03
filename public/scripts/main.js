var rhit = rhit || {};



rhit.LoginPageController = class {
	constructor() {
		//google sign in
		rhit.fbAuthManager.startFirebaseAuthUi();
	}
}

rhit.WeekPageController = class {
	constructor() {
		let thisWeekButton = document.querySelector("#ThisWeek");
		let nextWeekButton = document.querySelector("#NextWeek");

		thisWeekButton.onclick = ((event) => {
			window.location.href = "/day.html";
		});

		nextWeekButton.onclick = ((event) => {
			window.location.href = "/day.html";
		});

		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html";
		});
		// clicking my contacts on menu drawer
		document.querySelector("#menuContacts").addEventListener("click", (event) => {
			window.location.href = "/contacts.html";
		});
	}
	
}

rhit.DayPageController = class {
	constructor() {
		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html";
		});
		// clicking weeks page on menu drawer
		document.querySelector("#menuWeeks").addEventListener("click", (event) => {
			window.location.href = "/week.html";
		});
		// clicking my contacts on menu drawer
		document.querySelector("#menuContacts").addEventListener("click", (event) => {
			window.location.href = "/contacts.html";
		});
	}
}

rhit.EventPageController = class {
	constructor() {

	}
}

rhit.ContactPageController = class {
	constructor() {
		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html"
		});
		// clicking weeks page on menu drawer
		document.querySelector("#menuWeeks").addEventListener("click", (event) => {
			window.location.href = "/week.html"
		});
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

	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.initializePage();


}
rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);
	//for indexPage
	if (document.querySelector("#indexPage")) {
		new rhit.LoginPageController();
		console.log("You are on the login page.");
		const uid = urlParams.get("uid");
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
			//redirect to week.html
		forwardButton.onclick = ((event) => {
		window.location.href = "/week.html";
	})
		//sign out:
		document.querySelector("#signOutButton").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		
	}

	if (document.querySelector("#Weeks")) {
		new rhit.WeekPageController();
	}
	if (document.querySelector("#Days")) {
		new rhit.DayPageController();
	}
	if (document.querySelector("#Contacts")) {
		new rhit.ContactPageController();
	}
};


rhit.main();