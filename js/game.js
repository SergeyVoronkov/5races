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
	var game, PI = Math.PI, PI2 = PI*2, PI_2 = PI/2, PI15 = PI * 1.5, PI05 = PI*0.5;
	
	// Дорога
	var Road = util.class({
		construct:function(){
			this.batch = game.add.spriteBatch();
			this.items = [];
		},
		createItem: function(type, x, y, direction){
			var image = game.add.image(x, y, type, null, this.batch);
			image.anchor.setTo(0.5);
			image.rotation = -direction * PI_2;
			var item = {image: image, direction: direction };
			this.items.push(item);
		},
		// Проверить находится ли машина на треке
		inTrack:function(car)
		{
			var p = new Phaser.Point();
			car.track = -1;
			for(var i = 0, l = this.items.length; i < l; ++i)
			{
				var item = this.items[i];
				Phaser.Point.subtract(car.el.position, item.image.position, p)
				if(item.image.getBounds().contains(p.x, p.y))
				{
					car.track = i;
					return true;
				}
			}
			return false;
		}
	});
	// Класс бота
	var Bot = util.class({
		
		construct:function(game, car){
			this.game = game;
			this.car = car;
			
		},
		update: function(){
			if(this.car.track != -1) // Если на дороге то просто берем следующий участок
			{
				var nextTrack = this.car.track + 1;
				if(nextTrack >= this.game.road.items.length) nextTrack = 0;
				this.point = {x: this.game.road.items[nextTrack].image.position.x, y: this.game.road.items[nextTrack].image.position.y};
			} else {
				this.point = null;
			}
			if(this.point)
			{
				this.car.rotationTo(game.physics.arcade.angleToXY(this.car.el, this.point.x, this.point.y) + PI_2);
			} else {
				this.car.rotationStop();
			}
			this.car.accelerate();
		},
		debug: function(){
			if(this.point)
			{
				game.debug.start();
				var context = game.debug.context;
				context.beginPath();
				context.moveTo(this.car.el.position.x,this.car.el.position.y);
				context.lineTo(this.point.x,this.point.y);
				context.lineWidth = 1;
				context.stroke();
				context.closePath();
				game.debug.stop();
			}
		}
	});
	var Car = util.class({
		drag: 50, // Замедление при отпускание педали
		stopSpeed: 300, // Замедление при торможение
		maxSpeed: 100, // Максимальная скорость PIxels/second
		acceleration: 150, // Ускарение PIxels/second/second
		rotationSpeed: 100,
		construct:function(el, rotation){
			this.el = el;
			this.el.rotation = rotation;
			game.physics.enable(this.el, Phaser.Physics.ARCADE);
			this.el.body.collideWorldBounds = true;
			this.setMaxSpeed(this.maxSpeed);
			this.el.body.drag.set(this.drag);
		},
		setMaxSpeed:function(speed)
		{
			this.el.body.maxVelocity.setTo(speed, speed);
		},
		// Нажать на педаль газа
		accelerate:function()
		{
			if(this.el.body.speed > 0) game.physics.arcade.velocityFromRotation(this.el.rotation - PI_2, this.el.body.speed, this.el.body.velocity);
			game.physics.arcade.accelerationFromRotation(this.el.rotation - PI_2, this.acceleration, this.el.body.acceleration);
		},
		// Педаль ненажата
		noAccelerate: function()
		{
			if(this.el.body.speed > 0) 
			{
				this.el.body.acceleration.set(0);
				this.el.body.drag.set(this.drag);
				game.physics.arcade.velocityFromRotation(this.el.rotation - PI_2, this.el.body.speed, this.el.body.velocity);
			}
		},
		// Педаль тормоза
		stop: function(){
			this.el.body.acceleration.set(0);
			this.el.body.drag.set(this.stopSpeed);
		},
		// Поворот на лево 
		rotationLeft: function(){
			this.el.body.angularVelocity = -(this.el.body.speed);
			
		},
		// Поворот на право
		rotationRight: function(){
			this.el.body.angularVelocity = this.el.body.speed;
		},
		// Возврат руля назат в центер
		rotationStop: function(){
			this.el.body.angularVelocity = 0;
		},
		rotationTo:function(rotation){
			var carRotation = this.el.rotation;
			if(carRotation < 0) carRotation += PI2;
			if(rotation < 0) rotation += PI2;
			var d;
			if(carRotation > PI15 && rotation < PI05) // Если машина повернута в 3ю четверть а надо повернуть в первую
			{
				d = PI2 - carRotation + rotation;
			} else if(rotation > PI15 && carRotation < PI05)
			{
				d = rotation -PI2 - carRotation;
			}
			else
			{
				d = rotation - carRotation;
			}
			
			if(d > 0.2) {
				this.rotationRight()
			} else if(d < - 0.2) {
				this.rotationLeft()
			} else {
				this.rotationStop();
				this.el.rotation = rotation
			}
		}
	})
	
	var GameState = util.class({
		directions: [
			[0, -1],	// Вверх
			[1, 0],		// Вправо
			[0, 1],		// Вниз
			[-1, 0]
		],
		preload: function()
		{
			this.game.load.image('bg', 'assets/bg.png');
			this.game.load.image('road', 'assets/road.png');
			this.game.load.image('start', 'assets/start.png');
			this.game.load.image('lroad', 'assets/lroad.png');
			this.game.load.image('car1', 'assets/car1.png');
			this.game.load.image('car2', 'assets/car2.png');
			this.game.load.image('tree', 'assets/tree.png');
			this.game.load.image('tree_shadow', 'assets/tree_shadow.png');
			this.game.load.image('cover', 'assets/cover.png');
		},
		create: function()
		{
			this.collideObject = [];
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
			for(var i = 0; i < this.map.trees.length; ++i)
			{
				this.createTree(this.map.trees[i]);
			}
			for(var i = 0; i < this.map.covers.length; ++i)
			{
				this.createCover(this.map.covers[i]);
			}
			
			
			this.game.input.keyboard.addKeyCapture([
				Phaser.Keyboard.LEFT,
				Phaser.Keyboard.RIGHT,
				Phaser.Keyboard.UP,
				Phaser.Keyboard.DOWN
			]);
		},
		createTree: function(o)
		{
			game.add.sprite(o.x-5, o.y+5, 'tree_shadow');
			var tree = game.add.sprite(o.x, o.y, 'tree');
			game.physics.enable(tree, Phaser.Physics.ARCADE);
			tree.body.immovable = true;
			this.collideObject.push(tree);
		},
		createCover: function(o)
		{
			var cover = game.add.sprite(o.x, o.y, 'cover');
			game.physics.enable(cover, Phaser.Physics.ARCADE);
			cover.body.drag.set(100);
			this.collideObject.push(cover);
		},
		// Создание машины
		createCar:function(x, y, img, direction){
			var image = game.add.sprite(x, y, img);
			image.anchor.setTo(0.5);
			return new Car(image, direction * PI_2);
		},
		// Создание все машин
		createCars: function(x, y, direction){
			this.cars = [];
			this.bots = [];
			this.player = this.createCar(x + this.directions[direction][1]*13, y + this.directions[direction][0]*13, this.userCar.get('id'), direction);
			this.cars.push(this.player);
			
			var car = this.createCar(x - this.directions[direction][1]*13, y - this.directions[direction][0]*13, 'car2', direction);
			car.max_speed *= 0.95;
			
			car.el.inputEnabled = true;
			car.el.input.enableDrag(true);
			this.cars.push(car);
			this.bots.push(new Bot(this, car));
		},
		update: function()
		{
			for(var i = 0; i < this.cars.length; ++i)
			{
				if(this.road.inTrack(this.cars[i]))
				{
					this.cars[i].setMaxSpeed(this.cars[i].maxSpeed);
				} else {
					this.cars[i].setMaxSpeed(this.cars[i].maxSpeed / 2);
				}
				for(var j = 0; j < this.cars.length; ++j) if(j != i)
				{
					game.physics.arcade.collide(this.cars[i].el, this.cars[j].el);
				}
				game.physics.arcade.collide(this.cars[i].el, this.collideObject);
			}
			game.physics.arcade.collide(this.collideObject,this.collideObject);
			if(this.input.keyboard.isDown(Phaser.Keyboard.UP))
			{
				this.player.accelerate();
			} else if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
				this.player.stop();
			} else {
				this.player.noAccelerate();
			}
			
			if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			{
				this.player.rotationLeft();
			} else if(this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
				this.player.rotationRight();
			} else {
				this.player.rotationStop();
			}
			
			for(var i = 0; i < this.bots.length; ++i)
			{
				this.bots[i].update();
			}
		},
		loadMap:function(map){
			this.map = map;
			return this;
		},
		setUserCar: function(car){
			this.userCar = car;
			return this;
		}
		/*render:function() {
			for(var i = 0; i < this.bots.length; ++i)
			{
				this.bots[i].debug();
			}
		}*/
	})
	
	

	return {
		init:function($parent, o){
			game = new Phaser.Game(o.map.width, o.map.height, Phaser.AUTO, $parent[0]);
			game.state.add('game', GameState, true)
				.setUserCar(o.car)
				.loadMap(o.map);
		},
		destroy: function(){
			if(game)
			{
				game.destroy();
				game = null;
			}
		}
	}
})