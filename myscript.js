var MIN_DISTANCE = 400;
var MAX_DISTANCE = 700;

var MAX_FISH_COUNT = 10;

var FADE_DURATION = 1500;

var MIN_TRANSLATION_DURATION = 6000;
var MAX_TRANSLATION_DURATION = 10000;

var MAX_DIFF_ANGLE = 35; // degrees 

var PICTURES = ["img/fish3.png"];

var WINDOW_WIDTH = $(window).width();
var WINDOW_HEIGHT = $(window).height();


$(document).ready(function() {

	// var scene =  $('#scene');


	for(var i = 0; i < MAX_FISH_COUNT; i++) {
		var fish = new Fish();
		fish.randomFishInit();
		fish.generateBrandNewHtml('#scene');
		var onFinishCall = function(fishfish) {
			console.log("onFinishCall " + fishfish.fishId);
			fishfish.randomFishInit();
			fishfish.invalidateExistingHtml('#scene');
			fishfish.animateFish('#scene', onFinishCall);
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
	var self = this;

	self.fishId = Date.now();

	self.randomFishInit = function() {

		self.init(randomInt(0, WINDOW_WIDTH),
				  randomInt(0, WINDOW_HEIGHT),
				  randomInt(-MAX_DIFF_ANGLE, MAX_DIFF_ANGLE),
				  randomBoolean(),
				  PICTURES[randomInt(0, PICTURES.length-1)]);		  
	}

	self.init = function(x, y, angle, mirrored, src) {
		self.x = x;
		self.y = y;
		self.angle = angle < 0 ? 360 + angle : angle;
		self.mirrored = mirrored;
		self.src = src;
	}


	self.invalidateExistingHtml = function(parentElement) {
		
		var liElement = findLiElement(parentElement); 
		liElement.find("div")
			.css({
				"top": self.y,
				"left": self.x
			});
		liElement.find("div>img")
			.attr("src", self.src)
			.css({
				"transform": "scale(0.4)" +
				(this.mirrored ? " scale(-1, 1)" : "") +
				" rotate(" + self.angle + "deg)",
			});

	}

	self.generateBrandNewHtml = function(parentElement) {
		var imgWrapper = $('<div />', {
					"class" : "fish",
					"css" : {
						"position" : "absolute",
						"top" : self.y,
						"left" : self.x
					}
				}).append($('<img />', {
					"src" : self.src,
					"alt" : "fish",
					"css" : {
						"transform": "scale(0.4)" +
						(self.mirrored ? " scale(-1, 1)" : "") +
						" rotate(" + self.angle + "deg)",
					}
				}));

		imgWrapper.hide();

		$('<li />', {
				"id" : self.fishId,
				"class" : "layer",
				"data-depth" : "1.00"				
		})
		.append(imgWrapper)
		.appendTo(parentElement);
	}

	self.animateFish = function(parentElement, onFinish) {

		var dX = randomInt(MIN_DISTANCE, MAX_DISTANCE);
		var dY = -dX * Math.tan(degToRad(self.angle));

		if (!self.mirrored) {
			dX *= -1;
		}

		var translateDuration = randomInt(MIN_TRANSLATION_DURATION, MAX_TRANSLATION_DURATION);

		var findLi = findLiElement(parentElement);

		var imgWrapper = findLi.find("div");

		console.log("found Li: " + findLi.attr('id'));

		imgWrapper.fadeIn({
			duration: FADE_DURATION,
			complete: function() {
				console.log("fadein complete fishId " + self.fishId);
			}
		})
		.delay(translateDuration - FADE_DURATION*2)
		.fadeOut({
			duration: FADE_DURATION,
			complete: function() {
				console.log("fadeout complete fishId " + self.fishId);
			}
		});


		imgWrapper.animate({
			left : "+="+ dX +"px",
			top : "+="+ dY + "px"
		}, {
			duration: translateDuration,
			queue: false,
			complete: function() {
				onFinish(self);
			}
		});

	}


	var findLiElement = function(parentElement) {
		return $(parentElement).find("#" + self.fishId); 
	}
}





