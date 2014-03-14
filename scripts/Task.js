'use strict';

var Task =  {

	addMeeting: function(date, id, meeting){

		if(! Task.meetings[date])
			Task.meetings[date] = {};

		meeting.date = date;
		meeting.id = id;

		var newMeet = new Task.meeting().construct(meeting);

		Task.meetings[date][id] = newMeet;
	},

	addDate: function(data){

		var strDate = tableTime.strDate;

		Task.meetings[strDate] = {};

		VBoard.reset(tableTime.date, 'meeting');

		if(! data)
			return;

		for(var day in data[0]){
			var meets = data[0][day];
			for(var meet in meets)
				Task.addMeeting(strDate, meet, meets[meet]);
		}
	},

	cancelMail: function(ids){

		ids = ids.split(',');

		var sendSet = Config.default.meet_cancel_mail,
			clients = $.map(Task.meetings[tableTime.strDate], function(data, key){
				return ids.indexOf(key) + 1 && data.client_id ? data.client_id : null;
			})

		if(sendSet == '0' || ! clients.length)
			return;

		var params = {
			msgtype: 1,
			id: clients
		}

		var send = function(){

			popup('loading', 76);

			Api.send('sendMail', 'send', params, function(res){
				popup('success', LOCAL[77].replace('%1', res[0].success));
			})
		}

		switch(sendSet){
			case 'ask':
				Api.confirm(null, 75, send);
				break;
			case '1':
				send();
		}
	},

	changeTime: function(meetings){

		var strDate = tableTime.strDate,
			ids = Object.keys(meetings),
			isMulti = Object.keys(meetings).length > 1,
			data = {
				data: $.extend(true, {}, meetings),
				date: strDate
			},
			stack = [],
			callback = function(){
				Task.changeTime(meetings);
			};

		for(var m in meetings){

			var starttime = meetings[m].starttime,
				endtime = meetings[m].endtime;

			stack.push({start: starttime, end: endtime, id: m});

			data.data[m].starttime = starttime.toLocaleString();
			data.data[m].endtime = endtime.toLocaleString();
		}

		tableTime.validateTime(stack, ids, function(isFree){
	
			if(isFree != true){
				if(! isMulti)
					Task.meetings[strDate][ids[0]].reset();

				return tableTime[isMulti ? 'typeCareGroup' : 'typeCare'](isFree, callback);
			}

			Api.validate.confirm.taskTime = null;

			popup('loading', 12);

			Api.send('Task', 'changetime', data, function(res){
				popup('success', 13);
				Task.addDate(res);
				tableTime.applyChanges();
			})
		})
	},

	changeMultiTime: function(ids, range){
		var strDate = tableTime.strDate,
			all = Task.meetings[strDate],
			arr = {};

		for(var id in ids){
			var key = ids[id],
				meet = all[key],
				param = {
					starttime: tableTime.getRangeTime(meet.starttime, range),
					endtime: tableTime.getRangeTime(meet.endtime, range)
				};

			arr[key] = param;
		}

		Task.changeTime(arr);
	},

	confirmCreate: function(type, fn){

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
		
	},

	createMeeting: function(){

		var form = this,
			param = this.serializeObject(),
			strDate = param.strdate,
			starttime = strDate.toDate(param.starttime),
			endtime = strDate.toDate(param.endtime, param.starttime),
			id = this.data('id');

		delete(param.strdate);

		tableTime.validateTime([{start: starttime, end: endtime, id: id}], null, function(isFree){

			if(isFree != true)
				return tableTime.typeCare(isFree, function(){
					Task.createMeeting.call(form);
				});

			param.date = tableTime.strDate;
			param.endtime = endtime.toLocaleString();
			param.starttime = starttime.toLocaleString();
			param.id = id;

			popup('loading', id ? 12 : 10);
			Api.send('Task', id ? 'edittask' : 'createtask', param, function(res){
				popup('success', id ? 13 : 11);
				form.hide()[0].reset();
				Task.addDate(res);
				tableTime.applyChanges();
			})
		})
	},

	filterMeets: function(ids, title, fn){

		var strDate = tableTime.strDate,
			elem = $('#filter-meets'),
			tbody = elem.find('tbody').empty();

		ids = ids.map(Number);

		for(var m in Task.meetings[strDate]){

			if(! (ids.indexOf(+m) + 1))
				continue;

			var meeting = Task.meetings[strDate][m],
				trTemp = tableTime.templates.fmTr;

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

	getDay: function(date){
		var strDate = date.toLocaleDateString();
		Api.send('Task', 'getday', {date: strDate}, function(res){
			Task.addDate(res);
			tableTime.advanceReady();
		})
	},

	meeting: function(){

		var self = this;

		this.addToTable = function(){
			var startTop = tableTime.getPartTop(self.start.date),
				endTop = tableTime.getPartTop(self.end.date, self.start.date),
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

			elem.appendTo($('#tt-body-overlay'));

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

			Task.changeTime(obj);
		}

		this.draggable = function(){

			var options = {
				cursorAt: 'top',
				snap: '.tt-content-part',
				timeRange: tableTime.getTimeByPosition
			}

			self.elem.draggable($.extend(options, self.interaction));

		}

		this.edit = function(e){

			if($(this).data('interaction') || (e && $(e.target).is('.client-link, .ttm-close')))
				return;

			changeTab.apply($('.menu-tab[tab=table-time]'));

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

			tableTime.meetingForm(param);
		}

		this.elem = $('#tt-templates .tt-meeting').clone();

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

				if(data['meeting']['starttime'] == starttime && data['meeting']['endtime'] == endtime)
					return;

				Api.confirm(40, message, function(){
					self.changeTime(starttime, endtime);
				}, self.reset)
			}
		}

		this.markReservedTime = function(){
			VBoard.setRangeData(self.start.date, self.end.date, {meeting: {id: self.id}});
		}

		this.remove = function(){
			Task.removeTask(self.id);
		}

		this.reset = function(){
			var data = self.elem.data(),
				topChanged = getMultiObj(data, ['ui-draggable', 'originalPosition']) || getMultiObj(data, ['ui-resizable', 'originalPosition']),
				heightChanged = getMultiObj(data, ['ui-resizable', 'originalSize']);

			if(topChanged)
				self.elem.css('top', topChanged.top);

			if(heightChanged)
				self.elem.height(heightChanged.height);

		}

		this.resizable = function(){

			var options = {
				grid: tableTime.pHeight,
				handles: 'n, s',
				timeRange: tableTime.getTimeBySize
			}

			self.elem.resizable($.extend(options, self.interaction));
		}

		this.setTime = function(){

			var startDate = new Date(self.starttime.replace(/-/g, '/')),
				endDate = new Date(self.endtime.replace(/-/g, '/'));

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
	},

	meetings: {},

	removeTask: function(ids){

		var multi = $.isArray(ids),
			strDate = tableTime.strDate;

		if(multi)
			ids = ids.join(',');

		Api.confirm(40, multi ? 42 : 41, function(){

			popup('loading', 37);

			Api.send('Task', 'removetask', {id: ids, date: strDate}, function(res){
				popup('success', multi ? 39 : 38);
				Task.cancelMail(ids);
				Task.addDate(res);
				tableTime.applyChanges();
			})
		})
	},

	showSoonMeetings: function(){
		var elem = $('#soon').empty().clear(LOCAL[19]),
			now = new Date(),
			strDate = now.toLocaleDateString(),
			tasks = Task.meetings[strDate];

		if(! tasks)
			return;

		var soon = $.map(tasks, function(task){
			var start = + task.start.date,
				msDuration = task.duration * 60000;

			return now.getTime() < start + msDuration ? task : null;
		})

		if(soon[0])
			elem.unClear();

		soon.splice(Config.default.soon_mount);
		sortObjects(soon, 'start');

		for(var i in soon){

			var meet = soon[i],
				start = meet.start.strTime;

			var tr = $('<tr>').append(
				$('<td>').html($('<span>', {'class': 'ui-icon ui-icon-clock'})).width(16),
				$('<td>').text(start).width('23%'),
				$('<td>').html($('<span>', {'class': 'ui-icon ui-icon-arrowthick-1-w'})).width(20),
				$('<td>', {'class': 'td-title'}).text(meet.title)
			)

			tr.click(function(meet){
				return function(){
					meet.edit();
					tableTime.scrollToTime(meet.start.date);
				}
			}(meet))

			elem.append(tr);
		}

		return soon;
	}
}