var MIN_DISTANCE = 400;
var MAX_DISTANCE = 700;

var MAX_FISH_COUNT = 10;

var FADE_DURATION = 1500;

var MIN_TRANSLATION_DURATION = 6000;
var MAX_TRANSLATION_DURATION = 8000;

var MAX_DIFF_ANGLE = 35; // degrees 

var PICTURES = ["img/fish3.png"];

var WINDOW_WIDTH = $(window).width();
var WINDOW_HEIGHT = $(window).height();


$(document).ready(function() {

	// var scene =  $('#scene');

	for(var i = 0; i < MAX_FISH_COUNT; i++) {
		var fish = new Fish();
		fish.generateBrandNewHtml('#scene');
		var onFinishCall = function() {
		concole.log("onFinishCall Start");

			fish.randomFishInit();
			fish.invalidateExistingHtml('#scene');
			fish.animateFish('#scene', onFinishCall);
		console.log("onFinishCall end");

		}
		fish.animateFish(scene, onFinishCall);
	}

	$('#scene').parallax();

});

function randomInt(from, to)  {  
    return Math.floor(Math.random() * (to - from + 1)) + from;  
} 

function randomBoolean() {
	return Math.random() < 0.5;
}

function degToRad(deg) {
	return deg * Math.PI/180;
}

function Fish() {
	this.fishId = Date.now();

	this.randomFishInit = function() {

		this.init(randomInt(0, WINDOW_WIDTH),
				  randomInt(0, WINDOW_HEIGHT),
				  randomInt(-MAX_DIFF_ANGLE, MAX_DIFF_ANGLE),
				  randomBoolean(),
				  PICTURES[randomInt(0, PICTURES.length-1)]);		  
	}

	this.init = function(x, y, angle, mirrored, src) {
		this.x = x;
		this.y = y;
		this.angle = angle < 0 ? 360 + angle : angle;
		this.mirrored = mirrored;
		this.src = src;
	}


	this.invalidateExistingHtml = function(parentElement) {
		console.log("invalidate HTML Start");

		var liElement = findLiElement(parentElement); 
		liElement.find("div")
			.css({
				"top": this.y,
				"left": this.x
			});
		liElement.find("div>img")
			.attr("src", this.src)
			.css({
				"transform": "scale(0.4)" +
				(this.mirrored ? " scale(-1, 1)" : "") +
				" rotate(" + this.angle + "deg)",
			});
		console.log("invalidate HTML end");

	}

	this.generateBrandNewHtml = function(parentElement) {
		console.log("generate HTML Start");
		var imgWrapper = $('<div />', {
					"class" : "fish",
					"css" : {
						"position" : "absolute",
						"top" : this.y,
						"left" : this.x
					}
				}).append($('<img />', {
					"src" : this.src,
					"alt" : "fish",
					"css" : {
						"transform": "scale(0.4)" +
						(this.mirrored ? " scale(-1, 1)" : "") +
						" rotate(" + this.angle + "deg)",
					}
				}));

		imgWrapper.hide();

		$('<li />', {
				"id" : this.fishId,
				"class" : "layer",
				"data-depth" : "1.00"				
		})
		.append(imgWrapper)
		.appendTo(parentElement);
		console.log("generate HTML end");

	}

	this.animateFish = function(parentElement, onFinish) {
		console.log("animate HTML Start");

		var dX = randomInt(MIN_DISTANCE, MAX_DISTANCE);
		var dY = -dX * Math.tan(degToRad(this.angle));

		if (!this.mirrored) {
			dX *= -1;
		}

		var translateDuration = randomInt(MIN_TRANSLATION_DURATION, MAX_TRANSLATION_DURATION);

		var imgWrapper = findLiElement(parentElement).find("div");

		console.log(imgWrapper);

		imgWrapper.fadeIn({
			duration: FADE_DURATION,
		})
		.delay(translateDuration - FADE_DURATION*2)
		.fadeOut({
			duration: FADE_DURATION,
		});

		imgWrapper.animate({
			left : "+="+ dX +"px",
			top : "+="+ dY + "px"
		}, {
			duration: translateDuration,
			queue: false,
			complete: onFinish
		});
		console.log("animate HTML end");

	}

	var findLiElement = function(parentElement) {
		return $(parentElement).find("#" + this.fishId); 
	}
}





