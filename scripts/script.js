$(function(){

	/** Scripts that starting after the page has been loaded **/

	setInterval(showDateTime, 200);

	changeTab.apply($('.menu-tab')[0]);

	tableTime.createTable();

	Agenda.getAll(tableTime.setDay);

	Client.getAll();

	Config.accordion = {
		heightStyle: 'content',
		icons: {header: 'ui-icon-triangle-1-w'}
	}

	$('#calendar, #nm-date input').datepicker({onSelect: tableTime.setDay});

	$('#tt-body').selectable({
		filter: '#tt-body-overlay .tt-meeting',
		delay: 100,
		stop: tableTime.selectedMeets
	})

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

	$('.p-date, #cdp-reports input').datepicker();

	$('#fm-multi-check').multiCheck('#filter-meets tbody input');

	/** Attaching Events **/

	$('form').on('submit', function(e){

		e.preventDefault();

		var form = $(this),
			valid = form.validate();

		if(valid == true)
			Api.perform[this.id].apply(form);
		else if(typeof valid == 'object')
			Api.validate.error(valid);
	})

	$('.number').on('keydown', function(event){
		return Api.validate.isDigit(event);
	})

	$('.dec-number').on({
		keydown: function(event){
			return Api.validate.decValue.call(this, event);
		},
		change: function(){
			var val = + this.value;
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

	$('.menu-tab').click(changeTab);

	$('.tt-content-part').click(tableTime.newMeeting);

	$('#tt-head-prev').click(tableTime.prev);

	$('#tt-head-next').click(tableTime.next);

	$('.cdt-tab').click(Client.changeTab);

	$('#cdd-remove').click(Client.remove);

	$('#cdd-remove').click(Client.remove);
	
	$('.cn-arrows .ui-icon').click(Client.browsePayment);

	$('.cdc-right .cmd-icon').click(Client.addItem);

	$('#cr-print button').click(Client.printReport);

	$('#cai-close').click(function(){
		$('#c-add-item').hide();
	})

	$('.f-close').on('click', function(){
		$(this).parent().hide();
	})

	$('button.ui-state-default').hover(function(){
		$(this).toggleClass('ui-state-hover');
	})

	$('#starttime').on('change', function(){
		$('#nm-start').text(this.value);
		tableTime.setEndTime();
	})

	$('#nm-add-client').on('click', function(){
		changeTab.call($('[tab=client]'), 'new-meet');
		$(clients).accordion('option', 'active', 0);
	})

	/** Live events **/

	$('#cd-basic tbody').on('click', 'tr', Client.details);

	$(document).on('click', '.ui-dialog-buttonset button', dialog.close);

	$('form').on('keyup', '.area-phone', function(){
		if(this.value.length == 3 || this.value.length == 2 && /^0[2-4,8-9]$/.test(this.value))
			$(this).siblings('.phone').focus();
	})

	/** Scripts that must run after events attached **/

	Client.copyForm = $('#edit-client').clone(true);

})