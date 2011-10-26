(function(){
	var rRoute, rFormat;
	$.route = function(obj, path){
		obj = obj || {};
		var m;
		(rRoute || (rRoute = /([\d\w_]+)/g)).lastIndex = 0;
		while ((m = rRoute.exec(path)) !== null) {
			obj = obj[m[0]];
			if (obj == undefined) {
				break
			}
		}
		return obj
	};
	$.format = function(){
		var args = $.makeArray(arguments), str = String(args.shift() || ""), ar = [], first = args[0];
		args = $.isPlainObject(first) ? args : $.isArray(first) ? first : [args];
		$.each(args, function(i, o){
			ar.push(str.replace(rFormat || (rFormat = /\{([\d\w\.]+)\}/g), function(m, n, v){
				v = n === 'INDEX' ? i : n.indexOf(".") < 0 ? o[n] : $.route(o, n);
				return v === undefined ? m : ($.isFunction(v) ? v(n) : v)
			}));
		});
		return ar.join('');
	};
	
	var rlenw;
	$.lenW = function(str){
		return str.replace(rlenw || (rlenw = /[^\x00-\xff]/g), "**").length;
	};
	
	$.leftPad = function(str, size, ch){
		return size <= str.length ? str : (new Array(size - str.length + 1).join(ch || ' ') + str);
	};
	
	var f = [/&/g, /"/g, /</g, />/g, /'/g, /\x20/g, /\n/g, /\t/g];
	var t = ["&quot;", "&lt;", "&gt;", "&#146;", "&nbsp;", "", "&nbsp;&nbsp;&nbsp;&nbsp;"];
	$.htmlEncode = function(html){
		return html.replace(f[0], t[0]).replace(f[1], t[1]).replace(f[2], t[2]).replace(f[3], t[3]).replace(f[4], t[4]).replace(f[5], t[5]).replace(f[6], t[6]).replace(f[7], t[7])
	};
})();

$.fn.center = function(){
	return this.each(function(){
		var de = document.documentElement, w = window, leftPos = (($.browser.opera ? de.clientWidth : $(w).width()) - $(this).outerWidth()) / 2 + $(w).scrollLeft(), topPos = (($.browser.opera ? de.clientHeight : $(w).height()) - $(this).outerHeight()) / 2 + $(w).scrollTop();
		leftPos = (leftPos < 0) ? 0 : leftPos;
		topPos = (topPos < 0) ? 0 : topPos;
		$(this).css({
			left: leftPos + 'px',
			top: topPos + 'px'
		});
	});
};

(function(){
	$.message = function(text, time){
		$('#div_message').stop(true, false).removeClass().addClass('ui-state-highlight ui-corner-all').center()
		.fadeTo('fast', 1).delay(time || 2000).fadeOut('fast').find('strong').html(text);
	};
	$.error = function(text, time){
		$('#div_message').stop(true, false).removeClass().addClass('ui-state-error ui-corner-all').center()
		.fadeTo('fast', 1).delay(time || 2000).fadeOut('fast').find('strong').html(text);
	};
	$.confirm = function(text, title, opt){
		$("#dialog-confirm").attr('title', title || '温馨提示').find('p').text(text).end().dialog($.extend(true, {
			resizable: false,
			height: 140,
			modal: true,
			buttons: {
				'取消': function(){
					$(this).dialog("close");
				}
			}
		}, opt));
	};
})();

function copy(text){
	return window.clipboardData.setData("Text", text);
}
(function(){
	var stopPropagation = function(evt){
		evt.stopPropagation();
	};
	$.fn.accordionHeadEditor = function(option){
		var opt = $.extend({
			attr: 'custom',
			template: '<a href="">{value}</a>',
			keepValue: true,
			hint: '',
			check: function(){
				return true;
			},
			cancel: function(){
				this.add(this.next()).remove();
			},
			change: $.noop,
			blur: function(evt){
				var val = this.value, bChk;
				if (!val || val == opt.hint) {
					opt.cancel.call($(this).parent());
				} else if ((bChk = opt.check(val)) === true) {
					$(this).parent().attr(opt.attr, val).html($.format(opt.template, {
						value: val
					}));
					opt.change(val);
				} else {
					$.message(bChk);
					$(this).select();
				}
			}
		}, option);
		opt.keepValue || this.val(opt.hint);
		return this.click(stopPropagation).keydown(stopPropagation).keypress(function(evt){
			if (evt.keyCode == 13) {
				this.blur();
			}
		}).blur(opt.blur).select();
	};
})();

function see(value, replacer, space){
	return alert(JSON.stringify(value, replacer, space).replace(/\r\n/g, '\n'));
}