// Get window dimensions and ratios
var wW = window.innerWidth;
var wH = window.innerHeight;
var paddleRatio = 80/600;
var width, height, paddleWidth, paddleHeight = 15, ballSize;

// Set up canvas
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

//re-work canvas function
function activate_canvas(console_type) {
	var canvas = document.getElementsByTagName('canvas')[0];
	
	// Get the width and height from the canvas element
	if (console_type === 'typeA') {
		player_console = 260;
		height = window.innerHeight - player_console;
		width = wW - 30;
	} else {
		player_console = 240;
		width = window.innerWidth - player_console;
		height = wH - 30;
	}
	
	//set width and height
	canvas.width = width;
	canvas.height = height;
	
	//set other needed variables
	paddleWidth = width * paddleRatio;
	ballSize = paddleWidth / 6;
}

// Draw field center
var drawCourtCenter = function() {
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 8;
	//center
	ctx.beginPath();
	ctx.moveTo(0, height/2);
	ctx.lineTo(width, height/2);
	ctx.stroke();
	
	//to dashed
	//ctx.setLineDash([20, 15]);
	ctx.lineWidth = 5;
	// left vertical
	ctx.beginPath();
	ctx.moveTo(width*0.2, 0);
	ctx.lineTo(width*0.2, height);
	ctx.stroke();
	
	// right vertical
	ctx.beginPath();
	ctx.moveTo(width*0.8, 0);
	ctx.lineTo(width*0.8, height);
	ctx.stroke();
	
	// top horizontal
	ctx.beginPath();
	ctx.moveTo(width*0.2, height*0.25);
	ctx.lineTo(width*0.8, height*0.25);
	ctx.stroke();
	
	// bottom horizontal
	ctx.beginPath();
	ctx.moveTo(width*0.2, height*0.75);
	ctx.lineTo(width*0.8, height*0.75);
	ctx.stroke();
}

// Draw the score in the top-left corner
var drawScore = function () {
	ctx.font = "120px bulky";
	ctx.fillStyle = "rgba(68, 68, 68, 0.4)";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(paddle1.score, 20, height/2 + 5);
	ctx.textBaseline = "bottom";
	ctx.fillText(paddle2.score, 20, height/2 - 5);
};

// Game settings
var settings = {
	audioPlayed: false,
	//game tracking
	isPlaying: false,
	paused: false,
	console: 'typeA',
	startTime: null,
	endTime: null,
	timePlayed: null,
	//game settings
	paddleColors: [null, null],
	balls: false,
	powerups: false,
	winPoints: 11,
	//power-ups and -downs
	powers: [],
	powerTypes: ['green increaseSize', 'red decreaseSize', 'blue increaseSpeed', 'yellow decreaseSpeed']
}

// Clear the interval and display Game Over text
var gameOver = function () {
	//stop time counting
	settings.endTime = new Date().getTime();
	settings.timePlayed = settings.endTime - settings.startTime;
	//gameover text
	ctx.font = "150px bulky";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over", width / 2, (height - 201) / 2);
	//update scores
	setTimeout(updateScore, 1000);
	//display play button again
	document.getElementById('start').style.display = 'block';
	//stop playing
	settings.isPlaying = false;
};

//update score screen
function updateScore() {
	//get scores
	var scores = calculateScores();
	//set scores
	for (score_place in scores) {
		document.querySelector('.' + score_place + ' .result').innerHTML = scores[score_place];
	}
	//display scores
	goto('gameOver');
}
function calculateScores() {
	var scorescreen = document.querySelector('.gameOver');
	var gameScores = {
		time_played: null,
		final_score: null,
		//fun_details: null
	};
	//calculate time played
	var hours = ((settings.timePlayed / (1000*60*60)) % 60);
	var minutes = ((settings.timePlayed / (1000*60)) % 60);
	var seconds = (settings.timePlayed / 1000) % 60 ;
	gameScores.time_played = settings.time = (Math.floor(hours) < 10 ? ('0' + Math.floor(hours)) : Math.floor(hours)) + ':' + (Math.floor(minutes) < 10 ? ('0' + Math.floor(minutes)) : Math.floor(minutes)) + ':' + (Math.floor(seconds) < 10 ? ('0' + Math.floor(seconds)) : Math.floor(seconds));
	//calculate total apples
	gameScores.final_score = paddle1.score + ' : ' + paddle2.score;
	//return the scores object
	return gameScores;
}

// Create the snake and apple object variables
var paddle1;
var paddle2;
var ball;
var ball2;