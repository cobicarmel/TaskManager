'use strict';

var Settings = {

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

	tasktypes: {

		edit: function(){

			var data = Settings.tasktypes.getTrType.call(this),
				form = Settings.tasktypes.form;

			for(var item in data.type)
				form.find('[name=' + item + ']').val(data.type[item]);

			form.data({action: 'edittype', id: data.id});

			Settings.tasktypes.showForm(9);
		},

		form: $('#stt-edit'),

		getTrType: function(){

			var id = $(this).parents('tr').data('id'),
				type = Config.tasktypes[id];

			return {id: id, type: type};
		},

		list: function(){

			var types = Config.tasktypes,
				tbody = $('#set-tasktypes tbody').empty();

			for(var type in types){

				var tr = Settings.templates.tasktypesTr.clone(),
					task = types[type];

				tr.data('id', type);

				for(var item in task){
					tr.children('.stt-' + item).text(task[item]);
				}

				tbody.append(tr);
			}
		},

		remove: function(){

			var data = Settings.tasktypes.getTrType.call(this);

			Api.confirm(40, LOCAL[87].replace('%1', data.type.title), function(){

				TM.popup('loading', 83);

				Api.send('Task', 'removetype', {id: data.id}, function(res){

					TM.popup('success', 88);

					Config.tasktypes = res[0];

					Settings.tasktypes.list();
				})
			})
		},

		showForm: function(button){
			
			var form = Settings.tasktypes.form;

			form.find('button').text(LOCAL[button]);

			form.show().position({of: '#appcenter'});
		},

		submitForm: function(e){

			var form = Settings.tasktypes.form,
				data = form.data(),
				params = form.serializeObject();

			params.id = data.id;

			TM.popup('loading', 85);

			TM.submitForm.call(this, e, function(){

				Api.send('Task', data.action, params, function(res){

					TM.popup('success', 86);

					form.hide();

					Config.tasktypes = res[0];

					Settings.tasktypes.list();
				})
			})
		}
	},

	templates: {
		tasktypesTr: $('#set-tt-tr tr')
	}
}