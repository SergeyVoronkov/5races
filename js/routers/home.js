define([
	'jquery', 
	'backbone', 
	'underscore', 
	'views/Menu',
	'views/Play',
	'views/Records'
], 
function($, Backbone, _, Menu, Play, Records){
	var Router = Backbone.Router.extend({
		routes: {
			'': 'menu',
			'play': 'play',
			'records': 'records'
		},
		'menu': function(){
			Menu.render();
		},
		'play': function(){
			Play.render();
		},
		'records': function(){
			Records.render();
		}
	});
	
	return Router;
});
