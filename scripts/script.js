'use strict';

$(function(){

	/* variables for duplicate jQuery selectors */

	var $body = $('body'),
		$generalSettings = $('#general-settings');

	/* Scripts that starting after the page has been loaded */

	setInterval(TM.showDateTime, 200);

	if(Access.hasAction('Agenda'))

		$($('.table-time').get().reverse()).each(function(){
			var elem = $(this);
			TM.tableTimes.unshift(new tableTime(elem, elem.index('.table-time')).init());
		})

	if(Access.hasAction('Client'))

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

	$('#fm-multi-check').multiCheck('#filter-meets tbody input');

	$('#settings-toolbar').buttonset({icons: {primary: 'ui-icon-gear'}});

	Settings.navAgenda.setActive();

	$('#ae-starttime, #ae-endtime, #rf-time').timepicker(null, 5);

	Settings.buildGroups();

	Reminders.init();

	Settings.listTasktypes();

	$('#calendar, .p-date, #cdp-reports input, #rf-date').datepicker();

	if(Access.hasAction('Settings', 'changesettings')){
		TM.fillEditForm($generalSettings, Config.default);
		$('#sa-tables').accordion($.extend({}, Config.accordion, {active: 0}));
		Access.writeSettings();
	}

	$('#stt-duration').spinner({
		max: 300,
		min: 10,
		step: 5
	})

	/** Attaching Events **/

	$('#clients form, #cai-form').on('submit', function(){
		TM.submitForm.call(this, Client.apiActions(this.id));
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

	$('#cdp-navigate .ui-icon').click(Client.browsePayment);

	$('.cdc-right .cmd-icon').click(Client.addItem);

	$('#cr-print button').click(Client.printReport);

	$('.nav-arrows-wrap div').click(Settings.navAgenda.navigate);

	if(TM.tableTimes[0])
		$('#as-datetime').click(TM.tableTimes[0].setDay);

	$('#rp-later').click(Reminders.changePreTime);

	$('#rp-edit').click(Reminders.goToReminder);

	$('[name=allow_desktop_notify]').on('change', function(){
		if(this.value)
			Reminders.desktopNotify.enable();
	})

	$('.f-close').on('click', function(){
		$(this).parent().hide();
	})

	$('button.ui-state-default').hover(function(){
		$(this).toggleClass('ui-state-hover');
	})

	$generalSettings.on('submit', function(){
		TM.submitForm.call(this, Settings.submitSettings);
	})

	$('#set-access').submit(Access.changeAccess);

	$('#sa-tables input').on('change', function(){

		var checked = this.checked,
			$this = $(this),
			siblings = $this.parents('tr').find('input'),
			index = siblings.index(this),
			nexts = siblings.slice(index + 1),
			prevs = siblings.slice(0, index);

			(checked ? prevs : nexts).prop('checked', checked);
	})

	$('#rp-actions .fa, #rp-client').on('click', function(){
		Reminders.$popup.hide();
	})

	/** Live events **/

	$('#cd-list tbody').on('click', 'tr', Client.details);

	$body.on('click', '.ui-dialog-buttonset button', TM.dialog.close);

	$body.on('submit', 'form', function(e){
		e.preventDefault();
	});

	$body.on('keydown', '.number', function(event){
		return Api.validate.isDigit(event);
	})

	$('form').on('keyup', '.area-phone', function(){
		if(this.value.length == 3 || this.value.length == 2 && /^0[2-4,8-9]$/.test(this.value))
			$(this).siblings('.phone').focus();
	})

	/** Scripts that must run after events attached **/

	Client.copyForm = $('#edit-client').clone(true);

	$('#settings-toolbar label:first').click();
})