'use strict';

var VBoard = function(TABLE_TIME){

	this.days = {};

	this.step = 5;

	var self = this;

	this.addDay = function(strDate){

		if(self.days[strDate])
			return;

		self.days[strDate] = {};

		for(var h = 0; h < 24; h++){

			var hour = timeFormat(h);

			for(var m = 0; m < 60; m += self.step){

				var minute = timeFormat(m),
					time = [hour, minute].join(':');

				self.days[strDate][time] = {};
			}
		}
	}

	this.each = function(start, end, fn){

		var starttime = new Date(start),
			endtime = new Date(end);

		while(starttime < endtime){

			var strDate = starttime.toLocaleDateString(),
				strTime = starttime.toRealTime(),
				call = fn.call(starttime, strDate, strTime);

			if(call == false)
				break;

			starttime.setMinutes(starttime.getMinutes() + self.step);
		}
	}

	this.getTime = function(date){

		var strDate = date.toLocaleDateString(),
			strTime = date.toRealTime();

		return self.days[strDate][strTime];
	}

	this.getRangeTime = function(start, end){

		var stack = {};

		self.each(start, end, function(n, strTime){
			stack[strTime] = self.getTime(this);
		})

		return stack;
	}

	this.hasDate = function(date){
		try{
			self.getTime(date);
		}
		catch(e){
			return false;
		}

		return true;
	}

	this.reset = function(date, spec){

		var strDate = date.toLocaleDateString(),
			strTime = date.toRealTime();

		for(var time in self.days[strDate]){
			if(! spec)
				delete self.days[strDate][time];
			else
				delete self.days[strDate][time][spec];
		}

	}

	this.setData = function(strDate, strTime, data){
		self.addDay(strDate);
		self.days[strDate][strTime] = $.extend(self.days[strDate][strTime], data);
	}

	this.setRangeData = function(start, end, data){

		self.each(start, end, function(strDate, strTime){
			self.setData(strDate, strTime, data);
		})
	}
}