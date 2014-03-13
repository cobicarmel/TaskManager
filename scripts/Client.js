'use strict';

var Client = {

	addClient: function(data){
		var key = Object.keys(data);
		Client.all[key] = data[key];
		Client.refresh();
	},

	addPayment: function(){
		var pay = new Payment(Client.id);
		pay.getPayments();
		Client.payments[Client.id] = pay;
	},

	applyChanges: function(data){

		var form = $(data.form),
			params = form.serializeObject();

		params.id = Client.id;

		popup('loading', data.loading);

		Api.send('Client', data.action, params, function(res){
			popup('success', data.success);
			Client.addClient(res[0]);
			Client.getClientTr(Client.id).click();
		})
	},

	addItem: function(){

		var type = this.id.split('cdc-add')[1],
			orgTemp = $('#nc-' + type),
			inputs = orgTemp.children().clone().val(''),
			title = orgTemp.prev().text();

		$('#cai-title').text(LOCAL[59].replace('%1', title));
		$('#cai-inputs').html(inputs);

		$('#c-add-item').show().appendTo('#cd-card').position({
			of: this,
			at: 'top',
			my: 'top'
		})
	},

	browsePayment: function(){

		var dir = this.id.split('cn-')[1],
			pay = Client.payments[Client.id];

		pay[dir]();

		(dir == 'next' ? pay.getPayments : pay.addToTable)();
	},

	changeTab: function(){
		var tab = $(this).attr('tab');

		$(this).addClass('active').siblings().removeClass('active');

		$('#' + tab).show().siblings().hide();
	},

	createLink: function(id){
		return $('<span>', {'class': 'client-link'})
			.text(Client.getFullName(id))
			.data('id', id)
			.click(Client.goTo);
	},

	details: function(e){

		if($('#cd-detailed .clear').data('cleared'))
			$('#cd-detailed .clear').unClear();

		var tr = $(this),
			id = $(this).attr('id').split('-')[1],
			client = Client.getClient(id);

		Client.id = id;

		if(! e)
			$('.ts-body').scrollTop(tr.height() * tr.index());

		$(this).addClass('active').siblings().removeClass('active');

		$('#cdd-title').text(Client.getFullName(id));

		$('#cd-card').find('td').empty();

		$('#c-add-item').hide();

		for(var d in client){
			var item = client[d],
				area = $('#cdc-' + d);

			if(typeof item == 'object'){
				var multi = $('<div>', {'class': 'multi-fix'});
				area.html(multi);
				for(var data in item)
					multi.append($('<div>').text(item[data]).attr('title', item[data]));
			}
			else
				area.text(item).attr('title', item);
		}

		$('[tab=cd-card]').click();

		Client.edit(client);

		Client.history.show();
		
		Client.addPayment();
	},

	edit: function(client){

		$('#edit-client').replaceWith(Client.copyForm.clone(true));

		var form = $('#edit-client');

		for(var d in client){
			var item = client[d],
				input = form.find('[name=' + d + ']');

			if(! input.length || $.isArray(item))
				continue;

			if(typeof item == 'object'){

				var tr = input.parents('tr'),
					firstTd = tr.children().first(),
					title = firstTd.text(),
					stack = [];

				firstTd.empty();

				for(var data in item){
					var trCopy = tr.clone(),
						tdData = trCopy.children().last(),
						rowData = item[data].split('-').reverse();

					for(var text in rowData){
						input = tdData.children().eq(text);
						input.attr('name', input.attr('name') + '[' + data + ']').val(rowData[text]);
					}

					stack.push(trCopy);
				}

				tr.after(stack).next().children().first().text(title);
				tr.remove();
			}
			else
				input.val(item);
		}
	},

	editPayment: function(){
		Client.payments[Client.id].saveEdit.apply(this);
	},

	expReport: function(){
		Client.payments[Client.id].reports.apply(this);
	},

	fillTableTime: function(){
		var select = $('#client_id'),
			options = [];

		for(var id in Client.all)
			options.push($('<option>', {value: id}).text(Client.getFullName(id)));

		select.html($('<option>')).append(options);
	},

	getFullName: function(id){
		var client = Client.getClient(id);
		return $.trim([client.first_name, client.last_name].join(' '));
	},

	getAll: function(){
		Api.send('Client', 'getall', function(res){
			Client.all = res[0];
			Client.refresh();
		})
	},

	getClient: function(id, fn){
		return Client.all[id];
	},

	getClientTr: function(id){
		return $('#cb-' + id);
	},

	goTo: function(){
		changeTab.apply($('[tab=client]'));
		Client.details.apply(Client.getClientTr($(this).data('id')));
		$(clients).accordion('option', 'active', 3);
	},

	history:{

		add: function(data){

			if(data)
				data = data[0];

			var values = {};

			for(var date in data){

				var meets = data[date];

				for(var meet in meets){

					var obj = {
						date: date,
						start: new Date(meets[meet].starttime.replace(/-/g, '/')),
						end: new Date(meets[meet].endtime.replace(/-/g, '/'))
					}

					values[meet] = $.extend(meets[meet], obj);
				}
			}

			Client.history.values[Client.id] = values;
		},

		get: function(fn){

			if(Client.history.values[Client.id])
				return fn();

			Api.send('Task', 'clienthistory', {id: Client.id}, function(res){
				Client.history.add(res);
				res && fn();
			})

		},

		show: function(){

			var table = $('#cd-history table').clear(LOCAL[55]),
				tbody = table.children('tbody').empty();

			Client.history.get(function(){

				var data = Client.history.values[Client.id];

				for(var meet in data){

					var values = data[meet];

					var tr = $('<tr>').append(
						$('<td>').text(values.date),
						$('<td>').text(values.start.toRealTime() + ' - ' + values.end.toRealTime()),
						$('<td>').text(values.title)
					).click(Task.meetings[tableTime.strDate][meet].edit)

					tbody.prepend(tr);

				}

				if(tbody.children().length)
					table.unClear();

			})

		},

		values: {}
	},

	list: function(){

		$('#cd-detailed .clear').clear(LOCAL[25]);

		var table = $('#cd-list tbody').empty();

		for(var client in Client.all){
			var data = Client.all[client],
				tr = $('<tr>', {id: 'cb-' + client}).append(
				$('<td>').text(data.first_name),
				$('<td>').text(data.last_name)
			)

			table.append(tr);
		}

		table.trigger('update');

	},

	newClient: function(){

		var form = this,
			param = form.serializeObject();

		popup('loading', 21);

		Api.send('Client', 'newclient', param, function(res){
			popup('success', 22);
			form[0].reset();
			Client.addClient(res[0]);

			var id = Object.keys(res[0]);

			Client.details.apply(Client.getClientTr(id)[0]);

			if(form.data('new-meet')){
				$('#client_id').selectOption('val', id);
				return changeTab.apply($('[tab=table-time]'));
				$('#new-meeting').show();
			}

			$(clients).accordion('option', 'active', 3);
		})
	},

	newPayment: function(){
		Client.payments[Client.id].addPayment.apply(this);
	},

	payments: {},

	printReport: function(){
		var crPrint = $('#cr-print'),
			prtArea = crPrint.clone().appendTo('center:first');

		crPrint.hide();

		prtArea.css({
			position: 'absolute',
			width: '50%',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			margin: 'auto'
		})

		print();

		prtArea.remove();
	},

	refresh: function(){
		Client.list();
		Client.fillTableTime();
	},

	remove: function(){

		var id = Client.id,
			title = $.trim($('#cdd-title').text());

		Api.confirm(40, LOCAL[56].replace('%1', title), function(){

			popup('loading', 57);

			Api.send('Client', 'remove', {id: id}, function(){

				popup('success', 58);

				delete Client.all[id];

				Client.refresh();
			})
		})
	},

	saveEdit: function(){

		var params = {
			action: 'edit',
			form: '#edit-client',
			loading: 12,
			success: 13
		}

		Client.applyChanges(params);
	},

	saveItem: function(){

		var params = {
			action: 'additem',
			form: '#cai-form',
			loading: 60,
			success: 61
		}

		Client.applyChanges(params);
	},

	search: function(){

		var param = this.serializeObject();

		popup('loading', 51);

		Api.send('Client', 'search', param, function(res){
			popup();
			$('.search-results').show();
			$(clients).accordion('option', 'active', 2);

			var table = $('#search-result'),
				tbody = table.children('tbody').empty();

			table.clear(LOCAL[52]);

			for(var r in res[0]){
				var client = res[0][r];

				var tr = $('<tr>').data('id', r).click(Client.goTo).append(
					$('<td>').text(client.first_name),
					$('<td>').text(client.last_name)
				)

				tbody.append(tr);
			}

			if(tbody.children().length)
				table.unClear();
		})
	}
}