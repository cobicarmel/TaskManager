'use strict';

var Access = {

	actions: {},

	changeAccess: function(e){

		e.preventDefault();

		var trs = $('#set-access tbody tr');

		var params = $.map(trs, function(tr){

			tr = $(tr);

			var id = tr.attr('id').split('sa-tr')[1],
				access = tr.find('input:checked').length + 1;

			return {id: id, access: access};
		})

		TM.popup('loading', 12);

		Api.send('Access', 'changeaccess', {values: params}, function(){
			TM.popup('success', 13);
			location.reload();
		})
	},

	hasAction: function(subject, action){

		if(! Access.actions[subject])
			return false;

		if(! action)
			return true;

		var found = false;

		for(var key in Access.actions[subject]){

			var keys = key.split(',');

			if(keys.indexOf(action) + 1){
				found = true;
				break;
			}
		}

		return found;
	},

	writeSettings: function(){

		var subjects = Access.actions;

		for(var subject in subjects)

			for(var action in subjects[subject]){

				var actionData = subjects[subject][action],
					tr = $('#sa-tr' + actionData.id),
					inputs = tr.find('input'),
					level = actionData.access;

				for(var i = 0; i < level - 1; i++)
					inputs.eq(i).prop('checked', true);
			}
	}
}