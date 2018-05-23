'use strict';

const SUNSHINE_USERS_URL = '/users';
const SUNSHINE_DONATIONS_URL = '/donations';

let username = '';
let user_id = '';

//###################################### AJAX functions ###########################################

const getUserID = (username) => {
	let url = SUNSHINE_USERS_URL + '/' + username;
	$.get(url, function(data) { 
		user_id = data.id; 
		console.log('this is from getUserID');
		console.log(user_id); 
	})
	.done(function(data) {
		renderDonations(user_id); 
	});
};

const postDonationToDB = (userId, purpose, donation, date) => {
	$.ajax({
		url: SUNSHINE_DONATIONS_URL,
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify({
			userId: userId,
			purpose: purpose,
			donation: donation,
			date: date 
		}),
		success: function(data) {
			console.log('donation made');
			console.log(data);
		}
	})
	renderDonations(user_id);
}

//#################################################################################################

//################################### DYNAMIC/RENDER functions ####################################
const renderDonations = (user_id) => {
	$.ajax({
		url: SUNSHINE_DONATIONS_URL + '/' + user_id,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		success: function(data) {
			console.log('rendering data');
		}
	})
	.done(function(data) {
		console.log(data);
		clearContent('.donations-list');
		let donationsArray = data;
		for(let i = 0; i < donationsArray.length; i++){
			let donationId = donationsArray[i].id,
				purpose = donationsArray[i].purpose,
				donation = donationsArray[i].donation,
				date = donationsArray[i].date;
				console.log(donationId);
			$('.donations-list').prepend(addDonationToCurrentDonations(purpose, donation, date, donationId));
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
				})
			})
			.done(function (data) {
				localStorage.setItem("authToken", data.authToken); 
				hideHome(); 
				console.log('logging in and saving user id'); 
				getUserID(username);
			})
		};
		
		login(username, userPassword);
		$('.user-name').append(username);
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

const recordDonations = () => {
	$('#record-donation-button').on('click', function(event) {
		event.preventDefault();
		console.log('going to record donations now');
		conceal('.donation-list-container');
		conceal('.create-donation-container');
		reveal('.donation-form-container');
	});
};

const addDonationToList = () => {
	$('#add-to-donations-list').on('click', function(event) {
		event.preventDefault();
		console.log('adding donation to the list of donations');
		reveal('.donation-list-container');
		reveal('.create-donation-container');
		conceal('.donation-form-container');

		let purpose = $('#input-purpose').val(),
			donationAmount = $('#input-donation-amount').val(),
			date = $('#input-date').val();

		clearDonationFormValues();
				
		console.log('coming from inside addDonationtoList');
		console.log(user_id);
		postDonationToDB(user_id, purpose, donationAmount, date);
	});
};

const cancelAddDonation = () => {
	$('#cancel-add-donation').on('click', function(event) {
		event.preventDefault();
		console.log('canceling donation and returning to donation list page');
		reveal('.donation-list-container');
		reveal('.create-donation-container');
		conceal('.donation-form-container');
		clearDonationFormValues();	
	});
};

const cancelEditDonation = () => {
	$('#edit-cancel-add-donation').on('click', function(event) {
		event.preventDefault();
		console.log('canceling edit and returning to donation list page');
		reveal('.donation-list-container');
		reveal('.create-donation-container');
		conceal('.edit-donation-form-container');
		clearDonationFormValues();	
	});
};

const editDonation = () => {
	$('.donations-list').on('click', '.edit', function(event) {
		event.preventDefault();
		console.log('editing donation');
		let donationId = $(this).siblings("input[type='hidden']").val();
		console.log(donationId);
		conceal('.donation-list-container');
		conceal('.create-donation-container');
		reveal('.edit-donation-form-container');

		let editPurpose = $('#edit-input-purpose').val(),
			editDonationAmount = $('#edit-input-donation-amount').val(),
			editDate = $('#edit-input-date').val();

		pushEditToDB(donationId);
});

const pushEditToDB = (donationId) => {
	$('#edit-add-to-donations-list').on('click', function(event) {
		event.preventDefault();

		let editPurpose = $('#edit-input-purpose').val(),
			editDonationAmount = $('#edit-input-donation-amount').val(),
			editDate = $('#edit-input-date').val();

		$.ajax({
			url: SUNSHINE_DONATIONS_URL + '/' + donationId,
			dataType: 'json',
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify({
					id: donationId,
					purpose: editPurpose,
					donation: editDonationAmount,
					date: editDate
				})
		})
		.done(function(data) {
			console.log(data);
			conceal('.edit-donation-form-container');
			reveal('.donation-list-container');
			reveal('.create-donation-container');
			clearDonationFormValues();
			renderDonations(user_id);
		})
	})
}	
};

const deleteDonation = () => {
	$('.donations-list').on('click', '.delete', function(event) {
		event.preventDefault();
		console.log('deleting donation');
		let donationId = $(this).siblings("input[type='hidden']").val();
		console.log(donationId);
    	$.ajax({
            url: SUNSHINE_DONATIONS_URL + '/' + donationId,
            dataType: 'json',
            type: 'DELETE',
            contentType: 'application/json',
            success: (data) => {
        	renderDonations(user_id);
        	}
    	})
	})
};

// #############################################################################################

const ready = () => {
	loginSubmit();
	signUpSubmit();
	sunshineFundInfo();
	logout();
	recordDonations();
	addDonationToList();
	cancelAddDonation();
	cancelEditDonation();
	editDonation();
	deleteDonation();
};

ready();