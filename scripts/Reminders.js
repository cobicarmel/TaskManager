'use strict';

var Reminders = {

	buildGroups: function(){

		(new TM.createGroup('Reminders', 'reminders', function(){})).init();
	}

}