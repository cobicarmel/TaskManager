'use strict';

$(function(){

	/** Scripts that starting after the page has been loaded **/

	setInterval(TM.showDateTime, 200);

	$($('.table-time').get().reverse()).each(function(index){
		var elem = $(this);
		TM.tableTimes.unshift(new tableTime(elem, elem.index('.table-time')).init());
	})

	Client.getAll();

	Config.accordion = {
		heightStyle: 'content',
		icons: {header: 'ui-icon-triangle-1-w'}
	}

	$('#search-clients').html(function(){
		var form = $('#new-client').clone().attr('id', 'search-client');

		form.find('button').text(LOCAL[50]);

		form.find('input').removeAttr('required type');

		form.append($('<input>', {type: 'reset'}).val(LOCAL[54]));

		return form;
	})

	$('#cd-payments').accordion($.extend(Config.accordion, {active: 2}));

	$('#cdp-list').append(function(){
		var form = $('#new-payment').clone();

		form
			.prepend($('<div>', {'class': 'f-close ui-icon ui-icon-close'}))
			.attr('id', 'edit-payment')
			.addClass('abs-form')
			.find('button')
			.text(LOCAL[9]);

		return form;
	})

	$('#calendar, .p-date, #cdp-reports input').datepicker();

	$('#fm-multi-check').multiCheck('#filter-meets tbody input');

	$('#settings-toolbar').buttonset({icons: {primary: 'ui-icon-gear'}});

	Settings.navAgenda.setActive();

	$('#ae-starttime, #ae-endtime').timepicker(null, 5);

	Settings.buildGroups();

	Settings.listTasktypes();

	TM.fillEditForm($('#general-settings'), Config.default);

	$('#stt-duration').spinner({
		max: 300,
		min: 10,
		step: 5
	})

	/** Attaching Events **/

	$('#clients form, #cai-form').on('submit', function(e){
		TM.submitForm.call(this, e, Client.apiActions(this.id));
	})

	$('.number').on('keydown', function(event){
		return Api.validate.isDigit(event);
	})

	$('.dec-number').on({
		keydown: function(event){
			return Api.validate.decValue.call(this, event);
		},
		change: function(){
			var val = + this.value || 0;
			$(this).val(val.toFixed(2))
		}
	})

	$('#tt-head .ui-corner-all').hover(
		function(){
			$(this).addClass('ui-state-hover');
		},
		function(){
			$(this).removeClass('ui-state-hover');
		}
	)

	$('.menu-tab').click(TM.changeTab);

	$('.cdt-tab').click(Client.changeTab);

	$('#settings-toolbar label').click(Settings.changeTab);

	$('#cdd-remove').click(Client.remove);

	$('#cdd-remove').click(Client.remove);
	
	$('#cdp-navigate .ui-icon').click(Client.browsePayment);

	$('.cdc-right .cmd-icon').click(Client.addItem);

	$('#cr-print button').click(Client.printReport);

	$('.nav-arrows-wrap div').click(Settings.navAgenda.navigate);

	$('#as-datetime').click(TM.tableTimes[0].setDay);

	$('.f-close').on('click', function(){
		$(this).parent().hide();
	})

	$('button.ui-state-default').hover(function(){
		$(this).toggleClass('ui-state-hover');
	})

	$('#general-settings').on('submit', function(e){
		TM.submitForm.call(this, e, Settings.submitSettings);
	})

	/** Live events **/

	$('#cd-basic tbody').on('click', 'tr', Client.details);

	$(document).on('click', '.ui-dialog-buttonset button', TM.dialog.close);

	$('form').on('keyup', '.area-phone', function(){
		if(this.value.length == 3 || this.value.length == 2 && /^0[2-4,8-9]$/.test(this.value))
			$(this).siblings('.phone').focus();
	})

	/** Scripts that must run after events attached **/

	Client.copyForm = $('#edit-client').clone(true);

	$('#settings-toolbar label:first').click();
})