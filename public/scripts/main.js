var rhit = rhit || {};
rhit.FB_COLLECTION_EVENTS = "Events";
rhit.FB_KEY_NAME = "name";
rhit.FB_KEY_TIME = "time";
rhit.FB_KEY_WEEK = "week";
rhit.FB_KEY_DAY = "day";
rhit.FB_KEY_IMPORTANT = "important";
rhit.FB_KEY_AUTHOR = "author";
rhit.fbEventsManager = null;

rhit.FB_COLLECTION_USERS = "Users";
rhit.FB_KEY_EMAIL = "emailAddress";
rhit.FB_KEY_USERID = "uid";
rhit.FB_KEY_FRIENDSLIST = "friendsList";
rhit.FB_KEY_USERNAME = "name";

rhit.WEEK = 0;


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
			rhit.WEEK = 1;
			window.location.href= `/day.html?uid=${rhit.fbAuthManager.uid}&week=${rhit.WEEK}`;
		});

		nextWeekButton.onclick = ((event) => {
			rhit.WEEK = 2;
			window.location.href= `/day.html?uid=${rhit.fbAuthManager.uid}&week=${rhit.WEEK}`;
		});

		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html";
		});
		// clicking important events on menu drawer
		document.querySelector("#menuImportant").addEventListener("click", (event) => {
			window.location.href= `/importantevent.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking my contacts on menu drawer
		document.querySelector("#menuContacts").addEventListener("click", (event) => {
			window.location.href= `/contacts.html?uid=${rhit.fbAuthManager.uid}`;
		});
	}
	
}

rhit.DayPageController = class {
	constructor() {
		const urlParams = new URLSearchParams(window.location.search);
		const week = parseInt(urlParams.get("week"));
		console.log('rhit.WEEK :>> ', week);
		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html";
			
		});
		// clicking weeks page on menu drawer
		document.querySelector("#menuWeeks").addEventListener("click", (event) => {
			window.location.href= `/week.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking important events on menu drawer
		document.querySelector("#menuImportant").addEventListener("click", (event) => {
			window.location.href= `/importantevent.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking my contacts on menu drawer
		document.querySelector("#menuContacts").addEventListener("click", (event) => {
			window.location.href= `/contacts.html?uid=${rhit.fbAuthManager.uid}`;
		});
		//go to the event page
		document.querySelector("#monday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Monday`;
		});
		document.querySelector("#tuesday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Tuesday`;
		});
		document.querySelector("#wednesday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Wednesday`;
		});
		document.querySelector("#thursday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Thursday`;
		});
		document.querySelector("#friday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Friday`;
		});
		document.querySelector("#saturday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Saturday`;
		});
		document.querySelector("#sunday").addEventListener("click", (event) => {
			window.location.href= `/event.html?uid=${rhit.fbAuthManager.uid}&week=${week}&day=Sunday`;
		});
		

		document.querySelector("#submitAddEvent").onclick = (event) =>{
			const name = document.querySelector("#inputEvent").value;
			const time = document.querySelector("#inputTime").value;
			const day = document.getElementById("inputDay");
			const text = day.options[day.selectedIndex].text;
			const important = document.querySelector("#gridCheck").value;
			//move to the event page to add cards
			console.log('name, time, text :>> ', name, time, text);
			rhit.fbEventsManager.add(name,time,text,week,important);
			//try to use promise here!
			//window.location.href = "/event.html";
			console.log("doc added");
		};
	}

	
}

rhit.EventPageController = class {
	constructor() {
		const urlParams = new URLSearchParams(window.location.search);
		const week = parseInt(urlParams.get("week"));
		console.log("event page constructed");
		document.querySelector("#eventNav").addEventListener("click", (event) => {
			window.location.href = "/day.html";
			window.location.href= `/day.html?uid=${rhit.fbAuthManager.uid}&week=${week}`;
		});

		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html";
		});
		// clicking weeks page on menu drawer
		document.querySelector("#menuWeeks").addEventListener("click", (event) => {
			window.location.href= `/week.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking important events on menu drawer
		document.querySelector("#menuImportant").addEventListener("click", (event) => {
			window.location.href = `/importantevent.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking my contacts on menu drawer
		document.querySelector("#menuContacts").addEventListener("click", (event) => {
			window.location.href = `/contacts.html?uid=${rhit.fbAuthManager.uid}`;
		});


		document.querySelector("#submitEditEvent").onclick = (event) =>{
			const name = document.querySelector("#editEvent").value;
			const time = document.querySelector("#editTime").value;
			
		};

		rhit.fbEventsManager.beginListening(this.updateList.bind(this));



	}

	_createCard(e){
		return htmlToElement(`<div class="card">
        <div class="card-body">
			<div id="cardContainer">
          		<h5 id="${e.id}" class="card-title">${e.name}</h5>
	
		  		<div class="dropdown">
		  			<button id="cardsDropDown" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Action
		  			</button>
		  		<div class="dropdown-menu" aria-labelledby="dropdownMenu2">
					<button id="cardsEdit" class="dropdown-item" type="button" data-toggle="modal" data-target="#editEvents"><i class="material-icons">edit</i>&nbsp;&nbsp;&nbsp;Edit</button>
					<button id="cardsDelete" class="dropdown-item" type="button"><i class="material-icons">delete</i>&nbsp;&nbsp;&nbsp;Delete</button>
					<button id="cardsImportant" class="dropdown-item" type="button"><i id="importanceIcon${e.id}" class="material-icons">star_border</i>&nbsp;&nbsp;&nbsp;Important</button>
		  		</div>
			</div>
		</div>

        <h6 class="card-subtitle mb-2 text-muted">${e.time}</h6>
		</div>
      </div>`);
	}

	updateList(){
		const newList = htmlToElement('<div id="Event"></div>');
		
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const day = urlParams.get("day");
		
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(day == rhit.fbEventsManager.getEventAtIndex(i).day) {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createCard(e);
				
				newList.appendChild(newCard);
				
			}
		}
		//remove the old one nad put the new one.
		const oldList = document.querySelector("#Event");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);


		//The Important icon
		const importantButtons = document.querySelectorAll("#cardsImportant");
		for(let i=0; i<importantButtons.length; i++){
			importantButtons[i].onclick = (event) =>{
				console.log("pressed important");
				const id = document.getElementsByClassName("card-title")[i].id;
				console.log('id :>> ', id);
				this.updateImportance(id);
				//update html as well
				let text = document.querySelector(`#importanceIcon${id}`).innerHTML;
				console.log(text);
				this.updateIcon(text,id);
			};
		}

		//delete icon
		const deleteButtons = document.querySelectorAll("#cardsDelete");
		for(let i=0; i<deleteButtons.length; i++){
			deleteButtons[i].onclick = (event) =>{
				console.log("pressed delete");
				const id = document.getElementsByClassName("card-title")[i].id;
				this.delete(id);
			};
		}

		//edit icon
		const editButtons = document.querySelectorAll("#cardsEdit");
		for(let i=0; i<editButtons.length; i++){
			editButtons[i].onclick = (event) =>{
				console.log("pressed edit");
				document.querySelector("#submitEditEvent").onclick = (event) =>{
					const id = document.getElementsByClassName("card-title")[i].id;
					const name = document.querySelector("#editEvent").value;
					const time = document.querySelector("#editTime").value;
					this.updateEvent(id,name,time);
				};
			};
				
		}
	}
	updateImportance(id){
		 
		let ref = firebase.firestore().collection(rhit.FB_COLLECTION_EVENTS).doc(id);
		// if(this.isImportant(id)){

		rhit.fbEventsManager._ref.doc(id).get().then((documentSnapshot) => {
			const e =  documentSnapshot.get(rhit.FB_KEY_IMPORTANT);
			ref.update({
				[rhit.FB_KEY_IMPORTANT]: !e,
			}).then(() => {
				this.helping(id);
			});
		});

	}

	helping(id){
		rhit.fbEventsManager._ref.doc(id).get().then((documentSnapshot) => {
			console.log(documentSnapshot.get(rhit.FB_KEY_IMPORTANT));
		});
	}

	updateIcon(text,id){
		const theId = document.querySelector(`#importanceIcon${id}`);
		if(text == "star"){
			theId.innerHTML = "star_border";
			console.log(theId.innerHTML);
		}else{
			theId.innerHTML = "star";
			console.log(theId.innerHTML);
		}
	}

	updateEvent(id,name,time){
		let ref = firebase.firestore().collection(rhit.FB_COLLECTION_EVENTS).doc(id);
		ref.update({
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_TIME]: time
		})
			.then(() => {
				console.log("updated!");
			})
			.catch((error) => {
				console.error("Error updating document: ", error);
			});
	}

	delete(id) {
		let ref = firebase.firestore().collection(rhit.FB_COLLECTION_EVENTS).doc(id);
		ref.delete().then(()=>{
			console.log("Document deleted!");
		});
	 }
}

rhit.FBEventsManager = class{
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_EVENTS);
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
			[rhit.FB_KEY_IMPORTANT]: false,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid
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

		if(this._uid){
			console.log(this._uid);
			console.log(rhit.FB_KEY_AUTHOR);
			query = query.where(rhit.FB_KEY_AUTHOR,"==",this._uid);
		}

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
			docSnapshot.get(rhit.FB_KEY_IMPORTANT)
		);
		return e;
	  }
	  getEventWithID(id) { 
		const docSnapshot = this._documentSnapshots[index];
		const e = new rhit.Event(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_NAME),
			docSnapshot.get(rhit.FB_KEY_TIME),
			docSnapshot.get(rhit.FB_KEY_DAY),
			rhit.WEEK,
			docSnapshot.get(rhit.FB_KEY_IMPORTANT)
		);
		return e;
	  }
}
rhit.Event = class{
	constructor(id, name, time, day, week, important){
		this.id = id;
		this.name = name;
		this.time = time;
		this.day = day;
		this.week = week;
		this.important = important;
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
			window.location.href= `/week.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking important events on menu drawer
		document.querySelector("#menuImportant").addEventListener("click", (event) => {
			window.location.href= `/importantevent.html?uid=${rhit.fbAuthManager.uid}`;
		});
		rhit.fbUserManager.beginListening(rhit.fbAuthManager.uid, this.updateView.bind(this));
	}
	async getDocId(uid){
		console.log("called getDocId");
		let documents = rhit.fbUserManager._collectoinRef.where("uid", "==", uid);
		let documentId;
		await documents.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				console.log(doc.id);
				documentId =  doc.id;
			});
		})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});
		return documentId;
	}
	async updateView(){
		console.log("trying to update");
		let contactsDiv = document.querySelector("#detailContacts");
		const newList = htmlToElement('<div id="detailContacts"></div>');
		//oldElement.replaceWith(newElement);
		contactsDiv.replaceWith(newList);
		console.log(rhit.fbAuthManager.uid);

		let docRef = rhit.fbUserManager._collectoinRef.doc(await this.getDocId(rhit.fbAuthManager.uid));
		
		docRef.get().then((doc) => {
			if (doc.exists) {
				let friends = [];
				for(let i=0;i<doc.get(rhit.FB_KEY_FRIENDSLIST).length;i++){
					console.log( doc.get(rhit.FB_KEY_FRIENDSLIST)[i]);
					friends.push(doc.get(rhit.FB_KEY_FRIENDSLIST)[i]["email"]);
				}
				console.log('friends :>> ', friends);
				
				const writableDoc = rhit.fbUserManager._collectoinRef.doc(doc.id)
				this.addFriends(friends,writableDoc,doc);

				for(let j=0;j<friends.length;j++){
					//Done: implment onclick(edit and view) 
					const person = new rhit.Person(doc.get(rhit.FB_KEY_FRIENDSLIST)[j]["name"],doc.get(rhit.FB_KEY_FRIENDSLIST)[j]["email"],friends[j],doc.get(rhit.FB_KEY_FRIENDSLIST)[j]["uid"]);
					console.log('person.name :>> ', doc.get(rhit.FB_KEY_FRIENDSLIST)[j]["name"]);
					const newCard = this._createContactCard(person);
					newList.appendChild(newCard);
					//change edit and view html and authorization
					this.changeEditAndView(person,doc.get(rhit.FB_KEY_FRIENDSLIST));
					//change page
					this.changePage(person,doc);
					//delete friends
					this.delete(person,writableDoc,doc);
					console.log(newCard);
				}

			} else {
				console.log("No such document!");
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});

	}
	addFriends(friends,writableUser,user){

		document.querySelector("#submitAddContact").onclick = (() => {
			
			//check if it exists
			let users =  firebase.firestore().collection(rhit.FB_COLLECTION_USERS);
			users.onSnapshot((querySnapshot)=>{
				querySnapshot.forEach(function(doc) {
					console.log(doc.data().emailAddress);
					console.log(document.querySelector("#inputEmail").value);
					console.log(doc.data().emailAddress == document.querySelector("#inputEmail").value);
					//if it does
					if(doc.data().emailAddress == document.querySelector("#inputEmail").value){
						//add to friends list
						friends.push(document.querySelector("#inputEmail").value);
						//pass the info into firestore
						// Get the firends list array, save it to a variable
						let updatedList = user.get(rhit.FB_KEY_FRIENDSLIST);
						// Create a new map for the new firned (e.g. { "dmail" => document.whatever, name: "..."})
						const personInfo = new Map();
						personInfo.set("email",document.querySelector("#inputEmail").value);
						personInfo.set("name",document.querySelector("#inputContact").value);
						personInfo.set("view",false);
						personInfo.set("edit", false);
						
						for(let k=0; k<user.get(rhit.FB_KEY_FRIENDSLIST).length;k++){
							console.log(user.get(rhit.FB_KEY_FRIENDSLIST)[k]);
							updatedList.push(user.get(rhit.FB_KEY_FRIENDSLIST)[k]);
						}
						// Add the new map to the array
						const newPersonInfo = {	"name":document.querySelector("#inputContact").value,
												"email":document.querySelector("#inputEmail").value,
												"view": false, "edit":false,
												"uid":doc.data().uid};
						console.log('newPersonInfo :>> ', newPersonInfo);
						updatedList.push(newPersonInfo);
						// Then save the modified array to firestore
						console.log(updatedList);
						writableUser.update({
							[rhit.FB_KEY_FRIENDSLIST]: updatedList
						})
						.then(() => {
							console.log("Document successfully updated!");
						})
						.catch(() => {
							console.log("Document didn't update");
						});
					}
				});
			});


		});
	}
	changeEditAndView(person,friendList){
		for (let i = 0; i < friendList.length; i++) {
			//edit
			document.getElementById(`contactEdit${person.email}`).onclick = (() => {
				if (friendList[i]["email"] == person.email && friendList[i]["edit"]) {
					console.log(friendList[i]["edit"]);
					//change html
					document.getElementById(`editIcon${person.email}`).innerHTML = "done";
					//change the data in firestore
					friendList[i]["edit"] = false;
				} else if (friendList[i]["email"] == person.email && !friendList[i]["edit"]) {
					console.log(friendList[i]["edit"]);
					//change html
					document.getElementById(`editIcon${person.email}`).innerHTML = "";
					//change the data in firestore
					friendList[i]["edit"] = true;
				}
			});
			//view
			document.getElementById(`contactView${person.email}`).onclick = (() => {
				if (friendList[i]["email"] == person.email && friendList[i]["view"]) {
					console.log(friendList[i]["view"]);
					//change html
					document.getElementById(`viewIcon${person.email}`).innerHTML = "done";
					//change the data in firestore
					friendList[i]["view"] = false;
				} else if (friendList[i]["email"] == person.email && !friendList[i]["view"]) {
					console.log(friendList[i]["view"]);
					//change html
					document.getElementById(`viewIcon${person.email}`).innerHTML = "";
					//change the data in firestore
					friendList[i]["view"] = true;
				}
			});
		}
	}
	_createContactCard(person){
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <a id="link${person.uid}" style="font-size:20px" class="card-title">${person.name}</a>

		<div  style="margin-bottom: 10px" class="dropdown">
		  <button id="cardsDropDown" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			Action
		  </button>
	  		<div class="dropdown-menu" aria-labelledby="dropdownMenu2">
				<button id="contactEdit${person.email}" class="dropdown-item" type="button" data-toggle="modal" data-target="#editEvents"><i id="editIcon${person.email}" class="material-icons"></i>&nbsp;&nbsp;&nbsp;Can Edit</button>
				<button id="contactView${person.email}" class="dropdown-item" type="button"><i id="viewIcon${person.email}" class="material-icons"><span class="material-icons">
				
				</span></i>&nbsp;&nbsp;&nbsp;Can View</button>
				<button id="contactDelete${person.email}" class="dropdown-item" type="button"><i class="material-icons">delete</i>&nbsp;&nbsp;&nbsp;Delete</button>
	 		 </div>
		</div>


		  <h6 class="card-subtitle mb-2 text-muted">${person.email}</h6>
		</div>
	  </div>`);
	}
	changePage(person,self){
		document.getElementById(`link${person.uid}`).onclick = (() => {
			
			console.log("trying to change page");
			//redirecting if have the permission
			firebase.firestore().collection(rhit.FB_COLLECTION_USERS).onSnapshot((querySnapshot)=>{
				//check if have the permission
				querySnapshot.forEach(function(doc){
					if(doc.get(rhit.FB_KEY_EMAIL)==person.email){
						console.log("email same");
						for(let a=0;a<doc.get(rhit.FB_KEY_FRIENDSLIST).length;a++){
							console.log(doc.get(rhit.FB_KEY_FRIENDSLIST)[a]["view"]==true);
							if(doc.get(rhit.FB_KEY_FRIENDSLIST)[a]["view"]==true){
								console.log("should redirect me");
								
								window.location.href= `/importantevent.html?uid=${person.uid}`;

							}
						}
					}
				});
			});
		});
	}
	delete(person,writableUser,user){
		document.getElementById(`contactDelete${person.email}`).onclick =(() => {
			console.log(user);
			for(let b=0;b<user.get(rhit.FB_KEY_FRIENDSLIST).length;b++){
				console.log(user.id);
				if(user.get(rhit.FB_KEY_FRIENDSLIST)[b]["email"]==person.email){
					writableUser.update({
						[rhit.FB_KEY_FRIENDSLIST]: firebase.firestore.FieldValue.arrayRemove(user.get(rhit.FB_KEY_FRIENDSLIST)[b]),
					});
				}
			}
		});
	}
}
rhit.Person = class{
	constructor(name,email,uid){
		this.name = name;
		this.email = email;
		this.uid = uid
	}
}

rhit.ImportantEventPageController = class {
	constructor() {
		// clicking sign out on menu drawer
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = "/index.html"
		});
		// clicking weeks page on menu drawer
		document.querySelector("#menuWeeks").addEventListener("click", (event) => {
			window.location.href= `/week.html?uid=${rhit.fbAuthManager.uid}`;
		});
		// clicking my contacts on menu drawer
		document.querySelector("#menuContacts").addEventListener("click", (event) => {
			window.location.href= `/contacts.html?uid=${rhit.fbAuthManager.uid}`;
		});
		rhit.fbEventsManager.beginListening(this.updateImportantList.bind(this));
	}
	_createImportantCard(e){
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <h5 class="card-title">${e.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${e.time}</h6>
		  <h6 class="card-subtitle mb-2 text-muted">Week ${e.week}</h6>
		</div>
	  </div>`);
	}
	//update cards
	updateImportantList(){
		console.log("update something!");
		this.updateMonday();
		this.updateTuesday();
		this.updateWednesday();
		this.updateThursday();
		this.updateFriday();
		this.updateSaturday();
		this.updateSunday();
	}
	updateMonday(){
		let importantThingMon = document.querySelector("#monImp");
		const newList = htmlToElement('<div id="monImp"></div>');
		importantThingMon.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Monday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
	}
	updateTuesday(){
		let importantThingTues = document.querySelector("#tuesImp");
		const newList = htmlToElement('<div id="tuesImp"></div>');
		importantThingTues.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Tuesday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
	}
	updateWednesday(){
		let importantThingWed = document.querySelector("#wedImp");
		const newList = htmlToElement('<div id="wedImp"></div>');
		importantThingWed.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Wednesday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
	}
	updateThursday(){
		let importantThingThursday = document.querySelector("#thursImp");
		const newList = htmlToElement('<div id="tuesImp"></div>');
		importantThingThursday.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Thursday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
	}
	updateFriday(){
		let importantThingFri = document.querySelector("#friImp");
		const newList = htmlToElement('<div id="friImp"></div>');
		importantThingFri.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Friday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
	}
	updateSaturday(){
		let importantThingSat = document.querySelector("#satImp");
		const newList = htmlToElement('<div id="satImp"></div>');
		importantThingSat.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Saturday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
	}
	updateSunday(){
		let importantThingSun = document.querySelector("#sunImp");
		const newList = htmlToElement('<div id="sunImp"></div>');
		importantThingSun.replaceWith(newList);
		for(let i=0;i<rhit.fbEventsManager.length;i++){
			if(rhit.fbEventsManager.getEventAtIndex(i).important &&rhit.fbEventsManager.getEventAtIndex(i).day=="Sunday") {
				const e = rhit.fbEventsManager.getEventAtIndex(i);
				const newCard = this._createImportantCard(e);
				console.log(newList);
				newList.appendChild(newCard);
			}
		}
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

rhit.FbUserManager = class {
	constructor() {
		this._collectoinRef = firebase.firestore().collection(rhit.FB_COLLECTION_USERS);
		this._document = null;
	}
	beginListening(uid, changeListener) {
		console.log("Listening for uid", uid);
		let query = this._collectoinRef;
		query = query.where(rhit.FB_KEY_USERID,"==",uid);
		this._unsubscribe = query.onSnapshot((querySnapshot)=>{

			this._documentSnapshots = querySnapshot.docs;
			changeListener();
	});
		
	}
	//TODO: need major work
	addNewUserMaybe(uid,email) {
		// First check if the user already exists.
		console.log("Checking User for uid = ", uid);
		//Can I check document's uid to see if they exist?
		const userRef = this._collectoinRef.doc(uid);
		return userRef.get().then((document) => {
			if (document.exists) {
				console.log("User already exists.  Do nothing");
				return false; // This will be the parameter to the next .then callback function.
			} else {
				// We need to create this user.
				console.log("Creating the user!");
				return userRef.set({
					[rhit.FB_KEY_EMAIL]: email,
					[rhit.FB_KEY_FRIENDSLIST]:[],
					[rhit.FB_KEY_USERID]: uid
				}).then(() => {
					return true;
				});
			}
		});
	}

	get isListening() {
		return !!this._unsubscribe;
	}

	stopListening() {
		this._unsubscribe();
	}

	get email() {
		return this._document.get(rhit.FB_KEY_EMAIL);
	}

}

rhit.createUserObjectIfNeeded = function () {
	return new Promise((resolve, reject) => {
		if (!rhit.fbAuthManager.isSignedIn) {
			console.log("Nobody is signed in.  No need to check if this is a new User");
			resolve(false);
			return;
		}
		rhit.fbUserManager.addNewUserMaybe(
			rhit.fbAuthManager.uid).then((wasUserAdded) => {
			resolve(wasUserAdded);
		});
	});
}


rhit.checkForRedirects=function(){
	if(document.querySelector("#indexPage") && rhit.fbAuthManager.isSignedIn){
		console.log("should redirect me");
		window.location.href= `/week.html?uid=${rhit.fbAuthManager.uid}`;
	}
	if(!document.querySelector("#indexPage") && !rhit.fbAuthManager.isSignedIn){
		window.location.href="/index.html";
	}
};

rhit.main = function () {
	rhit.fbUserManager = new rhit.FbUserManager();
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		//console.log("uid: ", rhit.fbAuthManager.uid);
		// rhit.createUserObjectIfNeeded().then((isUserNew) => {
		// 	console.log('isUserNew :>> ', isUserNew);

		// });
		rhit.checkForRedirects();
		rhit.initializePage();
	});
	
	


}
rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);
	const uid = urlParams.get("uid");
	rhit.fbEventsManager = new rhit.FBEventsManager(uid);
	//for indexPage
	if (document.querySelector("#indexPage")) {
		new rhit.LoginPageController();

		//sign out:
		document.querySelector("#signOutButton").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		
	}

	if (document.querySelector("#Weeks")) {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		new rhit.WeekPageController();
	}
	if (document.querySelector("#Days")) {

		new rhit.DayPageController();
	}
	if (document.querySelector("#Contacts")) {
		new rhit.ContactPageController();
	}
	if(document.querySelector("#Event")){
		new rhit.EventPageController();
	}
	if(document.querySelector("#ImportantEvents")){
		new rhit.ImportantEventPageController();
	}
};


rhit.main();