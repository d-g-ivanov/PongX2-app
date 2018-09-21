/************* GENERAL *************/
//disable default events
function disableEvent(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	evt.stopImmediatePropagation();
}
//get index of child within parent
function getChildNumber(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}
/***********************************/
//horizontal navigation to fiven screen
function goto(screen) {
	//screen move
	var where = screen || event.target.getAttribute('data-where') || null;
	var destination = where ? document.querySelector('.' + where) : '';
	var newScreen = destination ? parseInt( destination.getAttribute('data-place') ) : 0;

	if (where) {
		//handle ads
		if ( !displayAdsOnScreenChange(where) ) return;
		
		//slide to new screen
		screens.forEach(function(screen){
			screen.style.transform = 'translate3d(' + ( ( parseInt( screen.getAttribute('data-place') ) - newScreen ) * 100) + '%, 0, 0)';
			screen.classList.remove('active');
		});
		setTimeout(function(){
			destination.classList.add('active');
		}, 700);
		destination.scrollTop = 0;
		
		//slide background
		var game = document.getElementById('game');
		var newX = -(newScreen * screens[0].getBoundingClientRect().width);
		game.style.backgroundPosition = newX + 'px 0';
	} else {
		return;
	}
}
/********* MENU NAVIGATION *********/
//handling menugroup events
function actionPicker(event) {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	//screen move
	goto();
	//action
	var action = event.target.getAttribute('data-action');
	if (action) {
		window[action](event);
	}
}
//display sub menu
function displaySubmenu(event) {
	event.preventDefault();
	event.stopPropagation();
	//toggle hamburger
	var mbuttons = document.querySelectorAll('.menu_icon');
	var submenu = document.querySelector('.submenu');
	//change button status
	mbuttons.forEach(function(mbutton){
		mbutton.classList.toggle('open');
	});
	//toggle submenu
	submenu.classList.toggle('active');
	//pause/start game
	settings.paused = !settings.paused;
}
//resume game button
function resumeGame() {
	event.preventDefault();
	event.stopPropagation();
	//hide submenu
	var submenu = document.querySelector('.submenu');
	submenu.classList.remove('active');
	//reset player menu button
	var mbuttons = document.querySelectorAll('.menu_icon');
	mbuttons.forEach(function(mbutton){
		mbutton.classList.remove('open');
	});
	//pause/start game
	settings.paused = !settings.paused;
}
//restart game
function restartGame() {
	event.preventDefault();
	event.stopPropagation();
	//toggle hamburger
	var mbuttons = document.querySelectorAll('.menu_icon');
	var submenu = document.querySelector('.submenu');
	//change button status
	mbuttons.forEach(function(mbutton){
		mbutton.classList.toggle('open');
	});
	//toggle submenu
	submenu.classList.toggle('active');
	//actual game restart
	startGame();
}
//turn to classic game
function toggleClassic(event) {
	event.preventDefault();
	event.stopPropagation();
	var screen = document.querySelector('.gameScreen');
	var toggle = getChildNumber(event.target) === 2 ? screen.classList.add('classic') : screen.classList.remove('classic');
}
//toggle score details ???????????????????????????
function toggleScoreDetails() {
	event.preventDefault();
	event.stopPropagation();
	var gameOverScreen = document.querySelector('.gameOver');
	gameOverScreen.classList.toggle('scoreDetails');
}
//update game setting state on checkbox state change
function gameSettings_boxes(event){
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	//change setting
	var state = event.target.value;//getAttribute('value');
	
	settings[state] = !settings[state];
}
//update game setting state on radio state change
function gameSettings_radio(event) {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	//change setting
	var state = event.target.value;
	settings.console = state;
	var consoles = document.querySelectorAll('.gameScreen .playerGroup-btn');
	
	consoles.forEach(function(console){
		console.classList.remove('typeA', 'typeB');
		console.classList.add(state);
	});
	
	//update canvas
	activate_canvas(settings.console);
}
//update game setting state on palette state change
function updatePlayerSettings(el) {
	var paddle = el.parentNode.parentNode.parentNode.getAttribute('data-paddle');
	var setting = el.parentNode.parentNode.getAttribute('data-setting');

	settings[setting][ parseInt(paddle) ] = el.getAttribute('data-data');
}
//swatches
function updateSwatches(event) {
	event.preventDefault();
	event.stopPropagation();
	if (event.target.tagName === "LI") {
		//button sound
		btnSound();
		var items = event.target.parentNode.querySelectorAll('li');
		items.forEach(function(item) { item.classList.remove('selected'); });
		
		event.target.classList.add('selected');
		event.target.parentNode.parentNode.classList.remove('drop');
		
		updatePlayerSettings(event.target);
	}
}
//number field increment/decrement
function changeWinPoints() {
	//calculate new win points
	var step = parseInt( this.getAttribute('data-step') );
	var newValue = parseInt(number_field.value) + step;
	
	//check new win points are in range
	newValue < 3 ? newValue = 3 : newValue > 99 ? newValue = 99 : newValue = newValue;
	
	//update win points field
	number_field.value = newValue;
	//update win points settings
	settings.winPoints = newValue;
}
//button click sound
function btnSound() {
	event.preventDefault();
	event.stopPropagation();
	
	btn_sound.play();
}
//background sound toggle
function bg_sound_toggle() {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	this.checked ? bg_sound.play() : bg_sound.pause();
}
//paddle bounce sound
function paddleSound() {
	if (!settings.audioPlayed) {
		paddle_sound.play();
		settings.audioPlayed = true;
	}
	setTimeout(function(){
		settings.audioPlayed = false;
	},100);
}
//paddle bounce sound
function wallSound() {
	wall_sound.play();
}
//game submenu
function toggleSubmenu(event) {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	var parentEl = event.target.parentNode.parentNode;
	
	parentEl.querySelector('.drop') && parentEl.querySelector('.drop') !== event.target.parentNode ? parentEl.querySelector('.drop').classList.remove('drop') : '';
	
	event.target.parentNode.classList.toggle('drop');
}
/***********************************/


/********* GAME RELATED *********/
//game loop
function gameLoop() {
	if (!settings.paused) {
		if (paddle1.score === settings.winPoints || paddle2.score === settings.winPoints) {
			ctx.clearRect(20, height/2 + 5, 100, 80);
			ctx.clearRect(20, height/2 - 85, 100, 80);
			drawScore();
			setTimeout(gameOver, 50);
		} else {
			//prep canvas
			ctx.clearRect(0, 0, width, height);
			drawCourtCenter();
			drawScore();
			//calc new positions
			paddle1.move();
			paddle2.move();
			ball.move();
			if (settings.balls) ball2.move();
			//draw new positions
			paddle1.draw();
			paddle2.draw();
			ball.draw();
			if (settings.balls) ball2.draw();
			//powers
			if (settings.powerups) {
				if ( settings.powers.length < 1 && Utils.rand(0,10000) > 9990 ) {
					var power = new Parts.Power( settings.powerTypes[Utils.rand(0,3)] );
					settings.powers.push(power);
				}
				if (settings.powers.length > 0) {
					for (var i = settings.powers.length - 1; i >= 0; --i) {
						if (settings.powers[i].delete) {
							settings.powers.splice(i, 1);
						} else {
							settings.powers[i].move();
							settings.powers[i].draw();
						}
					}
				}
			}
		}
	}
	//loop if needed
	if (settings.isPlaying) requestAnimationFrame(gameLoop);
}
//game start
function startGame() {
	document.getElementById('start').style.display = 'none';
	var game = document.querySelector('.gameScreen');
	game.classList.contains('classic') ? settings.classic = true : settings.classic = false;
	//initiate game entities
	paddle1 = new Parts.Paddle( width/2 - paddleWidth/2, height - paddleHeight*3, paddleWidth, paddleHeight, settings.paddleColors[0]);
	paddle2 = new Parts.Paddle( width/2 - paddleWidth/2, paddleHeight*2, paddleWidth, paddleHeight, settings.paddleColors[1]);
	ball = new Parts.Ball( (width/2) - 5, (height/2) - 5, ballSize);
	ball2 = new Parts.Ball( (width/2) + 5, (height/2) + 5, ballSize, 5, -6);

	//start game loop
	settings.isPlaying = true;
	settings.paused = false;
	requestAnimationFrame(gameLoop);
	
	//start time counting
	settings.startTime = new Date().getTime();
}


// Convert keycodes to directions
var directions = {
	37: "goingLeft",
	38: "goingUp",
	39: "goingRight",
	40: "goingDown"
};
var directions2 = {
	87: "goingUp", //W
	68: "goingRight", //D
	83: "goingDown", //S
	65: "goingLeft" //A
};

// The keydown handler for handling direction key presses
function keyDownHandler(event) {
    if(event.keyCode in directions) {
        paddle1.pressed = true;
		event.keyCode === 37 || event.keyCode === 39 ? paddle1.action[0] = directions[event.keyCode] : paddle1.action[1] = directions[event.keyCode];
    }
    else if(event.keyCode in directions2) {
        paddle2.pressed = true;
		event.keyCode < 80 ? paddle2.action[0] = directions2[event.keyCode] : paddle2.action[1] = directions2[event.keyCode];
    }
}

function keyUpHandler(event) {
    if(event.keyCode in directions) {
        paddle1.pressed = false;
		event.keyCode === 37 || event.keyCode === 39 ? paddle1.action[0] = null : paddle1.action[1] = null;
    }
    else if(event.keyCode in directions2) {
        paddle2.pressed = false;
		event.keyCode < 80 ? paddle2.action[0] = null : paddle2.action[1] = null;
    }
}

// Game consoles
function btnDownHandler(event) {
	if (settings.isPlaying && !settings.paused) {
		var player = this.parentElement.id;
		var button = event.target;
		if (button.tagName !== "BUTTON") {
			while ((button = button.parentElement) && (button !== null) && button.tagName !== "BUTTON");
		}
		
		var newDirection = button.getAttribute('data-direction'); 
		window[player].pressed = true;
		newDirection === 'goingLeft' || newDirection === 'goingRight' ? window[player].action[0] = newDirection : window[player].action[1] = newDirection;
	}
}

function btnUpHandler(event) {
    if (settings.isPlaying && !settings.paused) {
		var player = this.parentElement.id;
		var button = event.target;
		if (button.tagName !== "BUTTON") {
			while ((button = button.parentElement) && (button !== null) && button.tagName !== "BUTTON");
		}
		
		var newDirection = button.getAttribute('data-direction'); 
		window[player].pressed = false;
		newDirection === 'goingLeft' || newDirection === 'goingRight' ? window[player].action[0] = null : window[player].action[1] = null;
	}
}

/***********************************/




/********* ACTIVATE EVENTS *********/
/*screens*/
//screen buttons and navigation
var menuGroups = document.querySelectorAll('.screen button');
menuGroups.forEach(function(btn){
	if ( !btn.getAttribute('data-direction') ) {
		//btn.addEventListener('click', actionPicker);
		Utils.onEvent(btn, 'click tap', actionPicker);
	}
});

/*settings*/
//onchange event for checkboxes
var checkboxes = document.querySelectorAll('.screen input[type="checkbox"]');
checkboxes.forEach(function(check){
	//check.addEventListener('change', gameSettings_boxes);
	Utils.onEvent(check, 'change', gameSettings_boxes);
});
//onchange event for radio buttons
var radios = document.querySelectorAll('.screen input[type="radio"]');
radios.forEach(function(rad){
	//rad.addEventListener('change', gameSettings_radio);
	Utils.onEvent(rad, 'change', gameSettings_radio);
});
//number field increase/decrease
var numbers = document.querySelectorAll('.numbers span');
var number_field = document.getElementById('winPoints');
numbers.forEach(function(btn){
	btn.addEventListener('click', changeWinPoints);
});
//swatches click events
document.querySelectorAll('.swatches').forEach(function(swatch) {
	//swatch.addEventListener('click', updateSwatches);
	Utils.onEvent(swatch, 'click touchend', updateSwatches);
});

//sounds
var sound = document.getElementById('sound'); // bg sound toggle button
sound.addEventListener('change', bg_sound_toggle);

var bg_sound = document.getElementById('background_sound'); //background sound control
bg_sound.volume = 0.3;

var btn_sound = document.getElementById('button_press'); //button click/tap sound control
btn_sound.volume = 0.3;

var paddle_sound = document.getElementById('paddle_bounce'); //paddle bump sound control
paddle_sound.volume = 0.3;

var wall_sound = document.getElementById('wall_bounce'); // wall bump sound control
wall_sound.volume = 0.3;

/*game screen submenu*/
//open game settings to display swatches open
document.querySelectorAll('.menu_button').forEach(function(menu) {
	//menu.addEventListener('click', toggleSubmenu, false);
	Utils.onEvent(menu, 'click touchend', toggleSubmenu);
});

/*in-game events*/
//keypresses to move the snake
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//click/touch of player buttons to move the snake
var playerGroups = document.querySelectorAll('.playerGroup-btn button');
playerGroups.forEach(function(btn){
	if (btn.classList.contains('menu_icon')) {
		//btn.addEventListener('click', displaySubmenu, true);
		Utils.onEvent(btn, 'click touchend', displaySubmenu);
	} else {
		//btn.addEventListener('click', onButtonMove, true);
		Utils.onEvent(btn, 'click touchstart', btnDownHandler);
		Utils.onEvent(btn, 'click touchend', btnUpHandler);
	}
});
/***********************************/


















