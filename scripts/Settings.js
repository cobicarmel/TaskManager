'use strict';

var Settings = {

	buildGroups: function(){

		var tasktypes = new TM.createGroup({
			name: 'tasktypes',
			subject: 'Task',
			onUpdate: function(){
				Settings.listTasktypes();

				for(var tt in TM.tableTime.items){
					var agenda = TM.tableTime.items[tt].Agenda;
					agenda.getAll(agenda.rewrite);
				}
			}
		})

		tasktypes.init();

		var users = new TM.createGroup({
			name: 'users',
			subject: 'Users'
		});

		users.init();
	},

	changeTab: function(){
		$('.set-tab').hide();
		$('.set-tab[tab=' + $(this).attr('for') + ']').show();
	},

	listTasktypes: function(){

		var typesList = $('#ae-taskgroup').html($('<option>'));

		for(var option in Config.tasktypes)
			typesList.append($('<option>').attr('value', option).text(Config.tasktypes[option].title));
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

	submitSettings: function(){

		var params = this.serializeObject();

		TM.popup('loading', 12);

		Api.send('Settings', 'changesettings', params, function(){
			TM.popup('success', 13);
			location.reload();
		})
	}
}