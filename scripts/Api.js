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

		dialog.show(options);
	},

	error: function(content){
		popup();
		dialog.show({title: LOCAL[23], content: LOCAL[content]});
	},

	isAllowed: function(subject, action){

		var allowed = false;

		for(var act in Config.actions)
			if(Config.actions[act].subject == subject && Config.actions[act].action == action){
				allowed = true;
				break;
			}

		return allowed;
	},

	perform: {
		'new-meeting': Task.createMeeting,
		'new-client': Client.newClient,
		'search-client': Client.search,
		'edit-client': Client.saveEdit,
		'cai-form': Client.saveItem,
		'new-payment': Client.newPayment,
		'edit-payment': Client.editPayment,
		'cdp-reports': Client.expReport
	},

	send: function(subject, action, params, success){

		if(! Api.isAllowed(subject, action))
			throw new Error('The action ' + action + '@' + subject + ' denied for this user');

		if(typeof params == 'function')
			success = params,
			params = {};

		params.action = action;
		params.subject = subject;

		var options = {
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

		names: [{
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

		check: function(){

			if(! this.value)
				return true;

			var names = Api.validate.names,
				nameFn,
				classFn = Api.validate.classes[this.className];

			for(var name in names){
				var group = names[name];
				if(group.type.indexOf(this.name) + 1){
					nameFn = group.check;
					break;
				}
			}

			if(nameFn){
				var nameValid = nameFn.apply(this);
				if(nameValid !== true)
					return nameValid;
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