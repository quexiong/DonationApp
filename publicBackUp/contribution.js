'use strict';

// ADD DONATION TEMPLATE
const  addDonationToCurrentDonations = (name, amount, message, contact) => {
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
const conceal = (eventListener) => {
	$(eventListener).css('display', 'none');
};

const reveal = (eventListener) => {
	$(eventListener).css('display', 'block');
};

const clearContent = (eventListener) => {
	$(eventListener).empty();
};

const clearDonationFormValues = () => {
	$('.form-control').val("");
	$('.donation-message-text').val("");
};

// Functions for handing buttons in the NAVBAR
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
	});
};

// Functions for handling EVENT CRUD buttons
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

		console.log(donorName);
		console.log(donationAmount);
		console.log(donationMessage);
		console.log(donorContact);

		clearDonationFormValues();
		$('.contributions-list').prepend(addDonationToCurrentDonations(donorName, donationAmount, donationMessage, donorContact));
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

const ready = () => {
	sunshineFundInfo();
	logout();
	recordDonations();
	addDonationToList();
	cancelAddDonation();
	editDonation();
	deleteDonation();
};

ready();