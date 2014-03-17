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
	}
}