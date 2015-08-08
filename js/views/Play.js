/* 
 * Copyright (C) 2015 Sergey Voronkov <sergey@voronkov.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
define([
		'jquery', 
		'backbone',
		'underscore',
		'game',
		'text!templates/screens/play.html',
		'text!templates/top_menu.html'
], 
function($, Backbone, _, Game, template, tplMenu){
		
	var Play = Backbone.View.extend({
		el: '#main',
		template: _.template(template),
		events:{
			'click .back': function(){
				history.back()
			}
		},
		render: function(){
			var width = 800, height = 600, tilesprite;
			this.$el.html(this.template({
				topMenu: tplMenu,
				width: width,
				height: height
			}));
			var contextContener = this.$el.find('.context-wrapper');
			Game.init(contextContener,{
				width: 800,
				height: 600,
				road:[
					{type:'start', x: 4, y: 1, r: 1},
					{type:'road', x: 5, y: 1, r: 1},
					{type:'road', x: 6, y: 1, r: 1},
					{type:'lroad', x: 7, y: 1, r: 2},
					{type:'road', x: 7, y: 2, r: 2},
					{type:'road', x: 7, y: 3, r: 2},
					{type:'road', x: 7, y: 4, r: 2},
					{type:'lroad', x: 7, y: 5, r: 1},
					{type:'road', x: 6, y: 5, r: 3},
					{type:'road', x: 5, y: 5, r: 3},
					{type:'road', x: 4, y: 5, r: 3},
					{type:'road', x: 3, y: 5, r: 3},
					{type:'road', x: 2, y: 5, r: 3},
					{type:'lroad', x: 1, y: 5, r: 0},
					{type:'road', x: 1, y: 4, r: 0},
					{type:'road', x: 1, y: 3, r: 0},
					{type:'road', x: 1, y: 2, r: 0},
					{type:'lroad', x: 1, y: 1, r: 3},
					{type:'road', x: 2, y: 1, r: 1},
					{type:'road', x: 3, y: 1, r: 1},
				]
			});
			
		},
	});
	
	return new Play();
});


