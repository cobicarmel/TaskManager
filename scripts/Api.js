'use strict';

var Api = {

	confirm: function(title, content, ok, cancel){

		var buttons = {};

		buttons[LOCAL[18]] = cancel || function(){};

		buttons[LOCAL[17]] = ok;

		var options = {
			title: typeof title == 'number' ? LOCAL[title] : title,
			content: typeof content == 'number' ? LOCAL[content] : content,
			buttons: buttons
		}

		TM.dialog.show(options);
	},

	error: function(content){
		TM.popup();
		TM.dialog.show({title: LOCAL[23], content: LOCAL[content]});
	},

	send: function(subject, action, params, success){

		if(! Access.hasAction(subject, action))
			throw new Error('The action ' + action + '@' + subject + ' denied for this user');

		if(typeof params == 'function'){
			success = params;
			params = {};
		}

		params.action = action;
		params.subject = subject;

		var options = {
			complete: function(status){
				if(status.getResponseHeader('TM-finalURL') == 'login/')
					location.replace($('#logout a').prop('href'));
			},
			data: params,
			dataType: 'json',
			statusCode: {
				403: function(){
					Api.error(73);
				}
			},
			success: function(res){

				if(res.error)
					return Api.error(24);

				success && success(res.data);
			},
			type: 'post'
		}

		$.ajax('Api.php', options);

	},

	validate: {

		classes: {
			number: function(){
				return /^[0-9]+$/.test(this.value) ? true : 20;
			}
		},

		names: {

			global: [{
				type: ['date', 'from', 'to'],
				check: function(){
					return /^([0-2][0-9]|3(0|1))\/(0[1-9]|1[0-2])\/20[0-9]{2}$/.test(this.value) ? true : 65;
				}
			}, {
				type: ['mid'],
				check: function(){
					return Api.validate.validateId(this.value) ? true : 27;
				}
			}],

			'ae-form': [{
				type: ['endtime'],
				check: function(){

					var startVal = $(this).parents('form').find('[name=starttime]').val(),
						endVal = this.value;

					return endVal < startVal && endVal != '00:00' || startVal == endVal ? 1 : true;
				}
			}],

			'se-user': [{
				type: ['re-password'],
				check: function(){

					var password = $(this).parents('form').find('[name=password]').val();

					return password != this.value ? 87 : true;
				}
			}],

			'reminders-edit': [{
				type: ['strdate'],
				check: function(){

					var date = this.value.toDate($('#rf-time').val()),
						now = new Date;

					return date <= now ? 91 : true;
				}
			}]
		},

		check: function(){

			if(! this.value)
				return true;

			var formId = $(this).parents('form').attr('id'),
				names = Api.validate.names.global,
				specialNames = Api.validate.names[formId],
				classFn = Api.validate.classes[this.className];

			if(specialNames)
				names = names.concat(specialNames);

			for(var i in names){

				var group = names[i];

				if(group.type.indexOf(this.name) + 1){

					var nameValid = group.check.apply(this);

					if(nameValid !== true)
						return nameValid;
				}
			}

			if(classFn){
				var classValid = classFn.apply(this);
				if(classValid !== true)
					return classValid;
			}

			return true;
		},

		confirm: {},

		decValue: function(event){

			this.setRangeText('');

			var code = event.keyCode || event.which,
				val = this.value;

			if(code == 110 || code == 190)
				return val ? ! (val.indexOf('.') + 1) : $(this).val(0);

			if(code == 109 || code == 189)
				return ! val;

			return Api.validate.isDigit(event);
		},

		error: function(error){
			var errorDiv = $('#api-error'),
				element = $(error.element).focus(),
				offset = element.offset();

			errorDiv
				.show()
				.css({
					top: offset.top - (errorDiv.height() * 2) + 5,
					left: offset.left
				})
				.text(LOCAL[error.no])
				.delay(5000)
				.fadeOut();
		},

		isDigit: function(event){
			var code = event.keyCode || event.which;
			return ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 9 || code == 0 || code == 8 || code == 46 || code == 13);
		},

		validateId: function(number){

			number = number.split('');

			if(number.length < 8 || number.length > 9)
				return false;

			if(number.length == 8)
				number.unshift(0);

			var totalVal = 0;

			for(var i in number){

				if(i % 2)
					number[i] *= 2;

				if(number[i] > 9)
					number[i] = (number[i] % 10) + 1;

				totalVal += eval(number[i]);
			}

			return totalVal && totalVal % 10 == 0;
		}
	}
}