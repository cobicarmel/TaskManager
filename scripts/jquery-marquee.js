/*
 * Created by Idan Yadgar, from http://webhub.co.il
 * All Rights Reserved
 * Do NOT remove this
 * Version 1.0
 */
(function($) {
	$.fn.marquee = function(properties) {
		if (!this.data().hasOwnProperty('marquee')) {
			this.data('marquee', new function(props, element) {
				var marquee = this;
				var properties = {};
				var dirs = {
					"normal" : {
						"right" : 'right',
						"left" : 'left',
						"up" : 'top',
						"down" : 'bottom'
					},
					"opposite" : {
						"right" : 'left',
						"left" : 'right',
						"up" : 'bottom',
						"down" : 'top'
					},
					"opposite_argDir" : {
						"right" : 'left',
						"left" : 'right',
						"up" : 'down',
						"down" : 'up'
					},
					"opposite_propDir" : {
						"right" : 'left',
						"left" : 'right',
						"top" : 'bottom',
						"bottom" : 'top'
					}
				};
				var defaultProps = {
					"direction" : 'right',
					"delay" : 85,
					"scrollAmount" : 6,
					"behavior" : 'scroll',
					"loops" : 0
				};
				var defaultCss = {};
				var loop = 0;
				var endLoop = true;
				var interval = false;
				var alternateBack = null;
				var c1, c2;
				(function() {
					c1 = $('<div>').css({
						"position" : 'relative',
						"width" : element.width(),
						"height" : element.height(),
						"overflow" : 'hidden'
					});
					c2 = $('<div>').html(element.html()).css('display', 'inline-block');
					element.html('').append(c1.append(c2));
					c2.css(
						defaultCss = {
							"top" : c2.position().top,
							"bottom" : c1.height() - c2.height() - c2.position().top,
							"left" : c2.position().left,
							"right" :  c1.width() - c2.width() - c2.position().left
						}
					).css({
						"width" : c2.width(),
						"height" : c2.height(),
						"position" : 'absolute'
					});
				})();
				var scroll = function() {
					if (properties.loops > 0 && properties.loops == loop) {
						return marquee.stop();
					}
					var dir = dirs.opposite[properties.direction];
					var c1size, c2size;
					var css = {};
					var dirValue = parseInt(c2.get(0).style[dir]);
					if (dir == 'right' || dir == 'left') {
						c1size = parseInt(c1.width());
						c2size = parseInt(c2.width());
					}
					else {
						c1size =parseInt(c1.height());
						c2size = parseInt(c2.height());
					}
					if (dirValue == c1size) {
						css[dir] = -c2size;
						endLoop = true;
						loop++;
					}
					else {
						css[dir] = dirValue+properties.scrollAmount;
						endLoop = false;
					}
					if (dirValue + properties.scrollAmount > c1size && !endLoop) {
						css[dir] = c1size;
					}
					css[dirs.opposite_propDir[dir]] = c1size - c2size - css[dir];
					c2.css(css);
				};
				var slide = function() {
					var dir = dirs.opposite[properties.direction];
					var c1size, c2size;
					var css = {};
					var dirValue = parseInt(c2.get(0).style[dir]);
					if (dir == 'right' || dir == 'left') {
						c1size = parseInt(c1.width());
						c2size = parseInt(c2.width());
					}
					else {
						c1size =parseInt(c1.height());
						c2size = parseInt(c2.height());
					}
					css[dir] = dirValue+properties.scrollAmount;
					endLoop = false;
					if (dirValue + properties.scrollAmount > c1size - c2size) {
						css[dir] = c1size - c2size;
						endLoop = true;
					}
					css[dirs.opposite_propDir[dir]] = c1size - c2size - css[dir];
					c2.css(css);
					if (endLoop) {
						marquee.stop();
					}
				};
				var alternate = function() {
					var dir = dirs.opposite[properties.direction];
					var c1size, c2size;
					var css = {};
					var dirValue = parseInt(c2.get(0).style[dir]);
					if (dir == 'right' || dir == 'left') {
						c1size = parseInt(c1.width());
						c2size = parseInt(c2.width());
					}
					else {
						c1size =parseInt(c1.height());
						c2size = parseInt(c2.height());
					}
					if ((dirValue == c1size - c2size || alternateBack === true) && dirValue > 0) {
						css[dir] = dirValue - properties.scrollAmount;
						alternateBack = true;
					}
					else {
						if (dirValue == 0 && alternateBack != null) {
							loop++;
						}
						css[dir] = dirValue + properties.scrollAmount;
						alternateBack = false;
					}
					if (dirValue + properties.scrollAmount > c1size - c2size && !alternateBack) {
						css[dir] = c1size - c2size;
					}
					else if (dirValue - properties.scrollAmount < 0 && alternateBack) {
						css[dir] = 0;
					}
					if (properties.loops > 0 && properties.loops == loop) {
						return marquee.stop();
					}
					else {
						css[dirs.opposite_propDir[dir]] = c1size - c2size - css[dir];
						c2.css(css);
					}
				};
				this.setProperties = function(props, toDefault) {
					if (toDefault === true) {
						properties = $.extend({}, defaultProps);
					}
					if (typeof props == 'object') {
						var	directionValues = ['right', 'left', 'up', 'down'],
							behaviorValues = ['scroll', 'slide', 'alternate'];
						if (props.hasOwnProperty('direction') && $.inArray(props.direction, directionValues, 0) > -1)
							properties.direction = props.direction;
						if (props.hasOwnProperty('delay') && props.delay >= 85)
							properties.delay = parseInt(props.delay);
						if (props.hasOwnProperty('scrollAmount') && props.scrollAmount > 0)
							properties.scrollAmount = parseInt(props.scrollAmount);
						if (props.hasOwnProperty('behavior') && $.inArray(props.behavior, behaviorValues) > -1)
							properties.behavior = props.behavior;
						if (props.hasOwnProperty('loops') && props.loops >= 0 && parseInt(props.loops) % 1 == 0)
							properties.loops = parseInt(props.loops);
					}
					return element;
				};
				this.start = function() {
					if (interval === false) {
						if (properties.behavior == 'scroll') {
							interval = setInterval(scroll, properties.delay);
						}
						else if (properties.behavior == 'slide') {
							interval = setInterval(slide, properties.delay);
						}
						else {
							interval = setInterval(alternate, properties.delay);
						}
					}
					return element;
				};
				this.stop = function() {
					if (interval !== false) {
						clearInterval(interval);
						interval = false;
						endLoop = true;
						alternateBack = false;
					}
					return element;
				};
				this.restart = function() {
					this.reset();
					this.start();
					return element;
				}
				this.reset = function() {
					this.stop();
					c2.css(defaultCss);
					return element;
				}
				this.setProperties(props, true);
			}(properties , this));
		}
		return this.data('marquee');
	}
})(jQuery);