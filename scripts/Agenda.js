var Agenda = {

	addBarPart: function(data){

		var topStart = tableTime.getPartTop(data.starttime),
			topEnd = tableTime.getPartTop(data.endtime),
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
			grid: tableTime.pHeight,
			handles: 'n, s',
			stop: function(){
				Agenda.addSpecial.call(this, 'Size');
			}
		})

		part.draggable({
			containment: '#tt-hours',
			stop: function(){
				Agenda.addSpecial.call(this, 'Position');
			}
		})

		part.css('position', 'absolute');

		$('#agenda-bar').append(part);
	},

	addListPart: function(data){

		var tr = $('<tr>').append(
			$('<td>', {'class': 'td-range tahoma'}).width('37%').text(data.starttime.toRealTime() + ' - ' + data.endtime.toRealTime()),
			$('<td>').width('9%').html($('<span>', {'class': 'ui-icon ui-icon-arrowthick-1-w'})),
			$('<td>', {'class': 'td-title'}).width('54%').text(data.title)
		)

		tr.click(function(){
			tableTime.scrollToTime(data.starttime);
		})

		$('#today-agenda').append(tr);
	},

	addSpecial: function(type){

		var params = tableTime['getTimeBy' + type].apply(this),
			elem = $(this),
			data = elem.data('meeting'),
			title = elem.attr('title'),
			prevData = elem.prev().data(),
			nextData = elem.next().data(),
			isFree = true;

		if(params.starttime == data.starttime && params.endtime == data.endtime)
			return;

		if(prevData){
			var prevend = getMultiObj(prevData, ['meeting', 'endtime']);
			if(params.starttime < prevend)
				isFree = false;
		}

		if(nextData){
			var nextstart = getMultiObj(nextData, ['meeting', 'starttime']);
			if(params.endtime > nextstart)
				isFree = false;
		}

		if(! isFree){
			Agenda.resetPos.call(elem, type);
			return popup('error', 15);
		}

		params.date = tableTime.date.toLocaleDateString();
		params.original = data.id;
		params.starttime = params.starttime.toRealTime();
		params.endtime = params.endtime.toRealTime();

		var message = $('<div>').append(
			$('<div>').text(LOCAL[62].replace('%1', title)),
			$('<div>').text(LOCAL[31] + ': ' + params.starttime),
			$('<div>').text(LOCAL[32] + ': ' + params.endtime)
		);

		Api.confirm(40, message, function(){

			popup('loading', 12);

			Api.send('Agenda', data.special ? 'updatespecial' : 'addspecial', params, function(res){
				popup('success', 13);
				Config.agenda.special[params.date] = res[0][params.date];
				Agenda.writeData();
				Agenda.applyChanges();
			})
		}, function(){
			Agenda.resetPos.call(elem, type);
		})
	},

	applyChanges: function(){

		var agenda = Agenda.getDay();

		$('#today-agenda').empty().clear(LOCAL[30]);
		$('#agenda-bar').empty();

		if(agenda[0])
			$('#today-agenda').unClear();

		for(var a in agenda){

			var data = Agenda.parseData(agenda[a]);

			Agenda.addBarPart(data);
			Agenda.addListPart(data);
		}
	},

	boardRegister: function(data){

		var blockStart = new Date(data.starttime),
			blockEnd = new Date(data.endtime);

		blockStart.setMinutes(blockStart.getMinutes() + - data.blockbefore);
		blockEnd.setMinutes(blockEnd.getMinutes() + + data.blockafter);

		VBoard.setRangeData(data.starttime, data.endtime, {agenda: {tasktype: data.tasktype, index: data.index}});
		VBoard.setRangeData(blockStart, data.starttime, {agenda: {blockbefore: data.tasktype}});
		VBoard.setRangeData(data.endtime, blockEnd, {agenda: {blockafter: data.tasktype}});
	},

	getAll: function(callback){

		if(! Config.agenda)
			Config.agenda = {special: {}};

		Api.send('Agenda', 'getall', function(res){
			Config.agenda.days = res[0];
			callback();
		})
	},

	getDay: function(){
		var date = tableTime.date,
			strDate = date.toLocaleDateString(),
			day = date.getDay(),
			days = Config.agenda.days,
			specials = Config.agenda.special[strDate],
			agenda = [];

		for(var d in days)
			if(days[d].day == day){
				agenda.push(days[d]);

				if(! specials)
					continue;

				var id = days[d].id,
					special = specials[id];

				if(special){
					special.special = true;
					$.extend(days[d], special);
				}
			}

		return agenda;
	},

	getSpecial: function(callback){
		var strDate = tableTime.date.toLocaleDateString();

		Api.send('Agenda', 'getspecial', {date: strDate}, function(res){
			Config.agenda.special[strDate] = res[0][strDate];
			callback();
		})
	},

	parseData: function(agendaPart){

		var date = tableTime.date,
			starttime = new Date(date).setTextTime(agendaPart.starttime),
			endtime = new Date(date).setTextTime(agendaPart.endtime),
			title = Config.tasktypes[agendaPart.tasktype].title;

		if(endtime < starttime)
			endtime.setDate(endtime.getDate() + 1);

		var data = {
			starttime: starttime,
			endtime: endtime,
			title: title
		}

		return $.extend({}, agendaPart, data);
	},

	refresh: function(){
		Agenda.getSpecial(function(){
			Agenda.writeData();
		})
	},

	resetPos: function(type){

		var isDrag = type == 'Position',
			data = this.data('ui-' + (isDrag ? 'draggable' : 'resizable')),
			css = {top: data.originalPosition.top};

		if(! isDrag)
			css.height = data.originalSize.height;

		this.css(css);
	},

	writeData: function(){

		var agenda = Agenda.getDay();

		VBoard.reset(tableTime.date, 'agenda');

		for(var a in agenda){

			var data = Agenda.parseData(agenda[a]);

			data.index = a;

			Agenda.boardRegister(data);
		}

		tableTime.advanceReady();
	}
}