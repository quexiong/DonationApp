'use strict';
// API END POINTS
const SUNSHINE_USERS_URL = '/users';
const SUNSHINE_CONTRIBUTIONS_URL = '/contributions';

let username = '';
let user_id = '';
let event_name = '';

//###################################### AJAX functions ###########################################
// in this function, we req for the specific user that logged in, save the users unique ID to a var
// when the user logs in, we will call this function
const getUserID = (username) => {
	// let get_user_id = '';
	let url = SUNSHINE_USERS_URL + '/' + username;
	$.get(url, function(data) {
		user_id = data.id;
		console.log('this is from getUserID2');
		console.log(get_user_id);
	});
};

const postContributionToDB = (userID, donor, donation, message, contact) => {
	$.ajax({
		url: SUNSHINE_CONTRIBUTIONS_URL,
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify({
			userID: userID,
			donor: donor,
			donation: donation,
			message: message,
			contact: contact
		}),
		success: function(data) {
			console.log('donation made');
			console.log(data);
			getUserID(username);
		}
	})
	renderContributions(userID);
}

//#################################################################################################

//################################### DYNAMIC/RENDER functions ####################################
const renderContributions = (user_id) => {
	// console.log('this is the saved value of user id' + userID);
	$.ajax({
		url: SUNSHINE_CONTRIBUTIONS_URL + '/' + user_id,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		success: function(data) {
			console.log('rendering data');
			console.log(data);
		}
	})
};

//#################################################################################################

//########################### handles functions for login/signup ##################################
const loginSubmit = () => {
	$('#login-button').on('click', function(event) {
		event.preventDefault();
		console.log('logging you in');
		clearContent('.login-error-container');
		username = $('#input-Username-Login').val();
		let	userPassword = $('#input-Password-Login').val();
		console.log(username);

		function login(username, password) {
			$.ajax({
				type: 'POST',
				url: '/login',
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				data: JSON.stringify({
					username: username,
					password: password
				}),
				success: function(data) {
					localStorage.setItem("authToken", data.authToken);
					hideHome();
					console.log('logging in');
					
				},
				error: function(error) {
					alert(error);
				}
			});
		};
		
		login(username, userPassword);
		// getUserID(username);
		// console.log('getting id to pass into contribution creation');
		// user_id = getUserID(username);
	});
};

const signUpSubmit = () => {
	$('#signup-button').on('click', function(event) {
		event.preventDefault();
		console.log('submitting new user');
		clearContent('.signup-error-container');
		let input_firstName = $('#input-FirstName').val(),
			input_lastName = $('#input-LastName').val(),
			input_username = $('#input-Username-SignUp').val(),
			input_password = $('#input-Password-SignUp').val(),
			input_password2 = $('#confirm-input-Password').val();

		if(input_password != input_password2) {
			console.log('fatal error');
			$('.signup-error-container').append('passwords do not match');
		}

		function createNewUser(firstName, lastName, username, password) {
			if(password.length < 6) {
				alert('Password needs to be longer than 6 characters!');
			}
			else if(username === null) {
				alert('Enter a valid username');
			}
			else if(firstName === null) {
				alert('Enter your first name');
			}
			else if(lastName === null) {
				alert('Enter your last name');
			}
			else {
				$.ajax({
					url: SUNSHINE_USERS_URL,
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify({
						firstName: firstName,
						lastName: lastName,
						username: username,
						password: password
					}),
					success: (data) => {
						if(data) {
							console.log('successfully created account');
							console.log(data);
						}
						alert('Successfully created an account, please log in');
						window.location.href = "index.html";
					}
				});
			};
		};
		createNewUser(input_firstName, input_lastName, input_username, input_password);
	});
};
// #############################################################################################


// ########################handles CONTRIBUTION functions###################################
const addEventName = () => {
	$('#add-to-event').on('click', function(event) {
		event.preventDefault();
		console.log('adding name');
		conceal('.name-event-container');
		reveal('.create-contribution-container');
		let eventName = $('#input-event-name').val();
		console.log(eventName);
		$('.user-event').append('<h2>' + eventName + '</h2');

	});
}
const recordDonations = () => {
	// No need to access server, this function is entirely clientside
	$('#record-donation-button').on('click', function(event) {
		event.preventDefault();
		console.log('going to record donations now');
		conceal('.contribution-list-container');
		conceal('.create-contribution-container');
		reveal('.contribution-form-container');
	});
};

const addDonationToList = () => {
	$('#add-to-donations-list').on('click', function(event) {
		event.preventDefault();
		console.log('adding donation to the list of donations');
		reveal('.contribution-list-container');
		reveal('.create-contribution-container');
		conceal('.contribution-form-container');

		// Capture the values from the form to send to the server
		let donorName = $('#input-donor').val(),
			donationAmount = $('#input-donation-amount').val(),
			donationMessage = $('#input-donation-message').val(),
			donorContact = $('#input-contact-info').val();

		clearDonationFormValues();
		
		
		console.log('coming from inside addDonationtoList');
		console.log(user_id);
		postContributionToDB(user_id, donorName, donationAmount, donationMessage, donorContact);

		// $('.contributions-list').prepend(addDonationToCurrentDonations(donorName, donationAmount, donationMessage, donorContact));
		// need to make POST req to server with the info from above so server can create new event
		// document inside the db, server will respond with relevant info, info will persist upon reload
		// no more everytime we reload, then events reset to nothing on the clientside
	});
};

const cancelAddDonation = () => {
	$('#cancel-add-donation').on('click', function(event) {
		event.preventDefault();
		console.log('canceling donation and returning to donation list page');
		reveal('.contribution-list-container');
		reveal('.create-contribution-container');
		conceal('.contribution-form-container');
		clearDonationFormValues();	
	});
};

const editDonation = () => {
	$('.contributions-list').on('click', '#edit-donation', function(event) {
		event.preventDefault();
		console.log('editing donation')
	});

	// need to make request to server to grab the ID of the event, then use id to access the event document
	// server responds with new event info, save that info/append info to existing event element in the list 
};

const deleteDonation = () => {
	$('.contributions-list').on('click', '#delete-donation', function(event) {
		event.preventDefault();
		console.log('deleting donation')
		$(this).parent().parent().parent().parent().remove();
	});

	// in addition to removing event element from DOM, make req to server with ID of the event
	// sever will then go into DB and remove the event document inside the DB
};

// #############################################################################################

const ready = () => {
	// invoke login/signup functions
	loginSubmit();
	signUpSubmit();

	// invoke navigation functions
	sunshineFundInfo();
	logout();

	// invoke contribution functions
	addEventName();
	recordDonations();
	addDonationToList();
	cancelAddDonation();
	editDonation();
	deleteDonation();
};

ready();