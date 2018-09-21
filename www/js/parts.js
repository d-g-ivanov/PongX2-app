var Parts = (function Parts(){
	var publicAPI;
	
	/****************************************************************/
	
	/* THE PADDLE ONCTRUCTOR */
	var Paddle = function Paddle(x, y, w, h, color) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.speed = 8;
		this.color = color || 'white';
		this.score = 0;
		this.paddle = this.y > width/2 ? 'bottom' : 'top';
		this.moving = [null, null];
		//actions
		this.pressed = false;
		this.action = [null, null];
	}

	Paddle.prototype.move = function move() {
		//move paddle
		if (this.pressed && this.action) {
			if ( this.action[0] === 'goingLeft' ) {
				this.goingLeft();
			} else if ( this.action[0] === 'goingRight' ) {
				this.goingRight();
			}
			
			if ( this.action[1] === 'goingUp' ) {
				this.goingUp();
			} else if ( this.action[1] === 'goingDown' ) {
				this.goingDown();
			}
		} else if (!this.pressed) {
			this.moving[0] = null;
			this.moving[1] = null;
		}
		//check wall collision
		if (this.checkWallCollision()) {
			//top-bottom
			if (this.y <= 0) {
				this.y = 0;
			} else if (this.y >= height - this.height) {
				this.y = height - this.height;
			}
			//left-right
			if (this.x <= 0) {
				this.x = 0;
			} else if (this.x + this.width >= width) {
				this.x = width - this.width;
			}
		}
	}

	Paddle.prototype.draw = function draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	Paddle.prototype.goingUp = function() {
		this.y -= this.speed;
		this.moving[1] = 'up';
		
		if (this.paddle === 'bottom') {
			this.y > height/2 ? this.y = this.y : this.y = height/2;
		}
	}

	Paddle.prototype.goingDown = function() {
		this.y += this.speed;
		this.moving[1] = 'down';
		
		if (this.paddle === 'top') {
			this.y < height/2 - this.height ? this.y = this.y : this.y = height/2 - this.height;
		}
	}

	Paddle.prototype.goingLeft = function() {
		this.x -= this.speed;
		this.moving[0] = 'left';
	}

	Paddle.prototype.goingRight = function() {
		this.x += this.speed;
		this.moving[0] = 'right';
	}

	Paddle.prototype.checkWallCollision = function() {
		var topWall = (this.y <= 0);
		var bottomWall = (this.y + this.height >= height);
		var leftWall = (this.x <= 0);
		var rightWall = (this.x + this.width >= width);
		var wallCollision = topWall || bottomWall || leftWall || rightWall;
		return wallCollision;
	}
	
	/* THE BALL CONTRUCTOR */
	var Ball = function Ball(x, y, size, speedX, speedY) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.speedX = speedX || 5;
		this.speedY = speedY || 6;
		this.accel = 8;
	}

	Ball.prototype.move = function move() {
		//change x and y values to move
		this.x += this.speedX;
		this.y += this.speedY;
		
		//collisions
		var paddle = this.speedY > 0 ? paddle1 : paddle2;
		
		if (this.checkPaddleCollision(paddle)) {
			this.speedY *= -1;
			//add spin if needed
			if (paddle.moving[0] === 'left') {
				this.speedX = this.speedX * (this.speedX < 0 ? 0.8 : 1.2);
			} else if (paddle.moving[0] === 'right') {
				this.speedX = this.speedX * (this.speedX > 0 ? 0.8 : 1.2);
			}
			//limit x speed to range between -12 and 12
			if (this.speedX < -12 || this.speedX > 12) this.speedX < -12 ? this.speedX = -12 : this.speedX = 12;
			if (this.speedX > -1 && this.speedX < 1) this.speedX <= 0 ? this.speedX = -1.5 : this.speedX = 1.5;
			//y accel if needed
			/*if (paddle.moving[1] === 'up') {
				this.speedY = this.speedY * (this.speedY < 0 ? 0.5 : 1.5); console.log(this.speedY);
			} else if (paddle.moving[1] === 'down') {
				this.speedY = this.speedY * (this.speedY > 0 ? 0.5 : 1.5); console.log(this.speedY);
			}*/
			//play paddle bounce sound
			paddleSound();
		}
		
		if (this.checkWallCollision()) {
			//top-bottom
			if (this.y <= 0) {
				this.speedY *= -1;
				paddle1.score++;
			} else if (this.y + this.size >= height) {
				this.speedY *= -1;
				paddle2.score++;
			}
			//left-right
			if (this.x <= 0) {
				this.speedX *= -1;
			} else if (this.x + this.size >= width) {
				this.speedX *= -1;
			}
			//play wall bounce sound
			wallSound();
		}
	}

	Ball.prototype.draw = function draw() {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}

	Ball.prototype.checkPaddleCollision = function checkPaddleCollision(paddle) {
		var collided;
		//towards bottom paddle (paddle1) - top surface
		if (this.speedY > 0) {
			collided = 	(this.y + this.size > paddle.y && this.y < paddle.y + paddle.height) && 
						(this.x + this.size > paddle.x) &&
						(this.x < paddle.x + paddle.width);
		}
		//towards top paddle (paddle2) - top surface
		if (this.speedY < 0) {
			collided = 	(this.y < paddle.y + paddle.height && this.y + this.size > paddle.y) &&
						(this.x + this.size > paddle.x) &&
						(this.x < paddle.x + paddle.width);
		}
		
		return collided;
	}

	Ball.prototype.checkWallCollision = function checkWallCollision() {
		var topWall = this.y <= 0;
		var bottomWall = this.y + this.size >= height;
		var leftWall = this.x <= 0;
		var rightWall = this.x + this.size >= width;
		return topWall || bottomWall || leftWall || rightWall;
	}

	Ball.prototype.accelerate = function accelerate(x, y, dx /*speedx*/, dy /*speedy*/, accel, dt) {
	  var x2  = x + (dt * dx) + (accel * dt * dt * 0.5);
	  var y2  = y + (dt * dy) + (accel * dt * dt * 0.5);
	  var dx2 = dx + (accel * dt) * (dx > 0 ? 1 : -1);
	  var dy2 = dy + (accel * dt) * (dy > 0 ? 1 : -1);
	  return { nx: (x2-x), ny: (y2-y), x: x2, y: y2, dx: dx2, dy: dy2 };
	}	
	
	/* THE POWERS CONTRUCTOR */
	var Power = function Power(options) {
		this.x = Utils.rand(2, width-2);
		this.y = height/2;
		this.size = 10;
		this.speedX = Utils.rand(-7,7, true);
		var y_speed = Utils.rand(-8,8, true);
		this.speedY = y_speed < 0 && y_speed >= -2 ? y_speed - 4 : y_speed > 0 && y_speed <=2 ? y_speed + 4 : y_speed;
		this.options = options.split(' ');
		this.delete = false;
	}

	Power.prototype.move = function move() {
		//change x and y values to move
		this.x += this.speedX;
		this.y += this.speedY;
		
		//collisions
		var paddle = this.speedY > 0 ? paddle1 : paddle2;
		
		if (this.checkPaddleCollision(paddle)) {
			this.delete = true;
			this[this.options[1]](paddle);
		}
		
		if (this.checkWallCollision()) {
			//top-bottom
			if (this.y <= 0) {
				this.speedY *= -1;
			} else if (this.y + this.size >= height) {
				this.speedY *= -1;
			}
			//left-right
			if (this.x <= 0) {
				this.speedX *= -1;
			} else if (this.x + this.size >= width) {
				this.speedX *= -1;
			}
		}
	}

	Power.prototype.draw = function draw() {
		ctx.fillStyle = this.options[0];
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}

	Power.prototype.checkPaddleCollision = function checkPaddleCollision(paddle) {
		var collided;
		//towards bottom paddle (paddle1) - top surface
		if (this.speedY > 0) {
			collided = 	(this.y + this.size > paddle.y && this.y < paddle.y + paddle.height) && 
						(this.x + this.size > paddle.x) &&
						(this.x < paddle.x + paddle.width);
		}
		//towards top paddle (paddle2) - top surface
		if (this.speedY < 0) {
			collided = 	(this.y < paddle.y + paddle.height && this.y + this.size > paddle.y) &&
						(this.x + this.size > paddle.x) &&
						(this.x < paddle.x + paddle.width);
		}
		
		return collided;
	}

	Power.prototype.checkWallCollision = function checkWallCollision() {
		var topWall = this.y <= 0;
		var bottomWall = this.y + this.size >= height;
		var leftWall = this.x <= 0;
		var rightWall = this.x + this.size >= width;
		return topWall || bottomWall || leftWall || rightWall;
	}

	Power.prototype.increaseSize = function(paddle) {
		paddle.width += 20;
		console.log('increaseSize');
		setTimeout(function() {
			var paddle = this;
			paddle.width -= 20;
		}.bind(paddle),15000);
	}

	Power.prototype.decreaseSize = function(paddle) {
		paddle.width -= 20;
		console.log('decreaseSize');
		setTimeout(function() {
			var paddle = this;
			paddle.width += 20;
		}.bind(paddle),15000);
	}

	Power.prototype.increaseSpeed = function(paddle) {
		paddle.speed += 3;
		console.log('increaseSpeed');
		setTimeout(function() {
			var paddle = this;
			paddle.speed -= 3;
		}.bind(paddle),15000);
	}

	Power.prototype.decreaseSpeed = function(paddle) {
		paddle.speed -= 3;
		console.log('decreaseSpeed');
		setTimeout(function() {
			var paddle = this;
			paddle.speed += 3;
		}.bind(paddle),15000);
	}
	
	
	/****************************************************************/
	
	publicAPI = {
		Paddle: Paddle,
		Ball: Ball,
		Power: Power
	};
	
	return publicAPI;
})();