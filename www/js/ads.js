var admobid = null;
var isTesting = false; //change to false when done

if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
  admobid = {
    banner: '',
    interstitial: '',
    rewardvideo: '',
  }
}

//ad functions
function prepBanner(e, stopLoader) {
	if(!stopLoader) showAdLoader();
	
	admob.banner.config({
		id: admobid.banner,
		isTesting: isTesting,
		autoShow: true,
	});
	admob.banner.prepare();
}

function prepInterstitial(e, stopLoader) {
	if(!stopLoader) showAdLoader();
	
	admob.interstitial.config({
		id: admobid.interstitial,
		isTesting: isTesting,
		autoShow: true,
	});
	admob.interstitial.prepare();
}

function prepVideo(e, stopLoader) {
	if(!stopLoader) showAdLoader();
	
	admob.rewardvideo.config({
		id: admobid.rewardvideo,
		isTesting: isTesting,
		autoShow: true,
	});
	admob.rewardvideo.prepare();
}

//handle in-game adds
function displayAdsOnScreenChange(screen) {
	if (screen === 'gameOver' && admob) {
		prepInterstitial(null, 'stop loader'); //stop loader
	}
	
	return true;
}

//loader for ads
function showAdLoader() {
	var loader = document.querySelector('.loadingScreen');
	loader.classList.add('active');
	loader.classList.add('adLoader');
}

function removeAdLoader() {
	var loader = document.querySelector('.loadingScreen');
	loader.classList.remove('active');
	setTimeout( function() { loader.classList.remove('adLoader'); }, 100);
}

/* ad events */
//on load complete
document.addEventListener('admob.interstitial.events.OPEN', function(event) {
  var currentScreen = document.querySelector('#game .screen.active');
  
  if ( currentScreen.classList.contains('adsScreen') ) {
	removeAdLoader();
  }
});

//on load fail
document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
  var currentScreen = document.querySelector('#game .screen.active');
  
  if ( currentScreen.classList.contains('adsScreen') ) {
	removeAdLoader();
	
	if (event.error >= 0) alert('We seem to be unable to load the ad. Please check your internet connection and try again. We are sorry for the trouble and appreciate your willingness to help us!');
	//else alert(JSON.stringify(event, null, 4));
  }
});

//opened
var adViews = 0;
var msgs = [
	'We are very grateful to you!<br>Check out another one, if you\'d like. Every little bit helps!',
	'It is a pleasure for us to have created something for you! We are humbled and excited to try and come up with other ideas to entertain you.',
	'You are spoiling us now (but feel free not to stop :) )! We cannot thank you enough.',
	'Thank you for your generosity! you just gave us one of the highest ratings for our efforts we could ever hope for.',
	'You are awesome! A big thank you for supporting us. Now, go and enjoy yourselves with a fun game of Pong.'
];
document.addEventListener('admob.interstitial.events.OPEN', function(event) {
	document.querySelector('.adsScreen p').innerHTML = msgs[adViews] || "Wow! You just made our day by taking a common courtesy to an uncommon level. We are so grateful for your help!<br><br>Now, really... go and enjoy youselves!";
	
	adViews++;
	settings.adsViewed = true;
});

// deviceready event
document.addEventListener('deviceready', function() {
	console.log('device is ready');
}, false);





















