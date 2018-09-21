/*(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },	timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		}
	};
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
})();*/

var Utils = (function Utils(){
	var publicAPI;
	
	/****************************************************************/
	//image loader object
	var imageLoader = {
		loaded:true,
		loadedImages:0,
		totalImages:0,
		load:function(url){
			this.totalImages++;
			this.loaded = false;
			var image = new Image();
			image.src = url;
			image.onload = function(){
				imageLoader.loadedImages++;
				if(imageLoader.loadedImages === imageLoader.totalImages){
					imageLoader.loaded = true;
				}
			}
			return image;
		}
	};
	//supported audio format checker
	var loader = {
		loaded:true,
		loadedCount:0, // Assets that have been loaded so far
		totalCount:0, // Total number of assets that need to be loaded
		init:function(){
			// check for sound support
			var mp3Support,oggSupport;
			var audio = document.createElement('audio');
			if (audio.canPlayType) {
				// Currently canPlayType() returns: "", "maybe" or "probably"
				mp3Support = "" != audio.canPlayType('audio/mpeg');
				oggSupport = "" != audio.canPlayType('audio/ogg; codecs = "vorbis"');
			} else {
				//The audio tag is not supported
				mp3Support = false;
				oggSupport = false;
			}
			// Check for ogg, then mp3, and finally set soundFileExtn to undefined
			loader.soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;
		}
	};
	//variable set interval function
	var setVariableInterval = function(callbackFunc, timing) {
	  var variableInterval = {
		interval: timing,
		callback: callbackFunc,
		stopped: false,
		runLoop: function() {
		  if (variableInterval.stopped) return;
		  var result = variableInterval.callback.call(variableInterval);
		  if (typeof result == 'number')
		  {
			if (result === 0) return;
			variableInterval.interval = result;
		  }
		  variableInterval.loop();
		},
		stop: function() {
		  this.stopped = true;
		  window.clearTimeout(this.timeout);
		},
		start: function() {
		  this.stopped = false;
		  return this.loop();
		},
		loop: function() {
		  this.timeout = window.setTimeout(this.runLoop, this.interval);
		  return this;
		}
	  };

	  return variableInterval;
	};
	//draw circle
	var circle = function (x, y, radius, fillCircle) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		if (fillCircle) {
			ctx.fill();
		} else {
			ctx.stroke();
		}
	};
	//pick random number between 2 numbers, can exclude zero
	function rand(min, max, excludeZero) {
		var excludeZero = excludeZero || false;
		var num = Math.floor(Math.random()*(max-min+1)+min);
		if (excludeZero) {
			num === 0 ? num = rand(min, max, excludeZero) : num = num; 
		}
		return num;
	}
	
	//add multiple events
	function addListenerMulti(element, eventNames, listener) {
	  var events = eventNames.split(' ');
	  for (var i=0, iLen=events.length; i<iLen; i++) {
		element.addEventListener(events[i], listener, false);
	  }
	}
	//set events
	function onEvent(elem,evtNames,handler) {
		// elem not passed?
		if (!handler) {
			handler = evtNames;
			evtNames = elem;
			elem = document;
		}

		evtNames = evtNames.split(" ");
		for (var i=0; i<evtNames.length; i++) {
			elem.addEventListener(evtNames[i],handler,/*capturing=*/false);
		}
	}
	//remove events
	function offEvent(elem,evtNames,handler) {
		// elem not passed?
		if (!handler) {
			handler = evtNames;
			evtNames = elem;
			elem = document;
		}

		evtNames = evtNames.split(" ");
		for (var i=0; i<evtNames.length; i++) {
			elem.removeEventListener(evtNames[i],handler,/*capturing=*/false);
		}
	}
	//debounce function to slow down firing
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
	};
};
	/****************************************************************/
	
	publicAPI = {
		imageLoader: imageLoader,
		loader: loader,
		setVariableInterval: setVariableInterval,
		circle: circle,
		rand: rand,
		addListenerMulti: addListenerMulti,
		onEvent: onEvent,
		offEvent: offEvent,
		debounce: debounce
	}
	
	return publicAPI;
})();