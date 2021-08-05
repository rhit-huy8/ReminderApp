var rhit = rhit || {};
rhit.FB_COLLECTION_EVENTS = "Events";
rhit.FB_KEY_NAME = "name";
rhit.FB_KEY_TIME = "time";
rhit.FB_KEY_WEEK = "week";
rhit.FB_KEY_DAY = "day";
rhit.fbEventsManager = null;



function htmlToElement(html){
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


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
		//go to the event page
		const buttons = document.querySelectorAll(".day");
		buttons.forEach(function(button){
			button.onclick= ((event) => {
				console.log("done");
				window.location.href = "/event.html";
			});
		});
		document.querySelector("#submitAddEvent").onclick = (event) =>{
			const name = document.querySelector("#inputEvent").value;
			const time = document.querySelector("#inputTime").value;
			//const day = document.querySelector("#inputDay").value;
			const day = document.getElementById("inputDay");
			const text = day.options[day.selectedIndex].text;
			//move to the event page to add cards
			console.log('name, time, text :>> ', name, time, text);
			rhit.fbEventsManager.add(name,time,text,1);

			window.location.href = "/event.html";

			console.log("doc added");
					//start listening
				
		};
		//fix beginListening
		rhit.fbEventsManager.beginListening(this.updateList.bind(this));

	}

	_createCard(e){
		return htmlToElement(`<div class="card">
        <div class="card-body">
          <h5 class="card-title">${e.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${e.time}</h6>
        </div>
      </div>`);
	}

	updateList(){
		console.log("update something!");
		const newList = htmlToElement('<div id="Event"></div>');
		
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			const e = rhit.fbEventsManager.getEventAtIndex(i);
			const newCard = this._createCard(e);
			
			newList.appendChild(newCard);
		}
		//remove the old one nad put the new one.
		const oldList = document.querySelector("#Event");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);
	}
}

rhit.EventPageController = class {
	constructor() {
		console.log("event page constructed");
		document.querySelector("#eventNav").addEventListener("click", (event) => {
			window.location.href = "/day.html";
			
		});
		
	}

}
//in the dayController
rhit.FBEventsManager = class{
	constructor() {
		this._documentSnapshots = [];

		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_EVENTS = "Events");
		this._ref.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
				});
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
			});


		this._unsubscribe = null;
	}
	add(name, time, day, week) {
		console.log("trying to add");
		// Add a new document with a generated id.
		this._ref.add({
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_TIME]: time,
			[rhit.FB_KEY_DAY]: day ,
			[rhit.FB_KEY_WEEK]: week,
		})
			.then((docRef) => {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	}
	beginListening(changeListener) {
		let query = this._ref.limit(30);
		// if(this._uid){
		// 	query = query.where(rhit.FB_KEY_AUTHOR,"==",this._uid);
		// }

		this._unsubscribe = query.onSnapshot((querySnapshot)=>{

				this._documentSnapshots = querySnapshot.docs;
				changeListener();
		});
	}
	stopListening() {  
		this._unsubscribe();
	}
	get length() {  
		return this._documentSnapshots.length;
	  }
	getEventAtIndex(index) { 
		const docSnapshot = this._documentSnapshots[index];
		const e = new rhit.Event(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_NAME),
			docSnapshot.get(rhit.FB_KEY_TIME),
			docSnapshot.get(rhit.FB_KEY_DAY),
			1,
		);
		return e;
	  }
}
rhit.Event = class{
	constructor(id, name, time, day, week){
		this.id = id;
		this.name = name;
		this.time = time;
		this.day = day;
		this.week = week;
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
		//console.log('rhit.fbAuthManager.name :>> ', rhit.fbAuthManager.name);
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
		rhit.fbEventsManager = new rhit.FBEventsManager();
		new rhit.DayPageController();
	}
	if (document.querySelector("#Contacts")) {
		new rhit.ContactPageController();
	}
	if(document.querySelector("#Event")){
		
		new rhit.EventPageController();
	}
};


rhit.main();