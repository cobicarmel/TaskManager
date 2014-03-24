'use strict';

var TM = {

	tableTimes: [],

	addMultiObj: function(obj, keys, value){

		var firstKey = keys.splice(0, 1);

		if(typeof obj[firstKey] == 'object')
			obj[firstKey] = addMultiObj(obj[firstKey], keys, value);
		else
			obj[firstKey] = value;

		return obj;
	},

	changeTab: function(){
		$('.menu-tab.active').removeClass('active');
		$(this).addClass('active');

		var tab = $(this).attr('tab');

		$('.ac-tab').hide().css('z-index', 0);
		$('.ac-tab[tab=' + tab + ']').show().css('z-index', 1);

		$('#new-client').data('new-meet', arguments[0]);

		if(tab == 'client' && ! $(clients).data('ui-accordion'))
			Client.init();
	},

	dialog: {

		close: function(){
			TM.dialog.elem.dialog('destroy');
		},

		elem: $('#ac-dialog'),

		show: function(custom){

			var defaultButton = {};

			defaultButton[LOCAL[17]] = function(){};

			var options = {
				beforeClose: function(){
					$('.ui-selected').removeClass('ui-selected');
					var cancel = $('.ui-dialog .ui-dialog-buttonset button:contains(' + LOCAL[18] + ')');
					if(cancel.length){
						cancel.click();
						return false;
					}
				},
				buttons: defaultButton,
				closeText: LOCAL[14],
				draggable: false,
				modal: true,
				position: {of: '#appcenter'},
				resizable: false
			}

			if(custom){
				options = $.extend(options, custom);
				TM.dialog.elem.children('p').html(custom.content);
			}

			TM.dialog.elem.dialog(options);
		}
	},

	fillEditForm: function(form, data){

		form[0].reset();

		var insertRow = function(td, item){

			var rowData = item.split('-').reverse();

			for(var i in rowData){

				var input = td.children(':input').eq(i);

				if(input.is('select'))
					input.selectOption('val', rowData[i]);
				else
					input.val(rowData[i]);
			}
		}

		for(var d in data){

			var item = data[d],
				input = form.find('[name=' + d + ']'),
				td =  input.parent();

			if(! input.length || $.isArray(item))
				continue;

			if(typeof item == 'object'){

				var tr = input.parents('tr'),
					firstTd = tr.children().first(),
					title = firstTd.text(),
					stack = [];

				firstTd.empty();

				for(var p in item){

					var trCopy = tr.clone();

					insertRow(td, item[p]);

					trCopy.find('input').each(function(){
						var input = $(this);
						input.attr('name', input.attr('name') + '[' + p + ']');
					})

					stack.push(trCopy);
				}

				tr.after(stack).next().children().first().text(title);
				tr.remove();
			}
			else
				insertRow(td, item);
		}
	},

	getMultiObj: function(obj, keys, wanted){

		var firstKey = keys[0],
			otherKeys = keys.slice(1),
			lastKey = keys.slice(keys.length - 1);

		if(typeof obj[firstKey] == 'object' && otherKeys.length)
			return TM.getMultiObj(obj[firstKey], otherKeys, wanted || lastKey);
		else
			return firstKey == wanted || keys.length == 1 ? obj[firstKey] : null;
	},

	listAgenda: function(){

		var board = $('#today-agenda').empty().clear(LOCAL[30]),
			agenda = TM.tableTimes[0].Agenda.getDay();

		if(agenda[0])
			board.unClear();

		for(var a in agenda){

			var data = TM.tableTimes[0].Agenda.parseData(agenda[a]);

			var tr = $('<tr>').append(
				$('<td>', {'class': 'td-range tahoma'}).width('37%').text(data.starttime.toRealTime() + ' - ' + data.endtime.toRealTime()),
				$('<td>').width('9%').html($('<span>', {'class': 'ui-icon ui-icon-arrowthick-1-w'})),
				$('<td>', {'class': 'td-title'}).width('54%').text(data.title)
			)

			tr.click(function(starttime){
				return function(){
					TM.tableTimes[0].scrollToTime(starttime);
				}
			}(data.starttime))

			board.append(tr);
		}
	},

	popup: function(type, text){

		var elem = $('#popup');

		if(! type)
			return elem.hide();

		elem.stop(true);

		text = LOCAL[text] || text;

		if(type == 'loading')
			text += '...';

		elem.removeClass().addClass(type).show().position({of: '#appcenter', at: 'center top+100'});

		$('#popup-title').text(text);

		if(type != 'loading')
			elem.delay(2000).fadeOut();
	},

	showDateTime: function(){

		var date = new Date();

		$('#dt-day').text(date.getFullHeDay());
		$('#dt-date').text(date.getFullHeMonth() + ' ' + date.getFullYear());

		var time = $('#dt-time');

		if(time.text() == '23:59:59' && ! date.getHours())
			tableTime.next();

		time.text(date.toLocaleTimeString());

	},

	showSoonMeetings: function(){

		var elem = $('#soon').empty().clear(LOCAL[19]),
			now = new Date(),
			strDate = now.toLocaleDateString(),
			tasks = TM.tableTimes[0].Task.meetings[strDate];

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
		TM.sortObjects(soon, ['start', 'date']);

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
					TM.tableTimes[0].scrollToTime(meet.start.date);
				}
			}(meet))

			elem.append(tr);
		}

		return soon;
	},

	sortObjects: function(array, by){
		array.sort(function(a, b){
			var Avalue = TM.getMultiObj(a, by),
				Bvalue = TM.getMultiObj(b, by);

			return Avalue < Bvalue ? -1 : Avalue > Bvalue ? 1 : 0;
		})
	},

	submitForm: function(event, callback){

		event.preventDefault();

		var form = $(this),
			valid = form.validate();

		if(valid == true)
			callback.apply(form);
		else if(typeof valid == 'object')
			Api.validate.error(valid);
	}
}