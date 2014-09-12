'use strict';

Date.prototype.heMonths = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

Date.prototype.heDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

Date.prototype.getHeMonth = function(){
	return this.heMonths[this.getMonth()];
}

Date.prototype.getHeDay = function(){
	return this.heDays[this.getDay()];
}

Date.prototype.getFullHeDay = function(){
	return 'יום ' + this.getHeDay();
}

Date.prototype.getFullHeMonth = function(){
	return this.getDate() + ' ב' + this.getHeMonth();
}

Date.prototype.getFullHeDate = function(){
	return this.getFullHeDay() + ', ' + this.getFullHeMonth() + ' ' + this.getFullYear();
}

Date.prototype.toLocaleDateString = function(){
	var date = timeFormat(this.getDate()),
		month = timeFormat(this.getMonth() + 1),
		year = this.getFullYear();

	return [date, month, year].join('/');
}

Date.prototype.toRealTime = function(){
	var strTime = this.toLocaleTimeString().split(':');

	return [strTime[0], strTime[1]].join(':');
}

Date.prototype.toLocaleString = function(){
	return this.toLocaleDateString() + ' ' + this.toLocaleTimeString();
}

String.prototype.toDate = function(strTime, relative){

	var parts = this.split('/'),
		date = parts.length == 3 ? new Date(parts.reverse().join('/')) : new Date();

	strTime = strTime || (parts.length != 3 ? this : null);

	if(strTime){
		var arr = strTime.split(':');
		date.setHours(arr[0]);
		date.setMinutes(arr[1]);

		if(strTime < relative)
			date.setDate(date.getDate() + 1);
	}

	return date;
}

Date.prototype.setTextTime = function(text){
	var arrTime = text.split(':');

	this.setHours(arrTime[0]);
	this.setMinutes(arrTime[1]);

	return this;
}

function timeFormat(digit){
	var num = '00' + digit;
	return num.substr(num.length - 2);
}