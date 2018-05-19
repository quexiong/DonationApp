'use strict';

const addDonationToCurrentDonations = (name, amount, message, contact) => {
	let template = '<li class="contribution-item">' +
						'<div class="row">' +
							'<div class="contribution-details-container col-12">' +
								'<div class="contribution-details-info">' +
									'<div>Donor Name: ' + name +  '</div>' +
									'<div>Donation Amount: ' + amount + '</div>' +
									'<div>Message: ' + message + '</div>' +
									'<div>Contact: ' + contact + '</div>' +
								'</div>' +
								'<div class="contribution-buttons">' +
								'<button class="btn" id="edit-donation"><i class="fas fa-edit" id="edit-contribution-icon"></i> EDIT</button>' +
								'<button class="btn" id="delete-donation"><i class="fa fa-trash" id="#delete-contribution-icon"></i> DELETE</button>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</li>';
	return template;
};

// HELPER FUNCTIONS
const clearContent = (eventListener) => {
	$(eventListener).empty();
};

const reveal = (eventListener) => {
	$(eventListener).css('display', 'block');
};

const conceal = (eventListener) => {
	$(eventListener).css('display', 'none');
};

const clearLoginForm = () => {
	$('#input-Email-Login').val("");
	$('#input-Password-Login').val("");
};

const clearSignUpForm = () => {
	$('#input-FirstName').val("");
	$('#input-LastName').val("");
	$('#input-Email-SignUp').val("");
	$('#input-Password-SignUp').val("");
	$('#confirm-input-Password').val("");
};

const clearDonationFormValues = () => {
	$('.form-control').val("");
	$('.donation-message-text').val("");
};

// HELPER FUNCTION-AFTER LOGGING IN, HIDE HOME CONTAINER, DISPLAY EVENTS CONTAINER
const hideHome = () => {
	conceal('.home-banner-container');
	conceal('.footer-container');
	conceal('.home-container');
	reveal('.nav-bar-container');
	reveal('.contributions-container');
};

// Functions for handling buttons in the NAVBAR
const sunshineFundInfo = () => {
	$('.app-name').on('click', function(event) {
		event.preventDefault();
		console.log('you gon learn today');
	});
};

const logout = () => {
	$('#logout-button').on('click', function(event) {
		event.preventDefault();
		console.log('logging out now');
		username = '';
		user_id = '';
		window.location.href = "index.html";
	});
};

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