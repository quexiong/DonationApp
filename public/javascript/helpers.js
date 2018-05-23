'use strict';

const addDonationToCurrentDonations = (purpose, amount, date, id) => {
	let template = `<li class="donation-item">
						<div>
							<p>Purpose: ${purpose}</p>
							<p>Purpose: ${amount}</p>
							<p>Purpose: ${date}</p>
							<button class="btn edit">Update</button>
							<button class="btn delete">Delete</button>
							<input type="hidden" id="entryId" value="${id}">
						</div>
					</li>`;
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
	reveal('.donations-container');
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

