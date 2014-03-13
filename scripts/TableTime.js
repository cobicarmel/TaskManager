'use strict';

var tableTime = {

	onReady: null,

	readyState: 0,

	readyTotal: 2,

	advanceReady: function(){

		tableTime.readyState++;

		if(tableTime.readyState == tableTime.readyTotal){
			tableTime.onReady && tableTime.onReady();

			tableTime.readyState = 0;
		}
	},

	applyChanges: function(){

		tableTime.fillTable();
		Task.showSoonMeetings();
		tableTime.showDateTitle();
		changeTab.apply($('.menu-tab[tab=table-time]'));
		Agenda.applyChanges();

		$('.tt-content-part.now').removeClass('now');

		$('#new-meeting').hide();

		if(tableTime.isToDay())
			tableTime.scrollToNow();
	},

	createHour: function(hour){
		var tt_content = $('<div>', {'class': 'tt-content'})

		for(var i = 0; i < 12; i++)
			tt_content.append(
				$('<div>', {
					'class': 'tt-content-part',
					title: timeFormat(hour) + ':' + timeFormat(i * 5)
					}
				)
			);

		return $('<div>', {id: 'tt-hour-' + hour, 'class': 'tt-hour'}).append(
			$('<div>', {'class': 'tt-title'}).text(timeFormat(hour) + ':' + '00'),
			tt_content
		)
	},

	createTable: function(){
		tableTime.box = $('#tt-hours');
		for(var i = 0; i < 24; i++){
			var hour = tableTime.createHour(i);
			tableTime.box.append(hour);
		}
		tableTime.setPartsHeight();
	},

	fillTable: function(){
		var date = tableTime.date,
			strDate = date.toLocaleDateString(),
			meetings = Task.meetings[strDate];

		$('#tt-body-overlay .tt-meeting').remove();

		for(var m in meetings)
			meetings[m].addToTable();
	},

	getHourPart: function(date){
		var hour = date.getHours(),
			minutes = date.getMinutes(),
			hourSection = tableTime.getHourSection(hour),
			part = Math.round(Math.floor(minutes / 5));

		return hourSection.find('.tt-content-part').eq(part);
	},

	getHourSection: function(hour){
		return $('#tt-hour-' + +hour);
	},

	getMinutesByHeight: function(height){
		return Math.round(height / tableTime.pHeight) * 5;
	},

	getPartTop: function(date){

		var aday = tableTime.date.getDate(),
			bday = date.getDate();

		if(aday != bday)
			return aday < bday ? tableTime.getTotalHeight() : 0;

		var hourHeight = tableTime.sHeight,
			partHeight = tableTime.pHeight,
			hour = date.getHours(),
			Isection = tableTime.getHourSection(hour).index('.tt-hour'),
			Ipart = tableTime.getHourPart(date).index();

		return Isection * hourHeight + Ipart * partHeight;
	},

	getPartsRange: function(dateStart, dateEnd){
		var parts = $('.tt-content-part'),
			Istart = tableTime.getHourPart(dateStart).index('.tt-content-part'),
			Iend = tableTime.getHourPart(dateEnd).index('.tt-content-part'),
			stack = $([]);

		if(Iend < Istart)
			Iend = parts.last().index('.tt-content-part') + 1;

		while(Istart < Iend)
			stack.push(parts[Istart++]);

		return stack;
	},

	getRangeTime: function(date, duration){

		var ndate = new Date(date);

		ndate.setMinutes(ndate.getMinutes() + +duration);

		return ndate;
	},

	getTimeByPosition: function(){

		var elem = $(this),
			dataMeet = elem.data('meeting'),
			data = elem.data('ui-draggable'),
			orgTop = data.originalPosition.top,
			top = data.position.top,
			minRange = tableTime.getMinutesByHeight(top - orgTop);

		return {
			starttime: tableTime.getRangeTime(dataMeet.starttime, minRange),
			endtime: tableTime.getRangeTime(dataMeet.endtime, minRange)
		}
	},

	getTimeBySize: function(){

		var minRange,
			elem = $(this),
			starttime = elem.data('meeting').starttime,
			height = elem.height(),
			data = elem.data('ui-resizable'),
			orgTop = data.originalPosition.top,
			top = data.position.top;

		if(orgTop != top){
			minRange = tableTime.getMinutesByHeight(top - orgTop);
			starttime = tableTime.getRangeTime(starttime, minRange);
		}

		minRange = tableTime.getMinutesByHeight(height);

		return {
			starttime: starttime,
			endtime: tableTime.getRangeTime(starttime, minRange)
		}
	},

	getTimeType: function(date){

		var data = VBoard.getTime(date),
			type;

		if(data){
			if(data.meeting)
				type = 'reserved';
			else if(data.agenda){
				if(data.agenda.blockbefore || data.agenda.blockafter)
					type = 'blocked';
				else
					type = 'free';
			}
		}

		return {type: type, data: data};
	},

	getTotalHeight: function(){
		return $('#tt-hours').height();
	},

	isToDay: function(){
		var date = new Date(tableTime.date);
		return date.setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
	},

	meetingForm: function(params){
		var elem = $('#new-meeting'),
			inputs = elem.find('input, textarea');

		if(tableTime.date.getDate() != params.date.getDate())
			tableTime.setDay(params.date);

		elem[0].reset();

		inputs.each(function(){
			$(this).val(params[this.name] || '');
		})

		$('#nm-title')
			.text(LOCAL[params.type] + '-')
			.append($('<span>', {id: 'nm-start'}).text(params.time));

		elem.data({id: params.id, tasktype: params.tasktype});
		$('#starttime').timepicker(params.time);
		elem.find('button.ui-state-default').text(LOCAL[params.button]);
		tableTime.setEndTime();

		if(params.client)
			$('#client_id option').each(function(){
				this.selected = this.value == params.client;
			})

		elem.show().position({of: '#appcenter'});
	},

	moveMeets: function(ids){

		Api.confirm(63, tableTime.templates.mmPicker, function(){
			Task.changeMultiTime(ids, $('#mm-input').val());
		})

		$('#mm-input').attr('disabled', true).val(Config.default.move_range).spinner({
			max: 120,
			min: -120,
			step: 5
		})
	},

	newMeeting: function(){

		var strTime = this.title,
			date = new Date(tableTime.date).setTextTime(strTime);

		tableTime.typeOfTime(date, function(type){

			var data = getMultiObj(type, ['data', 'agenda']);

			tableTime.typeCare(type.type, function(){

				var param = {
					button: 8,
					date: date,
					strdate: date.toLocaleDateString(),
					time: strTime,
					type: 6
				}

				if(! $.isEmptyObject(data)){
					var typeInfo = Config.tasktypes[data.tasktype];
					param.place = typeInfo.place;
					param.tasktype = data.tasktype;
					param.title = typeInfo.title;
				}

				tableTime.meetingForm(param);

				$('#new-meeting [name=title]').focus()[0].select();

			})
		})
	},

	next: function(){
		var date = new Date(tableTime.date);
		date.setDate(tableTime.date.getDate() + 1);
		tableTime.setDay(date);
	},

	prev: function(){
		var date = new Date(tableTime.date);
		date.setDate(tableTime.date.getDate() - 1);
		tableTime.setDay(date);
	},

	scrollToNow: function(){

		var now = new Date(),
			hourPart = tableTime.getHourPart(now).addClass('now');

		tableTime.scrollToTime(now);
	},

	scrollToTime: function(date){
		$('#tt-body')[0].scrollTop = tableTime.getPartTop(date);
	},

	setDay: function(date, ready, stay){

		var goReady = $.isFunction(ready);

		if(date)
			tableTime.date = typeof date == 'string' ? date.toDate() : date;
		else
			tableTime.date = new Date();

		tableTime.strDate = tableTime.date.toLocaleDateString();

		if(stay && VBoard.hasDate(date))
			return goReady && ready();

		VBoard.addDay(tableTime.strDate);

		tableTime.onReady = function(){
			console.log('TableTime updated');
			goReady && ready();

			if(! stay)
				tableTime.applyChanges();
		}

		Task.getDay(tableTime.date);
		Agenda.refresh();
	},

	showDateTitle: function(){
		var date = tableTime.date.getFullHeDate();
		$('#tt-head-title').text(date);
	},

	setEndTime: function(){

		var strTime = $('#starttime').val(),
			date = new Date(tableTime.date).setTextTime(strTime),
			data = $('#new-meeting').data(),
			id = data.id,
			tasktype = data.tasktype,
			strDate = date.toLocaleDateString(),
			typeInfo = Config.tasktypes[tasktype],
			duration;

		try{
			duration = Task.meetings[strDate][id].duration;
		}
		catch(e){
			duration =  typeInfo ? typeInfo.duration : Config.default.meeting_duration;
		}

		var endtime = tableTime.getRangeTime(date, duration).toRealTime();

		$('#endtime').timepicker(endtime);
	},

	selectedMeets: function(){
		var selected = $('.tt-meeting.ui-selected'),
			ids = $.map(selected, function(elem){
				return $(elem).data('meeting').id;
			});

		if(! selected.length)
			return;

		Api.confirm(43, tableTime.templates.smMessage, function(){
	
			var action = $('.sm-option input:checked').attr('id');

			if(! action){
				popup('error', 44);
				return tableTime.selectedMeets();
			}

			action = action.split('-')[1];

			switch(action){
				case '1': return tableTime.moveMeets(ids);
				case '3': return Task.removeTask(ids);
			}
		})
	},

	setPartsHeight: function(){
		var hourSection = $('.tt-hour:first'),
			partsLength = hourSection.find('.tt-content-part').length;

		tableTime.sHeight = hourSection.height();
		tableTime.pHeight = tableTime.sHeight / partsLength;
		$('.tt-content-part').height(tableTime.pHeight);

	},

	templates: {
		smMessage: $('#sm-message'),
		mmPicker: $('#mm-picker'),
		fmTr: $('#fm-tr').find('tr')
	},

	typeCare: function(type, fn){

		var options;

		switch(type){
			case 'different':
				options = {title: LOCAL[28], content: LOCAL[36]};
				break;
			case 'reserved':
				options = {title: LOCAL[28], content: LOCAL[29]};
				break;
			case 'blocked':
				options = {title: LOCAL[28], content: LOCAL[33]};
				break;
			case 'free':
				return fn();
			default:
				return Api.confirm(34, 35, function(){
					addMultiObj(Api.validate.confirm, ['taskTime', 'notset'], true);
					fn();
				},
				function(){
					Api.validate.confirm.taskTime = {};
				})
		}

		return dialog.show(options);
	},

	typeCareGroup: function(type, fn){
		var options;

		switch(type){
			case 'different':
				options = {title: LOCAL[44], content: LOCAL[45] + LOCAL[46]};
				break;
			case 'reserved':
				options = {title: LOCAL[44], content: LOCAL[45] + LOCAL[47]};
				break;
			case 'blocked':
				options = {title: LOCAL[44], content: LOCAL[45] + LOCAL[48]};
				break;
			default:
				return Api.confirm(40, 49, function(){
					addMultiObj(Api.validate.confirm, ['taskTime', 'notset'], true);
					fn();
				},
				function(){
					Api.validate.confirm.taskTime = {};
				})
		}

		return dialog.show(options);
	},

	typeOfTime: function(date, callback){

		if(callback){
			var current = new Date(tableTime.date);

			tableTime.setDay(date, function(){
				callback(tableTime.getTimeType(date));
				tableTime.setDay(current, null, true);
			}, true);
		}
		else if(VBoard.hasDate(date))
			return tableTime.getTimeType(date);
		else
			console.error('The date ' + date + ' has not been set');
	},

	validateTime: function(objDate, group, callback){

		for(var o in objDate){

			var start = objDate[o].start,
				end = objDate[o].end,
				isFree = true,
				type;

			tableTime.typeOfTime(end, function(){

				var notset = getMultiObj(Api.validate.confirm, ['taskTime', 'notset']),
					tasktype;

				VBoard.each(start, end, function(){

					type = tableTime.typeOfTime(this);

					var agenda = getMultiObj(type, ['data', 'agenda', 'index']) || null;

					if(tasktype !== undefined && tasktype != agenda){
						type.type = 'different';
						return isFree = false;
					}

					tasktype = agenda;

					if(type.type != 'free'){
						var otherId = getMultiObj(type.data, ['meeting', 'id']);

						if(otherId == objDate[o].id || (group && group.indexOf(otherId) + 1) || (type.type == undefined && notset))
							return;

						return isFree = false;
					}
				})

				if(! isFree)
					return callback(type.type);

				if(isFree == true && o == objDate.length - 1)
					return callback(true);
			})
		}
	}
}