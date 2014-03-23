'use strict';

var Settings = {

	buildGroups: function(){

		var tasktypes = new Settings.createGroup('Task', 'tasktypes', function(){
			var typesList = $('#ae-taskgroup').html($('<option>'));
			for(var option in Config.tasktypes)
				typesList.append($('<option>').attr('value', option).text(Config.tasktypes[option].title));
		})

		tasktypes.init();

		var users = new Settings.createGroup('Users', 'users');

		users.init();
	},

	createGroup: function(SUBJECT, NAME, onUpdate){

		var self = this;

		this.tab = $('#set-group-' + NAME);

		this.form = this.tab.find('.sg-edit');

		this.tbody = this.tab.find('.sg-list tbody');

		this.trTemp = this.tab.find('.sg-temp tr');

		this.add = function(){

			self.form[0].reset();

			self.showForm(80, {action: 'add', id: null});
		}

		this.applyChanges = function(data){

			if(data)
				Config[NAME] = data[0];

			self.list();

			onUpdate && onUpdate();
		}

		this.attachEvents = function(){

			self.tab.find('.sg-add').click(self.add);

			self.tbody.on('click', '.fa-pencil', self.edit);

			self.tbody.on('click', '.fa-times', self.remove);

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
				type = Config[NAME][id];

			type.title = tr.children(':first').text();

			return {id: id, type: type};
		}

		this.init = function(){

			self.applyChanges();

			self.attachEvents();
		}

		this.list = function(){

			var tbody = self.tbody.empty();

			for(var id in Config[NAME]){

				var tr = self.trTemp.clone(),
					data = Config[NAME][id];

				tr.data('id', id);

				for(var item in data){
					var value = typeof data[item] == 'string' ? data[item] : data[item][Object.keys(data[item])];
					tr.children('.sg-' + item).text(value);
				}

				tbody.append(tr);
			}
		}

		this.remove = function(){

			var data = self.getTrType.call(this);

			Api.confirm(40, LOCAL[56].replace('%1', data.type.title), function(){

				TM.popup('loading', 83);

				Api.send(SUBJECT, 'remove' + NAME, {id: data.id}, function(res){

					TM.popup('success', 88);

					self.applyChanges(res);
				})
			})
		}

		this.showForm = function(button, data){

			var form = self.form;

			form.data(data);

			form.find('button').text(LOCAL[button]);

			form.show().position({of: '#appcenter'});
		}

		this.submitForm = function(e){

			var form = self.form,
				data = form.data(),
				params = form.serializeObject();

			params.id = data.id;

			TM.submitForm.call(this, e, function(){

				TM.popup('loading', 85);

				Api.send(SUBJECT, data.action + NAME, params, function(res){

					TM.popup('success', 86);

					form.hide();

					self.applyChanges(res);
				})
			})
		}
	},

	changeTab: function(){
		$('.set-tab').hide();
		$('.set-tab[tab=' + $(this).attr('for') + ']').show();
	},

	navAgenda: {

		active: 0,

		animate: function(type){

			$('.sab-system')
				.eq(Settings.navAgenda.active)
				.animate({right: 0})
				[type]()
				.animate({right: type == 'next' ? '100%' : '-100%'});
		},

		navigate: function(){

			var type = this.id.split('san-')[1];

			eval('Settings.navAgenda.active' + (type == 'next' ? '++' : '--'));

			Settings.navAgenda.animate(type == 'next' ? 'prev' : 'next');

			Settings.navAgenda.setActive();
		},

		setActive: function(){

			var tables = Config.default.table_times,
				active = Settings.navAgenda.active;

			$('#san-title').text(tables[active]);
			$('#san-prev').toggle(!! active);
			$('#san-next').toggle(active < (tables.length - 1));
		}
	},

}