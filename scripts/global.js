'use strict';

function showDateTime(){

	var date = new Date();

	$('#dt-day').text(date.getFullHeDay());
	$('#dt-date').text(date.getFullHeMonth() + ' ' + date.getFullYear());

	var time = $('#dt-time');

	if(time.text() == '23:59:59' && ! date.getHours())
		tableTime.next();

	time.text(date.toLocaleTimeString());

}

function changeTab(){
	$('.menu-tab.active').removeClass('active');
	$(this).addClass('active');

	var tab = $(this).attr('tab');

	$('.ac-tab').hide().css('z-index', 0);
	$('.ac-tab[tab=' + tab + ']').show().css('z-index', 1);

	$('#new-client').data('new-meet', arguments[0] == 'new-meet');

	if(tab == 'client' && ! $(clients).data('ui-accordion')){

		var options = {
			active: 3,
			beforeActivate: function(){
				if(arguments[1].newHeader.index('h4') != 2)	
					$('.search-results').hide();
			}
		}

		$(clients).accordion($.extend(Config.accordion, options))

		$('.search-results').hide();

		$('#cd-list').tableScroll(392).tablesorter({sortList: [[0,0]]});

		$('.ts-head th').on('click', function(){
			var index = $(this).index('.ts-head th');
			$('#cd-list th').eq(index).click();
		})
	}
}

function popup(type, text){

	var elem = $('#popup');

	if(! type)
		return elem.hide();

	elem.stop(true);

	text = LOCAL[text] || text;

	if(type == 'loading')
		text += '...';

	elem.removeClass().addClass(type).show().position({of: '#appcenter', at: 'center top+100'});

	$('#popup-title').text(text);

	if(type != 'loading')
		elem.delay(2000).fadeOut();
}

function sortObjects(array, by){
	array.sort(function(a, b){
		return a[by] < b[by] ? -1 : a[by] > b[by] ? 1 : 0;
	})
}

function addMultiObj(obj, keys, value){

	var firstKey = keys.splice(0, 1);

	if(typeof obj[firstKey] == 'object')
		obj[firstKey] = addMultiObj(obj[firstKey], keys, value);
	else
		obj[firstKey] = value;

	return obj;
}

function getMultiObj(obj, keys){

	var firstKey = keys.splice(0, 1);

	if(typeof obj[firstKey] == 'object' && keys.length)
		return getMultiObj(obj[firstKey], keys);
	else
		return obj[firstKey];
}

var dialog = {

	close: function(){
		dialog.elem.dialog('destroy');
	},

	elem: $('#ac-dialog'),

	show: function(custom){

		var defaultButton = {};

		defaultButton[LOCAL[17]] = function(){};

		var options = {
			beforeClose: function(){
				$('.ui-selected').removeClass('ui-selected');
				var cancel = $('.ui-dialog .ui-dialog-buttonset button:contains(' + LOCAL[18] + ')');
				if(cancel.length){
					cancel.click();
					return false;
				}
			},
			buttons: defaultButton,
			closeText: LOCAL[14],
			draggable: false,
			modal: true,
			position: {of: '#appcenter'},
			resizable: false
		}

		if(custom){
			options = $.extend(options, custom);
			dialog.elem.children('p').html(custom.content);
		}

		dialog.elem.dialog(options);
	}
}

$.fn.serializeObject = function(){

	var arrData = this.serializeArray(),
		objData = {};

	$.each(arrData, function(){
		if(objData[this.name]){
			objData[this.name] = [objData[this.name]];
			objData[this.name].push(this.value);
		}
		else
			objData[this.name] = this.value;
	})

	return objData;
}

$.fn.timepicker = function(settime, range){

	$(this).html($('<option>'));

	for(var h = 0; h < 24; h++){
		var hour = timeFormat(h);
		if(range < 1 || ! range)
			range = 5;
		for(var m = 0; m < 60; m += range){
			var minute = timeFormat(m),
				time = [hour, minute].join(':'),
				option = $('<option>').text(time);

			if(time && time == settime)
				option.attr('selected', true);

			$(this).append(option);
		}
	}
}

$.fn.validate = function(){

	var res = {},
		isEmpty = true;

	var elements = $(this).find(':input').filter(function(){
		return this.name;
	})

	elements.each(function(){

		if(this.value)
			isEmpty = false;

		var isValid = Api.validate.check.apply(this);

		if(isValid !== true){
			res.element = this;
			res.no = isValid;
			return false;
		}
	})

	for(var r in res)
		return res;

	return isEmpty ? popup('error', 53) : true;
}

var orgShow = $.fn.show;

$.fn.show = function(){
	$(this).trigger('show');
	orgShow.apply(this, arguments);
	return this;
}

$.fn.tableScroll = function(height){
	var table = $(this),
		dir = table.css('direction'),
		wrapper = $('<div>').css({
			direction: dir == 'rtl' ? 'ltr' : 'rtl',
			height: height,
			overflowX: 'hidden',
			overflowY: 'auto'
		});

	table.wrap('<div class="table-scroll-wrapper"></div>');

	table.css('float', 'left').addClass('table-scroll').wrap(wrapper.addClass('ts-body')).attr('original-width', table.width());

	table.find('th, tbody tr:first td').each(function(){
		$(this).attr('original-width', $(this).width())
	})

	var newTable = table.clone();

	table.find('thead tr').hide();

	newTable.children('tbody').empty();

	table.parent().parent().prepend(newTable);

	newTable.wrap($('<div>').height(newTable.height()).addClass('ts-head'));

	newTable.width(newTable.attr('original-width')).removeAttr('id');

	newTable.find('th').each(function(){
		$(this).width($(this).attr('original-width'));
	})

	table.css({
		width: table.attr('original-width'),
		direction: dir
	})

	table.find('tbody tr:first td').each(function(){
		$(this).width($(this).attr('original-width'));
	})

	return table;
}

$.fn.clear = function(text){

	var style = {
		color: '#BBB',
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		margin: 'auto',
		height: 30,
		textAlign: 'center'
	}

	$(this).prev('.empty').remove();

	$(this)
		.before($('<div>', {'class': 'empty'}).html(text).css(style))
		.data('cleared', true)
		.hide()
		.parent()
		.css('position', 'relative');

	return $(this);
}

$.fn.unClear = function(){
	$(this)
		.removeData('cleared')
		.show()
		.prev('.empty')
		.remove();

	return $(this);
}

$.fn.addData = function(keys, value){
	var data = addMultiObj(this.data(), keys, value);
	return this.data(data);
}

$.fn.getData = function(keys){
	return getMultiObj(this.data(), keys);
}

$.fn.selectOption = function(type, value){
	var options = this.children('option');

	options.filter('[selected]').removeAttr('selected');

	options.filter(function(){
		return $(this)[type]() == value;
	}).attr('selected', true);

	return this;
}

$.fn.multiCheck = function(selector){

	var isMethod = typeof selector == 'boolean',
		elem = this,
		data = elem.data('multi-check');

	if(isMethod){
		if(! data)
			throw new Error('this object has not been set to multiCheck');

		return data.triggerCheck(selector);
	}

	var methods = {

		addEvents: function(){
			methods.getOthers().off('change').on('change', function(){
				if(! this.checked)
					methods.checkMe(true);
			})
		},

		checkAll: function(){
			var checked = elem[0].checked;

			methods.addEvents();

			methods.getOthers().each(function(){
				this.checked = checked;
			})
		},

		checkMe: function(val){
			elem[0].checked = val;
		},

		getOthers: function(){
			return $(selector);
		},

		triggerCheck: function(val){
			methods.checkMe(val);
			methods.checkAll();
		}
	}

	elem
		.data('multi-check', methods)
		.off('change')
		.on('change', methods.checkAll);

	methods.addEvents();
}