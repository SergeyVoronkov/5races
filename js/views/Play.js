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
				Backbone.history.navigate('',true)
			}
		},
		render: function(car){
			if(!car){
				Backbone.history.navigate('selectcar',true);
				return;
			}
			var width = 800, height = 600, tilesprite;
			this.$el.html(this.template({
				topMenu: tplMenu,
				width: width,
				height: height
			}));
			var contextContener = this.$el.find('.context-wrapper');
			var map = {
				width: 800,
				height: 600,
				trees:[
					{x: 150, y: 150},
					{x: 580, y: 380},
				],
				covers:[
					{x: 550, y: 50},
					{x: 567, y: 50},
					{x: 584, y: 50},
					{x: 601, y: 50},
					{x: 618, y: 50},
					{x: 635, y: 50},
					
				],
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
					{type:'lroad', x: 3, y: 5, r: 0},
					{type:'road', x: 3, y: 4, r: 0},
					{type:'lroad', x: 3, y: 3, r: 2},
					{type:'road', x: 2, y: 3, r: 3},
					{type:'lroad', x: 1, y: 3, r: 0},
					{type:'road', x: 1, y: 2, r: 0},
					{type:'lroad', x: 1, y: 1, r: 3},
					{type:'road', x: 2, y: 1, r: 1},
					{type:'road', x: 3, y: 1, r: 1},
				]
			};
			var map2 = {
				width: 800,
				height: 600,
				trees:[
					{x: 150, y: 150},
					{x: 580, y: 380},
				],
				covers:[
					{x: 550, y: 50},
					{x: 567, y: 50},
					{x: 584, y: 50},
					{x: 601, y: 50},
					{x: 618, y: 50},
					{x: 635, y: 50},
					
				],
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
			};
			Game.init(contextContener,{map: map, car: car});
			
		},
		destroy: function(){
			Game.destroy();
		}
	});
	
	return new Play();
});


