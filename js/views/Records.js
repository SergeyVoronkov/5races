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
		'text!templates/screens/records.html'], 
function($, Backbone, _, template){
	var Records = Backbone.View.extend({
		el: '#main',
		template: _.template(template),
		render: function(){
			this.$el.html(this.template({
				
			}));
		}
	});
	
	return new Records();
});


