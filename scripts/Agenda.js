'use strict';

var Agenda = function(TABLE_TIME){

	var self = this;

	this.days = {};

	this.special = {};

	this.addAgenda = function(type, day, id){

		var params = $(this).serializeObject(),
			current = self.getDay(day);

		for(var range in current){

			var part = self.parseData(current[range]);

			part.starttime = part.starttime.toRealTime();
			part.endtime = part.endtime.toRealTime();

			if(
				(! id || id && part.id != id) && (
				part.starttime >= params.starttime && part.starttime < params.endtime ||
				part.endtime > params.starttime && part.endtime < params.endtime
				)
			)
			return TM.dialog.show({title: LOCAL[81], content: LOCAL[15] + '.'});
		}

		if(id)
			params.id = id;
		else
			params.day = day;

		TM.popup('loading', type == 'add' ? 60 : 12);

		TABLE_TIME.apiRequest('Agenda', type == 'add' ? 'addagenda' : 'updateagenda', params, function(res){
			TM.popup('success', type == 'add' ? 61 : 13);
			$('#agenda-edit').hide();
			self.rewrite(res);
		})
	}

	this.addBarPart = function(data){

		var topStart = TABLE_TIME.getPartTop(data.starttime),
			topEnd = TABLE_TIME.getPartTop(data.endtime),
			height = topEnd - topStart;

		var part = $('<div>', {'class': 'ab-part', title: data.title});

		part.css({
			top: topStart,
			height: height
		})

		part.data({
			meeting: {
				starttime: data.starttime,
				endtime: data.endtime,
				id: data.id,
				special: !! data.special
			}
		})

		part.resizable({
			grid: TABLE_TIME.pHeight,
			handles: 'n, s',
			stop: function(){
				self.addSpecial.call(this, 'Size');
			}
		})

		part.draggable({
			containment: TABLE_TIME.ELEM.find('#tt-hours'),
			stop: function(){
				self.addSpecial.call(this, 'Position');
			}
		})

		part.css('position', 'absolute');

		if(data.isStatic)
			part.addClass('agenda-static');

		TABLE_TIME.ELEM.find('#agenda-bar').append(part);
	}

	this.addSpecial = function(type){

		var params = TABLE_TIME['getTimeBy' + type].apply(this),
			elem = $(this),
			data = elem.data('meeting'),
			title = elem.attr('title'),
			prevData = elem.prev().data(),
			nextData = elem.next().data(),
			isFree = true;

		if(prevData){
			var prevend = TM.getMultiObj(prevData, ['meeting', 'endtime']);
			if(params.starttime < prevend)
				isFree = false;
		}

		if(nextData){
			var nextstart = TM.getMultiObj(nextData, ['meeting', 'starttime']);
			if(params.endtime > nextstart)
				isFree = false;
		}

		if(! isFree){
			self.resetPos.call(elem, type);
			return TM.popup('error', 15);
		}

		var copy = $.extend({}, params);

		params.date = TABLE_TIME.strDate;
		params.original = data.id;
		params.starttime = params.starttime.toRealTime();
		params.endtime = params.endtime.toRealTime();

		if(params.starttime == data.starttime.toRealTime() && params.endtime == data.endtime.toRealTime())
			return;

		var message = $('<div>').append(
			$('<div>').text(LOCAL[62].replace('%1', title)),
			$('<div>').text(LOCAL[31] + ': ' + params.starttime),
			$('<div>').text(LOCAL[32] + ': ' + params.endtime)
		)

		Api.confirm(40, message, function(){

			TM.popup('loading', 12);

			TABLE_TIME.apiRequest('Agenda', data.special ? 'updatespecial' : 'addspecial', params, function(res){

				self.special[params.date] = res[0][params.date];
				self.writeData();
				self.applyChanges();

				var misses = self.checkMissMeet(data, copy);

				if(! misses.length)
					return TM.popup('success', 13);

				TM.popup();

				TABLE_TIME.Task.filterMeets(misses, LOCAL[74], function(ids){
					if(ids.length)
						TABLE_TIME.Task.removeTask(ids);
				})

				TABLE_TIME.ELEM.find('#fm-multi-check').multiCheck(true);
			})
		}, function(){
			self.resetPos.call(elem, type);
		})
	}

	this.agendaForm = function(type, day, id){

		var elem = $('#agenda-edit'),
			form = elem.children('form');

		elem.children('#ae-day').text(LOCAL[89].replace('%1', Date.prototype.heDays[day]))

		if(type == 'add')
			form.find('select').selectOption('reset');

		form.find('button').text(LOCAL[type == 'update' ? 9 : 80]);

		elem.show().appendTo(self.setTab).position({of: '#appcenter'});

		form.off('submit').on('submit', function(e){
			TM.submitForm.call(this, e, function(){
				self.addAgenda.call(form, type, day, id);
			})
		})
	}

	this.applyChanges = function(){

		var agenda = self.getDay();

		TABLE_TIME.ELEM.find('#agenda-bar').empty();

		for(var a in agenda)
			self.addBarPart(self.parseData(agenda[a]));

		TM.listAgenda();
	}

	this.boardRegister = function(data){

		var blockStart = new Date(data.starttime),
			blockEnd = new Date(data.endtime);

		blockStart.setMinutes(blockStart.getMinutes() + - data.blockbefore);
		blockEnd.setMinutes(blockEnd.getMinutes() + + data.blockafter);

		TABLE_TIME.VBoard.setRangeData(data.starttime, data.endtime, {agenda: {tasktype: data.tasktype, index: data.index, isStatic: data.isStatic}});
		TABLE_TIME.VBoard.setRangeData(blockStart, data.starttime, {agenda: {blockbefore: data.tasktype}});
		TABLE_TIME.VBoard.setRangeData(data.endtime, blockEnd, {agenda: {blockafter: data.tasktype}});
	}

	this.checkMissMeet = function(before, after){

		var beforeRange = TABLE_TIME.VBoard.getRangeTime(before.starttime, before.endtime),
			afterRange = TABLE_TIME.VBoard.getRangeTime(after.starttime, after.endtime);

		var misses = [];

		for(var timePart in beforeRange){

			if(afterRange[timePart] || ! beforeRange[timePart].meeting)
				continue;

			var id = beforeRange[timePart].meeting.id

			if(! (misses.indexOf(id) + 1))
				misses.push(id);
		}

		return misses;
	}

	this.edit = function(e){

		var data = $(this).data('agenda');

		if($(e.target).is('.ui-icon-close'))
			return self.remove.call(this, data);

		$('#ae-starttime').selectOption('text', data.starttime);
		$('#ae-endtime').selectOption('text', data.endtime);
		$('#ae-taskgroup').selectOption('val', data.tasktype);
		$('#ae-static').selectOption('val', data.static);

		self.agendaForm('update', data.day, data.id);
	}

	this.getAll = function(){

		TABLE_TIME.apiRequest('Agenda', 'getall', function(res){
			self.days = res[0];
			TABLE_TIME.setDay();
			self.writeSettings();
		})
	}

	this.getDay = function(nospecial){

		var date = TABLE_TIME.date,
			strDate = date.toLocaleDateString(),
			day = nospecial != undefined ? nospecial : date.getDay(),
			days = self.days,
			specials = self.special[strDate],
			agenda = [];

		for(var d in days)
			if(days[d].day == day){
				agenda.push(days[d]);

				if(! specials || nospecial)
					continue;

				var id = days[d].id,
					special = specials[id];

				if(special){
					special.special = true;
					$.extend(days[d], special);
				}
			}

		TM.sortObjects(agenda, ['starttime']);

		return agenda;
	}

	this.getSpecial = function(callback){
		var strDate = TABLE_TIME.strDate;

		TABLE_TIME.apiRequest('Agenda', 'getspecial', {date: strDate}, function(res){
			self.special[strDate] = res[0][strDate];
			callback();
		})
	}

	this.parseData = function(agendaPart){

		var date = TABLE_TIME.date,
			starttime = new Date(date).setTextTime(agendaPart.starttime),
			endtime = new Date(date).setTextTime(agendaPart.endtime),
			title = Config.tasktypes[agendaPart.tasktype].title;

		if(endtime < starttime)
			endtime.setDate(endtime.getDate() + 1);

		var data = {
			isStatic: !! +agendaPart.static,
			starttime: starttime,
			endtime: endtime,
			title: title
		}

		return $.extend({}, agendaPart, data);
	}

	this.refresh = function(){
		self.getSpecial(function(){
			self.writeData();
			TABLE_TIME.advanceReady();
		})
	}

	this.remove = function(data){

		Api.confirm(40, LOCAL[82].replace('%1', data.title), function(){

			TM.popup('loading', 83);

			TABLE_TIME.apiRequest('Agenda', 'remove', {id: data.id}, function(res){
				TM.popup('success', 84);
				self.rewrite(res);
			})
		})
	}

	this.rewrite = function(data){
		self.days = data[0];
		self.writeData();
		self.writeSettings();
		self.applyChanges();
	}

	this.resetPos = function(type){

		var isDrag = type == 'Position',
			data = this.data('ui-' + (isDrag ? 'draggable' : 'resizable')),
			css = {top: data.originalPosition.top};

		if(! isDrag)
			css.height = data.originalSize.height;

		this.css(css);
	}

	this.writeData = function(){

		var agenda = self.getDay();

		TABLE_TIME.VBoard.reset(TABLE_TIME.date, 'agenda');

		for(var a in agenda){

			var data = self.parseData(agenda[a]);

			data.index = a;

			self.boardRegister(data);
		}
	}

	this.writeSettings = function(){

		var list = self.setTab.find('.ss-hours').empty();

		for(var day = 0; day < 7; day++){

			var data = self.getDay(day);

			for(var d in data){
				var info = self.parseData(data[d]),
					part = $('#templates .ss-part').clone();

				info.starttime = info.starttime.toRealTime();
				info.endtime = info.endtime.toRealTime();

				part.children('.sp-title').text(info.title);
				part.children('.sp-time').text([info.endtime, info.starttime].join(' - '));

				part.click(self.edit).data('agenda', info);

				list.eq(day).append(part);
			}
		}
	}
}