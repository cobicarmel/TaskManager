'use strict';

var VBoard = {

	days: {},

	step: 5,

	addDay: function(strDate){

		if(VBoard.days[strDate])
			return;

		VBoard.days[strDate] = {};

		for(var h = 0; h < 24; h++){

			var hour = timeFormat(h);

			for(var m = 0; m < 60; m += VBoard.step){

				var minute = timeFormat(m),
					time = [hour, minute].join(':');

				VBoard.days[strDate][time] = {};
			}
		}
	},

	each: function(start, end, fn){

		var starttime = new Date(start),
			endtime = new Date(end);

		while(starttime < endtime){

			var strDate = starttime.toLocaleDateString(),
				strTime = starttime.toRealTime(),
				call = fn.call(starttime, strDate, strTime);

			if(call == false)
				break;

			starttime.setMinutes(starttime.getMinutes() + VBoard.step);
		}
	},

	getTime: function(date){

		var strDate = date.toLocaleDateString(),
			strTime = date.toRealTime();

		return VBoard.days[strDate][strTime];
	},

	hasDate: function(date){
		try{
			VBoard.getTime(date);
		}
		catch(e){
			return false;
		}

		return true;
	},

	reset: function(date, spec){

		var strDate = date.toLocaleDateString(),
			strTime = date.toRealTime();

		for(var time in VBoard.days[strDate]){
			if(! spec)
				delete VBoard.days[strDate][time];
			else
				delete VBoard.days[strDate][time][spec];
		}

	},

	setData: function(strDate, strTime, data){
		VBoard.addDay(strDate);
		VBoard.days[strDate][strTime] = $.extend(VBoard.days[strDate][strTime], data);
	},

	setRangeData: function(start, end, data){

		VBoard.each(start, end, function(strDate, strTime){
			VBoard.setData(strDate, strTime, data);
		})
	}
}