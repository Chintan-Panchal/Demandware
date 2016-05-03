'use strict';

var naPhone = /^\(?([2-9][0-8][0-9])\)?[\-\. ]?([2-9][0-9]{2})[\-\. ]?([0-9]{4})(\s*x[0-9]+)?$/,
	regex = {
		phone: {
			us: naPhone,
			ca: naPhone
		},
		postal: {
			us: /^\d{5}(-\d{4})?$/,
			ca: /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/,
			gb: /^GIR?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])?[0-9][ABD-HJLNP-UW-Z]{2}$/
		},
		email: /^[\w.%+\-]+@[\w.\-]+\.[\w]{2,6}$/,
		notCC: /^(?!(([0-9 -]){13,19})).*$/
	},
	settings = {
		// global form validator settings
		errorClass: 'error',
		errorElement: 'span',
		onkeyup: false,
		onfocusout: function (element) {
			if (!this.checkable(element)) {
				this.element(element);
			}
		}
	};
/**
 * @function
 * @description Validates a given phone number against the countries phone regex
 * @param {String} value The phone number which will be validated
 * @param {String} el The input field
 */
var validatePhone = function (value, el) {
	var country = $(el).closest('form').find('.country');
	if (country.length === 0 || country.val().length === 0 || !regex.phone[country.val().toLowerCase()]) {
		return true;
	}

	var rgx = regex.phone[country.val().toLowerCase()];
	var isOptional = this.optional(el);
	var isValid = rgx.test($.trim(value));

	return isOptional || isValid;
};
/**
 * @function
 * @description Validates a given email
 * @param {String} value The email which will be validated
 * @param {String} el The input field
 */
var validateEmail = function (value, el) {
	var isOptional = this.optional(el);
	var isValid = regex.email.test($.trim(value));
	return isOptional || isValid;
};

/**
 * @function
 * @description Validates that a credit card owner is not a Credit card number
 * @param {String} value The owner field which will be validated
 * @param {String} el The input field
 */
var validateOwner = function (value) {
	var isValid = regex.notCC.test($.trim(value));
	return isValid;
};

/**
 * Add phone validation method to jQuery validation plugin.
 * Text fields must have 'phone' css class to be validated as phone
 */
$.validator.addMethod('phone', validatePhone, Resources.INVALID_PHONE);

/**
 * Add email validation method to jQuery validation plugin.
 * Text fields must have 'email' css class to be validated as email
 */
$.validator.addMethod('email', validateEmail, Resources.INVALID_EMAIL);

/**
 * Add CCOwner validation method to jQuery validation plugin.
 * Text fields must have 'owner' css class to be validated as not a credit card
 */
$.validator.addMethod('owner', validateOwner, Resources.INVALID_OWNER);

/**
 * Add gift cert amount validation method to jQuery validation plugin.
 * Text fields must have 'gift-cert-amont' css class to be validated
 */
$.validator.addMethod('gift-cert-amount', function (value, el) {
	var isOptional = this.optional(el);
	var isValid = (!isNaN(value)) && (parseFloat(value) >= 5) && (parseFloat(value) <= 5000);
	return isOptional || isValid;
}, Resources.GIFT_CERT_AMOUNT_INVALID);

/**
 * Add positive number validation method to jQuery validation plugin.
 * Text fields must have 'positivenumber' css class to be validated as positivenumber
 */
$.validator.addMethod('positivenumber', function (value) {
	if ($.trim(value).length === 0) { return true; }
	return (!isNaN(value) && Number(value) >= 0);
}, ''); // '' should be replaced with error message if needed

var validator = {
	regex: regex,
	settings: settings,
	init: function () {
		var self = this;
		$('form:not(.suppress)').each(function () {
			$(this).validate(self.settings);
		});
	},
	initForm: function (f) {
		$(f).validate(this.settings);
	}
};

module.exports = validator;
