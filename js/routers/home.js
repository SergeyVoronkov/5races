define([
	'jquery', 
	'backbone', 
	'underscore', 
], 
function($, Backbone, _){
	var currentView = null;
	var show = function(view)
	{
		return function(){
			var arg = arguments;
			requirejs(['views/' + view], function(View){
				if(currentView && currentView.destroy) currentView.destroy();
				View.render.apply(View, arg);
				currentView = View;
			})
		}
	}
	var Router = Backbone.Router.extend({
		routes: {
			'': 'menu',
			'play': 'play',
			'records': 'records',
			'selectcar': 'selectcar',
		},
		'menu': show('Menu'),
		'selectcar': show('SelectCar'),
		'play': show('Play'),
		'records': show('Records')
	});
	
	return Router;
});
