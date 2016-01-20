'use strict';

$(document).ready(function () {
	$('#edit_aisle').submit(editAisle)
	$('#edit_discount').submit(editDiscount)

	$('#add_aisle').submit(addAisle)
	$('#add_discount').submit(addDiscount)

	$('body').on('click', '.btn-edit-aisle', setAisle)
	$('body').on('click', '.btn-edit-discount', setDiscount)
	$('body').on('click', '.btn-delete-aisle', deleteAisle)
	$('body').on('click', '.btn-delete-discount', deleteDiscount)
})

const apiKey = '*** Get your own API and Mongolab account ****';

// to fetch all Aisle names from database (db)  
function getAisles() {
	$.get('https://api.mongolab.com/api/1/databases/groceryshop/collections/aisles?apiKey=' + apiKey, function (data) {
		var output = '<ul class="list-group">';
		$.each(data, function (key, data) {
			output += '<li class="list-group-item aisle">' + '<div class="pull-right"><a class="btn btn-primary btn-edit-aisle" data-aisle-id="'+ data._id.$oid +'">Edit</a> <a class="btn btn-danger btn-delete-aisle" data-aisle-id="'+ data._id.$oid +'">Delete</a></div>'
			 + data.aisle_name + 
			'</li>';
		})

		output += '</ul>';
		$('#aisles').html(output);
	});
}

// to add new Aisle name
function addAisle() {
	var aisle_name = $('#aisle_name').val();
	$.ajax({
		url: "https://api.mongolab.com/api/1/databases/groceryshop/collections/aisles?apiKey=" + apiKey,
		data: JSON.stringify({ "aisle_name": aisle_name }),
		type: 'POST',
		contentType: 'application/json',
		success: function (data) {
			window.location.href = 'aisles.html';
		},
		error: function (xhr, status, err) {
			console.log(err);
		}
	})
	// to prevent the browser from submitting the event
	return false;
}

function editAisle () {
	var aisle_id = sessionStorage.getItem('currentAisleId');
	var aisle_name = $('#aisle_name').val();
	$.ajax({
		url: "https://api.mongolab.com/api/1/databases/groceryshop/collections/aisles/" + aisle_id + "?apiKey=" + apiKey,
		data: JSON.stringify({ "aisle_name": aisle_name }),
		type: 'PUT',
		contentType: 'application/json',
		success: function (data) {
			window.location.href = 'aisles.html';
		},
		error: function (xhr, status, err) {
			console.log(err);
		}
	})
	// to prevent the browser from submitting the event
	return false;
}

function setAisle () {
	var aisle_id = $(this).data('aisle-id');
	// works the same way as HTML5 storage when the session ends it clears
	// this local Storage -> stays there until you actually clear it.
	sessionStorage.setItem('currentAisleId', aisle_id)
	window.location.href = 'editaisle.html';
	return false;
}

function getAisle () {
	var aisle_id = sessionStorage.getItem('currentAisleId');
	$.get('https://api.mongolab.com/api/1/databases/groceryshop/collections/aisles/' + aisle_id + '?apiKey=' + apiKey, function (data) {
		$('#aisle_name').val(data.aisle_name);
	})
}

function deleteAisle () {
	var aisle_id = $(this).data('aisle-id');

	$.ajax({
		url: "https://api.mongolab.com/api/1/databases/groceryshop/collections/aisles/" + aisle_id + "?apiKey=" + apiKey,
		type: 'DELETE',
		async: true,
		timeout: 30 * 1000,
		success: function (data) {
			window.location.href = 'aisles.html';
		},
		error: function (xhr, status, err) {
			console.log(err);
		}
	})
	// to prevent the browser from submitting the event
	return false;
}

// rendering all options on adding discount page

function getOptions () {
	$.get('https://api.mongolab.com/api/1/databases/groceryshop/collections/aisles?apiKey=' + apiKey, function (data) {
		var output = '';

		$.each(data, function (key, data) {
			output += '<option value=' + data.aisle_name + '>' + data.aisle_name + '</option>'
		})

		$('#aisle').html(output);
	})
}

function addDiscount () {
	var discount = {
		discountName: $('#discount_name').val(),
		aisle: $('#aisle').val(),
		percentageDiscount: $('#percentage_discount').val()
	};
	$.ajax({
		url: "https://api.mongolab.com/api/1/databases/groceryshop/collections/discounts?apiKey=" + apiKey,
		data: JSON.stringify({ "discount": discount }),
		type: 'POST',
		contentType: 'application/json',
		success: function (data) {
			window.location.href = 'index.html';
		},
		error: function (xhr, status, err) {
			console.log(err);
		}
	})
	return false;
}

function getDiscounts() {
	$.get("https://api.mongolab.com/api/1/databases/groceryshop/collections/discounts?apiKey=" + apiKey, function (data) {
		var output = '';
		$.each(data, function (key, data) {
			output += '<li class="list-group-item discount">' + ' <div class="pull-left">' + data.discount.discountName + ' | ' + data.discount.aisle + '</div>' + ' <div class="pull-right">' + ' ' + '[' + data.discount.percentageDiscount + ']% Discount ' + ' <a class="btn btn-primary btn-edit-discount" data-discount-id="' + data._id.$oid + '">Edit</a> <a class="btn btn-danger btn-delete-discount" data-discount-id="'+ data._id.$oid +'">Delete</a></div>' + '</li>';
		})

		$('#discounts').html(output)
	})

	return false;
}

// to edit a discount we save its id with setdiscount that guides us to the edit page 

function setDiscount () {
	var discountId = $(this).data('discount-id');
	// works the same way as HTML5 storage when the session ends it clears
	// this local Storage -> stays there until you actually clear it.
	sessionStorage.setItem('currentdiscountId', discountId)
	window.location.href = 'editdiscount.html';
	return false;
}

function editDiscount () {
	var discountId = sessionStorage.getItem('currentdiscountId');

	var discount = {
		discountName: $('#discount_name').val(),
		aisle: $('#aisle').val(),
		percentageDiscount: $('#percentage_discount').val(),
		checked: ($('#is_urgent').val() === "on" ? true : false)
	};


	$.ajax({
		url: "https://api.mongolab.com/api/1/databases/groceryshop/collections/discounts/" + discountId + "?apiKey=" + apiKey,
		data: JSON.stringify({ "discount": discount }),
		type: 'PUT',
		contentType: 'application/json',
		success: function (data) {
			window.location.href = 'index.html';
		},
		error: function (xhr, status, err) {
			console.log(err);
		}
	})

	return false;

}


// to delete discount 

function deleteDiscount () {
	var discountId = $(this).data('discount-id');

	$.ajax({
		url: "https://api.mongolab.com/api/1/databases/groceryshop/collections/discounts/" + discountId + "?apiKey=" + apiKey,
		type: 'DELETE',
		async: true,
		timeout: 30 * 1000,
		success: function (data) {
			// hold off for a sec
			window.location.href = 'index.html';
			console.log('found and deleted');
		},
		error: function (xhr, status, err) {
			console.log(err);
		}
	})
	// to prevent the browser from submitting the event
	return false;
}

