'use strict';

var Reminders = {

	$popup: $('#reminder-popup'),

	buildGroups: function(){
		(new TM.createGroup('Reminders', 'reminders', Reminders.refresh)).init();
	},

	changePreTime: function(){

		var id = Reminders.$popup.data('id'),
			preMS = $('#rp-minutes').val() * 60000,
			dateMS = (new Date).getTime();

		var params = {
			id: id,
			'custom_pre': dateMS + preMS
		}

		Api.send('Reminders', 'editreminders', params);

		Reminders.installTimer(id, preMS, function(){
			Reminders.popReminder(id);
		})

		TM.popup('success', 88);
	},

	changeStatus: function(){

		var $this =  $(this),
			params = {
				status: $this.data('status') ? 0 : 1,
				id: $this.parents('tr').data('id')
			};

		TM.popup('loading', 96);

		Api.send('Reminders', 'editreminders', params, function(res){
			TM.popup();
			TM.groups.reminders.applyChanges(res);
		});
	},

	getSoonReminders: function(){

		var now = (new Date).getTime();

		return $.map(Config.reminders, function(data, key){

			var remindTime = data.custom_pre || data.date.getTime() - data.pre,
				isSoon = remindTime > now && remindTime < now + (60 * 60 * 24 * 1000);

			return isSoon ? (data.id = key, data) : null;
		})
	},

	goToReminder: function(){

		var id = Reminders.$popup.data('id'),
			$editButton = $('#group-reminders .group-list tbody tr').filter(function(){
				return $(this).data('id') == id;
			}).find('.fa-pencil');

		$editButton.click();
	},

	init: function(){
		Reminders.parseData();
		Reminders.buildGroups();
		Reminders.remind();
	},

	installTimer: function(id, msDuration, fn){
		Reminders.timers[id] = setTimeout(fn, msDuration);
	},

	parseData: function(){

		for(var r in Config.reminders){
			var reminder = Config.reminders[r];

			reminder.date = reminder.strdate.toDate(reminder.strtime);

			reminder.status = + reminder.status;

			var $statIcon = $('<div>', {class: 'reminder-status'}),
				$markAs = $('<div>', {class: 'reminder-mark'}).data('status', reminder.status),
				markText = 94,
				color,
				title;

			if(reminder.status){
				markText = 95;
				color = 'green';
				title = 92;
			}
			else{
				if(reminder.date < new Date){
					color = 'red';
					title = 91;
				}
				else{
					color = 'yellow';
					title = 93;
				}
			}

			$statIcon
				.css('background-color', color)
				.attr('title', LOCAL[title]);

			$markAs.text(LOCAL[markText]);

			reminder.status = $statIcon;

			reminder.mark = $markAs;
		}
	},

	popReminder: function(id){

		if( + Config.default.reminders_audio)
			$('#reminder-audio')[0].play();

		var $popup = Reminders.$popup,
			reminder = Config.reminders[id];

		for(var d in reminder)
			$('#rp-' + d).text(reminder[d]);

		$popup.data('id', id)
			.show()
			.position({of: '#appcenter'});
	},

	refresh: function(){
		Reminders.parseData();
		Reminders.remind();
	},

	remind: function(){

		var now = (new Date).getTime(),
			reminders = Reminders.getSoonReminders();

		for(var r in reminders){
			var reminder = reminders[r],
				msDuration = reminder.custom_pre ? reminder.custom_pre - now : reminder.date.getTime() - reminder.pre - now,
				id = reminder.id;

			Reminders.installTimer(id, msDuration, function(){
				Reminders.popReminder(id);
			})
		}
	},

	timers: {}
}