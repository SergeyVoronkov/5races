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
	'util',
	'Phaser'
],function(util, Phaser){
	var game;
	// Дорога
	var Road = util.class({
		construct:function(){
			this.batch = game.add.spriteBatch();
			this.items = [];
		},
		createItem: function(type, x, y, rotation){
			var image = game.add.image(x, y, type, null, this.batch);
			image.anchor.setTo(0.5);
			image.rotation = -rotation * Math.PI/2;
			var item = {image: image };
			this.items.push(item);
		}
	});
	var Car = util.class({
		construct:function(image){
			this.image = image;
		}
	})
	
	var GameState = util.class({
		preload: function()
		{
			this.game.load.image('bg', 'assets/bg.png');
			this.game.load.image('road', 'assets/road.png');
			this.game.load.image('start', 'assets/start.png');
			this.game.load.image('lroad', 'assets/lroad.png');
			this.game.load.image('car1', 'assets/car1.png');
		},
		create: function()
		{
			this.background = game.add.tileSprite(0, 0, this.map.width, this.map.height, 'bg');
			this.road = new Road();
			for(var i = 0; i < this.map.road.length; ++i)
			{
				var item = this.map.road[i];
				this.road.createItem(item.type, item.x * 100, item.y * 100, item.r);
				if(item.type == 'start'){
					this.createCars(item.x * 100, item.y * 100, item.r);
				}
			}
		},
		// Создание машины
		createCar:function(x, y, img){
			var image = game.add.sprite(x, y, 'car1')
			return new Car(image);
		},
		// Создание все машин
		createCars: function(x, y, direction){
			this.player = this.createCar('car1');
			this.game.physics.enable(this.player.image, Phaser.Physics.ARCADE);
		},
		update: function()
		{
		},
		loadMap:function(map){
			this.map = map;
		}
	})
	
	

	return {
		init:function($parent, map){
			game = new Phaser.Game(map.width, map.height, Phaser.AUTO, $parent[0]);
			game.state.add('game', GameState, true).loadMap(map);
			
		}
	}
})