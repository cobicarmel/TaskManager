'use strict';

var Task =  function(TABLE_TIME){

	var Mself = this;

	this.addMeeting = function(date, id, meeting){

		if(! Mself.meetings[date])
			Mself.meetings[date] = {};

		meeting.date = date;
		meeting.id = id;

		var newMeet = new Mself.meeting().construct(meeting);

		Mself.meetings[date][id] = newMeet;
	}

	this.addDate = function(data){

		var strDate = TABLE_TIME.strDate;

		Mself.meetings[strDate] = {};

		TABLE_TIME.VBoard.reset(TABLE_TIME.date, 'meeting');

		if(! data)
			return;

		for(var day in data[0]){
			var meets = data[0][day];
			for(var meet in meets)
				Mself.addMeeting(strDate, meet, meets[meet]);
		}
	}

	this.cancelMail = function(ids){

		ids = ids.split(',');

		var sendSet = Config.default.meet_cancel_mail,
			clients = $.map(Mself.meetings[TABLE_TIME.strDate], function(data, key){
				return ids.indexOf(key) + 1 && data.client_id ? data.client_id : null;
			})

		if(sendSet == '0' || ! clients.length)
			return;

		var params = {
			msgtype: 1,
			id: clients
		}

		var send = function(){

			TM.popup('loading', 76);

			TABLE_TIME.apiRequest('sendMail', 'send', params, function(res){
				TM.popup('success', LOCAL[77].replace('%1', res[0].success));
			})
		}

		switch(sendSet){
			case 'ask':
				Api.confirm(null, 75, send);
				break;
			case '1':
				send();
		}
	}

	this.changeTime = function(meetings){

		var strDate = TABLE_TIME.strDate,
			ids = Object.keys(meetings),
			isMulti = Object.keys(meetings).length > 1,
			data = {
				data: $.extend(true, {}, meetings),
				date: strDate
			},
			stack = [],
			callback = function(){
				Mself.changeTime(meetings);
			};

		for(var m in meetings){

			var starttime = meetings[m].starttime,
				endtime = meetings[m].endtime;

			stack.push({start: starttime, end: endtime, id: m});

			data.data[m].starttime = starttime.toLocaleString();
			data.data[m].endtime = endtime.toLocaleString();
		}

		TABLE_TIME.validateTime(stack, ids, function(isFree){
	
			if(isFree != true){
				if(! isMulti)
					Mself.meetings[strDate][ids[0]].reset();

				return TABLE_TIME[isMulti ? 'typeCareGroup' : 'typeCare'](isFree, callback);
			}

			Api.validate.confirm.taskTime = null;

			TM.popup('loading', 12);

			TABLE_TIME.apiRequest('Task', 'changetime', data, function(res){
				TM.popup('success', 13);
				Mself.addDate(res);
				TABLE_TIME.applyChanges();
			})
		})
	}

	this.changeMultiTime = function(ids, range){
		var strDate = TABLE_TIME.strDate,
			all = Mself.meetings[strDate],
			arr = {};

		for(var id in ids){
			var key = ids[id],
				meet = all[key],
				param = {
					starttime: TABLE_TIME.getRangeTime(meet.starttime, range),
					endtime: TABLE_TIME.getRangeTime(meet.endtime, range)
				};

			arr[key] = param;
		}

		Mself.changeTime(arr);
	}

	this.confirmCreate = function(type, fn){

		var content,
			confirmer = /^s/.test(type) ? 'static' : 'notset',
			title = LOCAL[40];

		switch(type){
			case 'static':
				content = 78;
				break;
			case 'staticgroup':
				content = 79;
				break;
			case 'undefined':
				content = 35;
				break;
			case 'undefinedgroup':
				content = 49;
				break;
		}

		Api.confirm(title, LOCAL[content], function(){
			Api.validate.confirm.taskTime = confirmer;
			fn();
		},
		function(){
			Api.validate.confirm.taskTime = null;
		})
		
	}

	this.createMeeting = function(){

		var form = this,
			param = this.serializeObject(),
			strDate = param.strdate,
			starttime = strDate.toDate(param.starttime),
			endtime = strDate.toDate(param.endtime, param.starttime),
			id = this.data('id');

		delete(param.strdate);

		TABLE_TIME.validateTime([{start: starttime, end: endtime, id: id}], null, function(isFree){

			if(isFree != true)
				return TABLE_TIME.typeCare(isFree, function(){
					Mself.createMeeting.call(form);
				});

			param.date = TABLE_TIME.strDate;
			param.endtime = endtime.toLocaleString();
			param.starttime = starttime.toLocaleString();
			param.id = id;

			TM.popup('loading', id ? 12 : 10);
			TABLE_TIME.apiRequest('Task', id ? 'edittask' : 'createtask', param, function(res){
				TM.popup('success', id ? 13 : 11);
				form.hide()[0].reset();
				Mself.addDate(res);
				TABLE_TIME.applyChanges();
			})
		})
	}

	this.filterMeets = function(ids, title, fn){

		var strDate = TABLE_TIME.strDate,
			elem = TABLE_TIME.ELEM.find('#filter-meets'),
			tbody = elem.find('tbody').empty();

		ids = ids.map(Number);

		for(var m in Mself.meetings[strDate]){

			if(! (ids.indexOf(+m) + 1))
				continue;

			var meeting = Mself.meetings[strDate][m],
				trTemp = TABLE_TIME.templates.fmTr;

			trTemp.find('input').data('id', m);
			trTemp.children('.fm-time').text([meeting.start.strTime, meeting.end.strTime].join(' - '));
			trTemp.children('.fm-title').text(meeting.title);

			tbody.append(trTemp);
		}

		$('#fm-caption').html(title);

		elem.show().position({of: '#appcenter'});

		elem.find('button').off().on('click', function(){

			elem.hide();

			var selected = $.map(tbody.find(':checked'), function(input){
				return $(input).data('id');
			})

			fn && fn(selected);
		})
	},

	this.getDay = function(date){
		var strDate = date.toLocaleDateString();
		TABLE_TIME.apiRequest('Task', 'getday', {date: strDate}, function(res){
			Mself.addDate(res);
			TABLE_TIME.advanceReady();
		})
	},

	this.getMeeting = function(strDate, id, fn){
	
		var meet = TM.getMultiObj(Mself.meetings, [strDate, id]);

		if(meet || strDate == TABLE_TIME.strDate)
			return fn.call(meet);

		var current = new Date(TABLE_TIME.date);

		TABLE_TIME.setDay(strDate, function(){

			TABLE_TIME.setDay(current, null, true, true);

			fn.call(Mself.meetings[strDate][id]);
		}, true)
	},

	this.meeting = function(){

		var self = this;

		this.addToTable = function(){
			var startTop = TABLE_TIME.getPartTop(self.start.date),
				endTop = TABLE_TIME.getPartTop(self.end.date, self.start.date),
				height = endTop - startTop,
				elem = self.elem;

			elem.css({top: startTop, height: height})
				.click(self.edit)
				.data({meeting: {
					starttime: self.start.date,
					endtime: self.end.date,
					id: self.id
				}})

			elem.find('.ttm-time').text([self.start.strTime, self.end.strTime].join(' - '));
			elem.find('.ttm-title').text(self.title);
			elem.find('.ttm-close').click(self.remove);

			if(self.client_id > 0 && Client.getClient(self.client_id)){
				var link = Client.createLink(self.client_id);

				elem
					.find('.ttm-client')
					.text(LOCAL[5] + ' ')
					.append(link);
			}

			elem.appendTo(TABLE_TIME.ELEM.find('#tt-body-overlay'));

			if(self.start.strDate != self.end.strDate)
				return;

			self.draggable();
			self.resizable();
		}

		this.construct = function(data){

			for(var key in data)
				self[key] = data[key];

			self.setTime();

			return self;
		}

		this.changeTime = function(starttime, endtime){
			var obj = {};

			obj[self.id] = {
				starttime: starttime,
				endtime: endtime
			}

			Mself.changeTime(obj);
		}

		this.draggable = function(){

			var options = {
				cursorAt: 'top',
				snap: '.tt-content-part',
				timeRange: TABLE_TIME.getTimeByPosition
			}

			self.elem.draggable($.extend(options, self.interaction));

		}

		this.edit = function(e){

			if($(this).data('interaction') || (e && $(e.target).is('.client-link, .ttm-close')))
				return;

			TM.changeTab.apply(TABLE_TIME.menuTab);

			var param = {
				button: 9,
				id: self.id,
				strdate: self.start.strDate,
				time: self.start.strTime,
				title: self.title,
				type: 7,
				content: self.content,
				place: self.place,
				client: self.client_id,
				date: self.start.date
			}

			TABLE_TIME.meetingForm(param);
		}

		this.elem = $('#templates .tt-meeting').clone();

		this.interaction = {
			delay: 250,
			start: function(){
				$(this).data('interaction', true);
			},
			stop: function(event){
	
				setTimeout(function(){
					$(event.target).removeData('interaction');
				}, 10)

				var data = $(this).data(),
					options = data[event.type == 'dragstop' ? 'ui-draggable' : 'ui-resizable'].options,
					timeRange = options.timeRange.apply(this),
					starttime = timeRange.starttime,
					endtime = timeRange.endtime,
					message = $('<div>').append(
						$('<div>').text(LOCAL[16]),
						$('<div>').text(LOCAL[31] + ': ' + starttime.toRealTime()),
						$('<div>').text(LOCAL[32] + ': ' + endtime.toRealTime())
					);

				if(data['meeting']['starttime'].toRealTime() == starttime.toRealTime() && data['meeting']['endtime'].toRealTime() == endtime.toRealTime())
					return;

				Api.confirm(40, message, function(){
					self.changeTime(starttime, endtime);
				}, self.reset)
			}
		}

		this.markReservedTime = function(){
			TABLE_TIME.VBoard.setRangeData(self.start.date, self.end.date, {meeting: {id: self.id}});
		}

		this.remove = function(){
			Mself.removeTask(self.id);
		}

		this.reset = function(){
			var data = self.elem.data(),
				topChanged = TM.getMultiObj(data, ['ui-draggable', 'originalPosition']) || TM.getMultiObj(data, ['ui-resizable', 'originalPosition']),
				heightChanged = TM.getMultiObj(data, ['ui-resizable', 'originalSize']);

			if(topChanged)
				self.elem.css('top', topChanged.top);

			if(heightChanged)
				self.elem.height(heightChanged.height);

		}

		this.resizable = function(){

			var options = {
				grid: TABLE_TIME.pHeight,
				handles: 'n, s',
				timeRange: TABLE_TIME.getTimeBySize
			}

			self.elem.resizable($.extend(options, self.interaction));
		}

		this.setTime = function(){

			self.starttime = self.starttime.replace(/-/g, '/');
			self.endtime = self.endtime.replace(/-/g, '/');

			var startDate = new Date(self.starttime),
				endDate = new Date(self.endtime);

			self.start = {
				date: startDate,
				strDate: startDate.toLocaleDateString(),
				strTime: startDate.toRealTime()
			}

			self.end = {
				date: endDate,
				strDate: endDate.toLocaleDateString(),
				strTime: endDate.toRealTime()
			}

			self.duration = (self.end.date - self.start.date) / 60000;

			self.markReservedTime();
		}

		return this;
	}

	this.meetings = {};

	this.removeTask = function(ids){

		var multi = $.isArray(ids),
			strDate = TABLE_TIME.strDate;

		if(multi)
			ids = ids.join(',');

		Api.confirm(40, multi ? 42 : 41, function(){

			TM.popup('loading', 37);

			TABLE_TIME.apiRequest('Task', 'removetask', {id: ids, date: strDate}, function(res){
				TM.popup('success', multi ? 39 : 38);
				Mself.cancelMail(ids);
				Mself.addDate(res);
				TABLE_TIME.applyChanges();
			})
		})
	}
}