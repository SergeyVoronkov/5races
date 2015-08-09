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
		'models/Car',
		'text!templates/screens/selectcar.html'], 
function($, Backbone, _,Car, template){
	var CarView = Backbone.View.extend({
		tagName: 'li',
		events:{
			'click': 'select'
		},
		render: function(){
			this.$el.html( '<img src="'+this.model.get('img')+'" alt=""/>' );
			return this;
		},
		select:function()
		{
			Backbone.history.navigate('play');
			app.router.play(this.model);
		}
	});
	
	var SelectCar = Backbone.View.extend({
		el: '#main',
		template: _.template(template),
		render: function(){
			this.$el.html(this.template({
			}));
			this.$el.find('ul.menu').append(this.model.map(this.renderItem, this));
			return this;
		},
		renderItem:function(model){
			var view = new CarView({ model: model });
			return view.render().el;
		}
	});
	
	return new SelectCar({model: new Car.Colection([
		{text:'Фиалетовая', id: 'car1', img: 'assets/car1.png'},
		{text:'Зеленая', id: 'car2', img: 'assets/car2.png'},
	])});
});