'use strict';

var tableTime = function(ELEM, INDEX){

	this.isFirstRun = true;

	this.onReady = null;

	this.readyState = 0;

	this.readyTotal = 2;

	var TABLE_TIME = this;

	/** Construction **/

	this.init = function(){

		TABLE_TIME.Agenda = new Agenda(TABLE_TIME);

		TABLE_TIME.Task = new Task(TABLE_TIME);

		TABLE_TIME.VBoard = new VBoard(TABLE_TIME);

		TABLE_TIME.ELEM = ELEM;

		TABLE_TIME.menuTab = $('.menu-tab[tab=' + ELEM.parent().attr('tab') + ']');

		TABLE_TIME.Agenda.setTab = $('.sab-system').eq(INDEX);

		TABLE_TIME.createTable();

		TABLE_TIME.Agenda.getAll(TABLE_TIME.setDay);

		TABLE_TIME.addEvents();

		return TABLE_TIME;
	}

	this.addEvents = function(){

		ELEM.find('#tt-body').selectable({
			filter: '.tt-meeting',
			delay: 100,
			stop: TABLE_TIME.selectedMeets
		})

		ELEM.find('#nm-date input').datepicker({onSelect: TABLE_TIME.setDay});

		ELEM.find('.tt-content-part').click(TABLE_TIME.newMeeting);

		ELEM.find('#tt-head-prev').click(TABLE_TIME.prev);

		ELEM.find('#tt-head-next').click(TABLE_TIME.next);

		ELEM.find('#starttime').on('change', function(){
			ELEM.find('#nm-start').text(this.value);
			TABLE_TIME.setEndTime();
		})

		ELEM.find('#new-meeting').on('submit', function(e){
			TM.submitForm.call(this, e, TABLE_TIME.Task.createMeeting);
		})

		ELEM.find('#tt-toolbar .fa-calendar-o').on('click', function(){
			$('#calendar').datepicker('option', 'onSelect', TABLE_TIME.setDay);
			$('.ac-tab').hide().css('z-index', 0);
			$('#calendar').parent().show().css('z-index', 1);
		})

		ELEM.find('#tt-toolbar li').on('click', function(){
			ELEM.find('#ttt-toggle').trigger('click');
		})

		ELEM.find('#nm-add-client').on('click', function(){
			TM.changeTab.call($('.menu-tab[tab=client]'), TABLE_TIME);
			$(clients).accordion('option', 'active', 0);
		})

		ELEM.find('#ttt-toggle').on('click', function(){
			var button = $(this);
			ELEM.find('#tt-toolbar ul').slideToggle(function(){
				button.toggleClass('fa-angle-up fa-angle-down');
			})
		})

		ELEM.find('#starttime, #endtime').timepicker();

		TABLE_TIME.Agenda.setTab.find('.ss-add div').on('click', function(){
			TABLE_TIME.Agenda.agendaForm('add', $(this).attr('day'));
		})
	}

	this.advanceReady = function(){

		TABLE_TIME.readyState++;

		if(TABLE_TIME.readyState == TABLE_TIME.readyTotal){
			TABLE_TIME.onReady && TABLE_TIME.onReady();

			TABLE_TIME.readyState = 0;
		}
	}

	this.apiRequest = function(){

		var params = arguments[2];

		if(typeof params == 'object')
			arguments[2].system = INDEX;
		else{
			arguments[3] = params;
			arguments[2] = {system: INDEX};
			arguments.length = 4;
		}

		return Api.send.apply(null, arguments);
	}

	this.applyChanges = function(){

		TABLE_TIME.fillTable();

		TABLE_TIME.showDateTitle();

		TM.changeTab.apply(TABLE_TIME.menuTab);

		TABLE_TIME.Agenda.applyChanges();

		if(! INDEX)
			TM.showSoonMeetings();

		ELEM.find('.tt-content-part.now').removeClass('now');

		if(TABLE_TIME.isToday()){

			var date = new Date;

			TABLE_TIME.getHourPart(date).addClass('now');

			if(TABLE_TIME.isFirstRun){
				TABLE_TIME.scrollToTime(date);
				TABLE_TIME.isFirstRun = false;
			}
		}
	}

	this.createHour = function(hour){
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
	}

	this.createTable = function(){

		TABLE_TIME.box = ELEM.find('#tt-hours');

		for(var i = 0; i < 24; i++){
			var hour = TABLE_TIME.createHour(i);
			TABLE_TIME.box.append(hour);
		}

		TABLE_TIME.setPartsHeight();
	}

	this.fillTable = function(){
		var date = TABLE_TIME.date,
			strDate = date.toLocaleDateString(),
			meetings = TABLE_TIME.Task.meetings[strDate];

		ELEM.find('#tt-body-overlay .tt-meeting').remove();

		for(var m in meetings)
			meetings[m].addToTable();
	}

	this.getHourPart = function(date){
		var hour = date.getHours(),
			minutes = date.getMinutes(),
			hourSection = TABLE_TIME.getHourSection(hour),
			part = Math.round(Math.floor(minutes / 5));

		return hourSection.find('.tt-content-part').eq(part);
	}

	this.getHourSection = function(hour){
		return ELEM.find('#tt-hour-' + +hour);
	}

	this.getMinutesByHeight = function(height){
		return Math.round(height / TABLE_TIME.pHeight) * 5;
	}

	this.getPartTop = function(date){

		var aday = TABLE_TIME.date.getDate(),
			bday = date.getDate();

		if(aday != bday)
			return aday < bday ? TABLE_TIME.getTotalHeight() : 0;

		var hourHeight = TABLE_TIME.sHeight,
			partHeight = TABLE_TIME.pHeight,
			Ipart = TABLE_TIME.getHourPart(date).index();

		return date.getHours() * hourHeight + Ipart * partHeight;
	}

	this.getPartsRange = function(start, end){
		var parts = ELEM.find('.tt-content-part'),
			Istart = TABLE_TIME.getHourPart(start).index('.tt-content-part'),
			Iend = TABLE_TIME.getHourPart(end).index('.tt-content-part'),
			stack = $([]);

		if(Iend < Istart)
			Iend = parts.last().index('.tt-content-part') + 1;

		while(Istart < Iend)
			stack.push(parts[Istart++]);

		return stack;
	}

	this.getRangeTime = function(date, duration){

		var ndate = new Date(date);

		ndate.setMinutes(ndate.getMinutes() + +duration);

		return ndate;
	}

	this.getTimeByPosition = function(){

		var elem = $(this),
			dataMeet = elem.data('meeting'),
			data = elem.data('ui-draggable'),
			orgTop = data.originalPosition.top,
			top = data.position.top,
			minRange = TABLE_TIME.getMinutesByHeight(top - orgTop);

		return {
			starttime: TABLE_TIME.getRangeTime(dataMeet.starttime, minRange),
			endtime: TABLE_TIME.getRangeTime(dataMeet.endtime, minRange)
		}
	}

	this.getTimeBySize = function(){

		var minRange,
			elem = $(this),
			starttime = elem.data('meeting').starttime,
			height = elem.height(),
			data = elem.data('ui-resizable'),
			orgTop = data.originalPosition.top,
			top = data.position.top;

		if(orgTop != top){
			minRange = TABLE_TIME.getMinutesByHeight(top - orgTop);
			starttime = TABLE_TIME.getRangeTime(starttime, minRange);
		}

		minRange = TABLE_TIME.getMinutesByHeight(height);

		return {
			starttime: starttime,
			endtime: TABLE_TIME.getRangeTime(starttime, minRange)
		}
	}

	this.getTimeType = function(date){

		var data = TABLE_TIME.VBoard.getTime(date),
			type;

		if(data){
			if(data.meeting)
				type = 'reserved';
			else if(data.agenda){
				if(data.agenda.blockbefore || data.agenda.blockafter)
					type = 'blocked';
				else
					type = data.agenda.isStatic ? 'static' : 'free';
			}
		}

		return {type: type, data: data};
	}

	this.getTotalHeight = function(){

		var table = ELEM.find('#tt-hours'),
			height = table.height();

		if(height)
			return height;

		var clone = table.clone();

		clone.css({visibility: 'hidden', position: 'absolute', top: 0});

		clone.appendTo('body');

		var height = clone.height();

		return clone.remove(), height;
	}

	this.isToday = function(){
		var date = new Date(TABLE_TIME.date);
		return date.setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
	}

	this.meetingForm = function(params){

		var form = ELEM.find('#new-meeting');

		TABLE_TIME.setDay(params.date, null, false, true);

		form[0].reset();

		TM.fillEditForm(form, params);

		form.find('#nm-title')
			.text(LOCAL[params.type] + '-')
			.append($('<span>', {id: 'nm-start'}).text(params.starttime));

		form.data({id: params.id, tasktype: params.tasktype});

		form.find('button.ui-state-default').text(LOCAL[params.button]);

		TABLE_TIME.setEndTime();

		form.show().position({of: '#appcenter'});
	}

	this.moveMeets = function(ids){

		Api.confirm(63, TABLE_TIME.templates.mmPicker, function(){
			TABLE_TIME.Task.changeMultiTime(ids, $('#mm-input').val());
		})

		$('#mm-input').attr('disabled', true).val(Config.default.move_range).spinner({
			max: 120,
			min: -120,
			step: 5
		})
	}

	this.newMeeting = function(){

		var strTime = this.title,
			date = new Date(TABLE_TIME.date).setTextTime(strTime);

		TABLE_TIME.typeOfTime(date, function(type){

			var data = TM.getMultiObj(type, ['data', 'agenda']);

			TABLE_TIME.typeCare(type.type, function(){

				var param = {
					button: 8,
					date: date,
					strdate: date.toLocaleDateString(),
					starttime: strTime,
					type: 6
				}

				if(! $.isEmptyObject(data)){
					var typeInfo = Config.tasktypes[data.tasktype];

					param.place = typeInfo.place;
					param.tasktype = data.tasktype;
					param.title = typeInfo.title;
				}

				TABLE_TIME.meetingForm(param);

				ELEM.find('#new-meeting [name=title]').focus()[0].select();
			})
		})
	}

	this.next = function(){
		var date = new Date(TABLE_TIME.date);
		date.setDate(TABLE_TIME.date.getDate() + 1);
		TABLE_TIME.setDay(date);
	}

	this.prev = function(){
		var date = new Date(TABLE_TIME.date);
		date.setDate(TABLE_TIME.date.getDate() - 1);
		TABLE_TIME.setDay(date);
	}

	this.scrollToTime = function(date){
		TABLE_TIME.menuTab.click();
		ELEM.find('#tt-body')[0].scrollTop = TABLE_TIME.getPartTop(date);
	}

	this.setDay = function(date, ready, dontMove, dontUpdate){

		var goReady = $.isFunction(ready);

		if(date)
			TABLE_TIME.date = typeof date == 'string' ? date.toDate() : date;
		else
			TABLE_TIME.date = new Date();

		TABLE_TIME.strDate = TABLE_TIME.date.toLocaleDateString();

		if((dontUpdate) && TABLE_TIME.VBoard.hasDate(TABLE_TIME.date)){
			if(! dontMove)
				TABLE_TIME.applyChanges();
			return goReady && ready();
		}

		TABLE_TIME.VBoard.addDay(TABLE_TIME.strDate);

		TABLE_TIME.onReady = function(){

			if(TM.getMultiObj(window, 'console'))
				console.log('TableTime updated');

			goReady && ready();

			if(! dontMove)
				TABLE_TIME.applyChanges();
		}

		TABLE_TIME.Task.getDay(TABLE_TIME.date);
		TABLE_TIME.Agenda.refresh();
	}

	this.showDateTitle = function(){
		var date = TABLE_TIME.date.getFullHeDate();
		ELEM.find('#tt-head-title').text(date);
	}

	this.setEndTime = function(){

		var strTime = ELEM.find('#starttime').val(),
			date = new Date(TABLE_TIME.date).setTextTime(strTime),
			data = ELEM.find('#new-meeting').data(),
			id = data.id,
			tasktype = data.tasktype,
			strDate = date.toLocaleDateString(),
			typeInfo = Config.tasktypes[tasktype],
			duration;

		try{
			duration = TABLE_TIME.Task.meetings[strDate][id].duration;
		}
		catch(e){
			duration =  typeInfo ? typeInfo.duration : Config.default.meeting_duration;
		}

		var endtime = TABLE_TIME.getRangeTime(date, duration).toRealTime();

		ELEM.find('#endtime').selectOption('text', endtime);
	}

	this.selectedMeets = function(){
		var selected = ELEM.find('.tt-meeting.ui-selected'),
			ids = $.map(selected, function(elem){
				return $(elem).data('meeting').id;
			});

		if(! selected.length)
			return;

		Api.confirm(43, TABLE_TIME.templates.smMessage, function(){
	
			var action = $('.sm-option input:checked').attr('id');

			if(! action){
				TM.popup('error', 44);
				return TABLE_TIME.selectedMeets();
			}

			action = action.split('-')[1];

			switch(action){
				case '1': return TABLE_TIME.moveMeets(ids);
				case '3': return TABLE_TIME.Task.removeTask(ids);
			}
		})
	}

	this.setPartsHeight = function(){
		var hourSection = ELEM.find('.tt-hour:first'),
			partsLength = hourSection.find('.tt-content-part').length;

		TABLE_TIME.sHeight = hourSection.height();
		TABLE_TIME.pHeight = TABLE_TIME.sHeight / partsLength;
		ELEM.find('.tt-content-part').height(TABLE_TIME.pHeight);

	}

	this.templates = {
		smMessage: $('#sm-message'),
		mmPicker: $('#mm-picker'),
		fmTr: $('#fm-tr tr')
	}

	this.typeCare = function(type, fn){

		var options = {
			title: LOCAL[28]
		}

		switch1:

		switch(type){
			case 'different':
				options.content = LOCAL[36];
				break;
			case 'reserved':
				options.content = LOCAL[29];
				break;
			case 'blocked':
				options.content = LOCAL[33];
				break;
			case 'free':
				return fn();
			default:
				if(! type)
					switch(Config.default.undefined_time){
						case 0:
							options.content = LOCAL[90];
							break switch1;
						case 1:
							return fn();
					}
				return TABLE_TIME.Task.confirmCreate(type ? 'static' : 'undefined', fn);
		}

		return TM.dialog.show(options);
	}

	this.typeCareGroup = function(type, fn){

		var options = {
			title: LOCAL[44],
			content: LOCAL[45]
		}

		switch1:

		switch(type){
			case 'different':
				options.content += LOCAL[46];
				break;
			case 'reserved':
				options.content += LOCAL[47];
				break;
			case 'blocked':
				options.content += LOCAL[48];
				break;
			default:
				if(! type)
					switch(Config.default.undefined_time){
						case 0:
							options.content += LOCAL[90];
							break switch1;
						case 1:
							return fn();
					}
				return TABLE_TIME.Task.confirmCreate(type ? 'staticgroup' : 'undefinedgroup', fn);
		}

		return TM.dialog.show(options);
	}

	this.typeOfTime = function(date, callback){

		if(callback){
			var current = new Date(TABLE_TIME.date);

			TABLE_TIME.setDay(date, function(){
				callback(TABLE_TIME.getTimeType(date));
				TABLE_TIME.setDay(current, null, true, true);
			}, true, true);
		}
		else if(TABLE_TIME.VBoard.hasDate(date))
			return TABLE_TIME.getTimeType(date);
		else
			console.error('The date ' + date + ' has not been set');
	}

	this.validateTime = function(objDate, group, callback){

		for(var o in objDate){

			var start = objDate[o].start,
				end = objDate[o].end,
				isFree = true,
				type;

			TABLE_TIME.typeOfTime(end, function(){

				var confirmed = Api.validate.confirm.taskTime,
					tasktype;

				TABLE_TIME.VBoard.each(start, end, function(){

					type = TABLE_TIME.typeOfTime(this);

					var agenda = TM.getMultiObj(type, ['data', 'agenda', 'index']) || null;

					if(tasktype !== undefined && tasktype != agenda){
						type.type = 'different';
						return isFree = false;
					}

					tasktype = agenda;

					if(type.type != 'free'){
						var otherId = TM.getMultiObj(type.data, ['meeting', 'id']);

						if(
							otherId === objDate[o].id ||
							(group && group.indexOf(otherId) + 1) ||
							(type.type == undefined && confirmed == 'notset') ||
							(type.type == 'static' && confirmed == 'static')
						)
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