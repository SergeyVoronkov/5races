define(function(){
	var util = {
		emptyFn: function(){},
		extend: function(obj)
		{
			for(var i = 1; i < arguments.length; ++i)
			{
				var obj2 = arguments[i];
				for(var n in obj2){
					obj[n] = obj2[n];
				}
			}
			return obj;
		},
		delegate:function(callback, scope){
			return function(){
				callback.apply(scope || window, arguments)
			}
		},
		isString: function(v){
			return typeof v === 'string';
		},
		isObject: function(v){
			return typeof v === 'object' && !this.isArray(v);
		},
		isArray: function(v)
		{
			return v instanceof Array;
		},
		class: function (options, base) {
			var superclass = base, mixin;
			var _class= function()
			{
				if(this.construct) {
					this.construct.apply(this, arguments);
				}
			};
			if(options.mixin){
				mixin = options.mixin;
				delete options.mixin;
			}
			
			for(var n in options){
				if(typeof options[n] === 'function'){
					options[n].$name = n;
					options[n].$owner = _class;
				}
			}
			if(base) {
				var instance = function(){};
				instance.prototype = base.prototype;
				_class.prototype = new instance();
				_class.$base = base;
			}
			if(mixin)
			{
				for(var i = 0; i < mixin.length; ++i)
				{
					util.extend(_class.prototype, mixin[i].prototype);
				}
			}
			util.extend(_class.prototype, options);
			_class.prototype.base = function(arg){
				if(this.base.caller && this.base.caller.$name && this.base.caller.$owner.$base)
				{
					this.base.caller.$owner.$base.prototype[this.base.caller.$name].apply(this, arg);
				}
			};
			
			return _class;
		},
	};
	util.Observable = util.class({
		/**
		 * Подписатся на событие
		 * @param {string} event Название
		 * @param {Function} fn	Функция обратного вызова
		 * @param {Object} scope Контекст выполнения функции
		 * @returns {util.Observable}
		 */
		on:function(event, fn, scope, options){
			if(!this.events) this.events = {};
			if(typeof event == 'object')
			{
				scope = fn
				for(var n in event){
					this.on(n, event[n], scope)
				}
				return this;
			}
			if(!(event in this.events)) this.events[event] = [];
			this.events[event].push(util.extend({id: event, fn: fn, scope: scope || window}, options));
			return this;
		},
		/**
		 * Отписатся от события
		 * @param {type} event
		 * @param {type} fn
		 * @param {type} scope
		 * @returns {undefined}
		 */
		un: function(event, fn, scope)
		{
			if(this.events)
			{
				if(this.events[event]){
					var events = this.events[event], e;
					scope = scope || window;
					if(!fn){
						delete this.events[event];
						return this;
					}
					for(var i = 0; i < events.length; ++i) {
						e = events[i];
						if(e.fn === fn && e.scope === scope){
							events.splice(i,1);
							return this;
						}
					}
				}
			}
			return this;
		},
		fireEventArgs: function(event , args)
		{
			if(this.events && this.events[event]) {
				var events = this.events[event], e, r;
				for(var i = 0; i < events.length; ++i) {
					e = events[i];
					r = e.fn.apply(e.scope, args);
					if(e.single) {
						this.un(event, e.fn, e.scope);
					}
					if(r === false) return false;
				}
			}
		},
		/**
		 * Бросить событе
		 * @param {type} event
		 * @returns {undefined}
		 */
		fireEvent: function(event /*, arg...*/)
		{
			return this.fireEventArgs(event, Array.prototype.slice.call(arguments, 1));
		}
	})
	return util;
});


