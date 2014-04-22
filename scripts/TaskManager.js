'use strict';

var TM = {

	groups: {},

	tableTimes: [],

	addMultiObj: function(obj, keys, value){

		if(! keys.length)
			return $.extend(obj, value);

		var firstKey = keys.splice(0, 1)[0];

		if(keys.length || typeof obj[firstKey] == 'object'){
			if(! obj[firstKey])
				obj[firstKey]  = {};

			obj[firstKey] = TM.addMultiObj(obj[firstKey], keys, value);
		}
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

	createGroup: function(options){

		var self = this;

		this.tab = $('#group-' + options.name);

		this.form = this.tab.find('.group-edit');

		this.tbody = this.tab.find('.group-list tbody');

		this.trTemp = this.tab.find('.group-temp tr');

		this.add = function(){

			self.form[0].reset();

			self.showForm(80, {action: 'add', id: null});
		}

		this.applyChanges = function(data){

			if(data)
				Config[options.name] = data[0];

			options.onUpdate && options.onUpdate();

			self.list();
		}

		this.attachEvents = function(){

			self.tab.find('.group-add').click(self.add);

			self.tbody
				.on('click', '.fa-pencil', self.edit)
				.on('click', '.fa-times', self.remove)
				.on('click', '.reminder-mark', Reminders.changeStatus);

			self.form.submit(self.submitForm);
		}

		this.edit = function(){

			var data = self.getTrType.call(this);

			TM.fillEditForm(self.form, data.type);

			self.showForm(9, {action: 'edit', id: data.id});
		}

		this.getTrType = function(){

			var tr = $(this).parents('tr'),
				id = tr.data('id'),
				type = Config[options.name][id];

			return {id: id, type: type};
		}

		this.init = function(){

			self.list();

			self.attachEvents();
		}

		this.list = function(){

			var tbody = self.tbody.empty();

			for(var id in Config[options.name]){

				var tr = self.trTemp.clone(),
					data = Config[options.name][id];

				tr.data('id', id);

				for(var item in data){
					var value = $.isPlainObject(data[item]) ? data[item][Object.keys(data[item])] : data[item];
					tr.children('.group-' + item).html(value);
				}

				tbody.append(tr);
			}

			var table = tbody.parents('table');

			if(id){

				if(table.data('tablesorter')){

					table.trigger('update');

					var defaultSort = options.tablesorter.sortList;

					if(defaultSort)
						table.trigger('sorton', [defaultSort]);
				}

				else{

					var obj = {},
						columnsCount = table.find('tr').first().children().length;

					obj[columnsCount - 1] = {sorter: false};

					TM.addMultiObj(options, ['tablesorter', 'headers'], obj);

					table.tablesorter(options.tablesorter);
				}
			}
		}

		this.remove = function(){

			var data = self.getTrType.call(this);

			Api.confirm(40, LOCAL[56].replace('%1', data.type.title), function(){

				TM.popup('loading', 83);

				Api.send(options.subject, 'remove' + options.name, {id: data.id}, function(res){

					TM.popup('success', 84);

					self.applyChanges(res);
				})
			})
		}

		this.showForm = function(button, data){

			var form = self.form,
				mainTab = form.parents('.ac-tab').attr('tab'),
				menuTab = $('.menu-tab[tab=' + mainTab + ']');

			menuTab.click();

			form.data(data);

			form.find('button').text(LOCAL[button]);

			form.show().position({of: '#appcenter'});
		}

		this.submitForm = function(){

			var form = self.form,
				data = form.data(),
				params = form.serializeObject();

			params.id = data.id;

			TM.submitForm.call(this, function(){

				TM.popup('loading', 85);

				Api.send(options.subject, data.action + options.name, params, function(res){

					TM.popup('success', 86);

					form.hide();

					self.applyChanges(res);
				})
			})
		}

		TM.groups[options.name] = this;
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

			var rowData = ('' + item).split('-').reverse();

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

					var trCopy = tr.clone(),
						inputs = trCopy.find('input');

					td = inputs.parent();

					insertRow(td, item[p]);

					inputs.each(function(){
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
			TM.tableTimes[0].next();

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

		soon = TM.sortObjects(soon, ['start', 'date']);

		for(var i in soon){

			var meet = soon[i],
				start = meet.start.strTime;

			var tr = $('<tr>').append(
				$('<td>').html($('<span>', {'class': 'ui-icon ui-icon-clock'})).width(16),
				$('<td>', {'class': 'tahoma'}).text(start).width('23%'),
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

	sortObjects: function(data, by){

		var isArray = $.isArray(data),
			array;

		if(isArray)
			array = data;
		else
			array = $.map(data, function(values, key){
				values.key = key;
				return values;
			});

		array.sort(function(a, b){
			var Avalue = TM.getMultiObj(a, by),
				Bvalue = TM.getMultiObj(b, by);

			return Avalue < Bvalue ? -1 : Avalue > Bvalue ? 1 : 0;
		})

		return array;
	},

	submitForm: function(callback){

		var form = $(this),
			valid = form.validate();

		if(valid == true)
			callback.apply(form);
		else if(typeof valid == 'object')
			Api.validate.error(valid);
	}
}