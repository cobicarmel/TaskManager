'use strict';

var Client = {

	apiActions: function(action){

		var methods = {
			'new-client': Client.newClient,
			'search-client': Client.search,
			'edit-client': Client.saveEdit,
			'cai-form': Client.saveItem,
			'new-payment': Client.newPayment,
			'edit-payment': Client.editPayment,
			'cdp-reports': Client.expReport
		}

		return methods[action];
	},

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

		TM.popup('loading', data.loading);

		Api.send('Client', data.action, params, function(res){
			TM.popup('success', data.success);
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

		if(Access.hasAction('Payment'))
			Client.addPayment();
	},

	edit: function(client){

		$('#edit-client').replaceWith(Client.copyForm.clone(true));

		TM.fillEditForm($('#edit-client'), client);
	},

	editPayment: function(){
		Client.payments[Client.id].saveEdit.apply(this);
	},

	expReport: function(){
		Client.payments[Client.id].reports.apply(this);
	},

	fillTableTime: function(){

		var select = $('.clients-list, #rf-client'),
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

	getClient: function(id){
		return Client.all[id];
	},

	getClientTr: function(id){
		return $('#cb-' + id);
	},

	goTo: function(){
		TM.changeTab.apply($('[tab=client]'));
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
					)

					tr.on('click', function(meet, values){
						return function(){
							TM.popup('loading', 34);
							TM.tableTime.items[values.system].Task.getMeeting(values.date, meet, function(){
								TM.popup();
								this.edit();
							})
						}
					}(meet, values))

					tbody.prepend(tr);
				}

				if(tbody.children().length)
					table.unClear();

			})

		},

		values: {}
	},

	init: function(){

		var options = {
			active: 3,
			beforeActivate: function(){
				if(arguments[1].newHeader.index('h4') != 2)	
					$('.search-results').hide();
			}
		}

		$(clients).accordion($.extend(Config.accordion, options))

		$('.search-results').hide();

		if($('#cd-list').find('tbody tr').length)
			$('#cd-list').tableScroll(392).tablesorter({sortList: [[0,0]]});

		$('.ts-head th').on('click', function(){
			var index = $(this).index('.ts-head th');
			$('#cd-list th').eq(index).click();
		})
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

		TM.popup('loading', 21);

		Api.send('Client', 'newclient', param, function(res){
			TM.popup('success', 22);
			form[0].reset();
			Client.addClient(res[0]);

			var id = Object.keys(res[0]);

			Client.details.apply(Client.getClientTr(id)[0]);

			var data = form.data('new-meet');

			if(data instanceof tableTime){
				data.ELEM.find('.clients-list').selectOption('val', id);
				return TM.changeTab.apply(data.menuTab);
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

			TM.popup('loading', 57);

			Api.send('Client', 'remove', {id: id}, function(){

				TM.popup('success', 58);

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

		TM.popup('loading', 51);

		Api.send('Client', 'search', param, function(res){
			TM.popup();
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