var MIN_DISTANCE = 400;
var MAX_DISTANCE = 700;

var MAX_FISH_COUNT = 10;

var FADE_DURATION = 1500;

var MIN_TRANSLATION_DURATION = 6000;
var MAX_TRANSLATION_DURATION =  10000;

var MAX_DIFF_ANGLE = 35; // degrees

var PICTURES = ["img/fish3.png"];

var WINDOW_WIDTH = $(window).width();
var WINDOW_HEIGHT = $(window).height();

var MIN_DATA_DEPTH = 0.20;
var MAX_DATA_DEPTH = 1.00;

var MIN_SCALE = 0.2;
var MAX_SCALE = 0.53;

var MIN_DELAY_BEFORE_APPEARANCE = 530;
var MAX_DELAY_BEFORE_APPEARANCE = 2000;

$(document).ready(function() {

	fishes = [];
	for(var i = 0; i < MAX_FISH_COUNT; ++i) {
		fishes.push(new Fish(i));
	}

	var scene = $("#scene");

	fishes.forEach(function(fish) {
		fish.randomFishInit();
		fish.generateBrandNewHtml(scene);
		var onFinishCall = function(fishfish) {
			fishfish.randomFishInit();
			fishfish.invalidateExistingHtml(scene);
			scene.parallax('updateLayers');
			console.log("Inner: " + fishfish.fishId + ", outer: " + fish.fishId);

			setTimeout(function() {
				fishfish.animateFish(scene, onFinishCall);
			}, randomInt(MIN_DELAY_BEFORE_APPEARANCE, MAX_DELAY_BEFORE_APPEARANCE)); 
		}
		fish.animateFish(scene, onFinishCall); 
	});	

	scene.parallax();

	var size = {
		'width' : WINDOW_WIDTH,
		'height' : WINDOW_HEIGHT
	}

	$('body').css(size);
	$('.container').css(size);
	$('.background').css(size);
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

function getPercentBetween(from, to, percent) {
	percent /= 100;
	var k = percent / (1 - percent);
	return (from + k * to) / (1 + k);
}

function Fish(fishNum) {
	this.fishId = fishNum.toString();

}

Fish.findLiElement = function(fish, parentElement) {
		return parentElement.find("#" + fish.fishId);
}

Fish.prototype.init = function(x, y, angle, mirrored, src) {
	this.x = x;
	this.y = y;
	this.angle = angle < 0 ? 360 + angle : angle;
	this.mirrored = mirrored;
	this.src = src;
}

Fish.prototype.randomFishInit = function() {

	this.init(randomInt(0, WINDOW_WIDTH),
			  randomInt(0, WINDOW_HEIGHT),
			  randomInt(-MAX_DIFF_ANGLE, MAX_DIFF_ANGLE),
			  randomBoolean(),
			  PICTURES[randomInt(0, PICTURES.length-1)]);
}

Fish.prototype.invalidateExistingHtml = function(parentElement) {

	var percent = randomInt(0, 100);
	var scaleFish = getPercentBetween(MIN_SCALE,MAX_SCALE,percent);

	var dataDepthFish = getPercentBetween(MIN_DATA_DEPTH, MAX_DATA_DEPTH, percent);

	var liElement = Fish.findLiElement(this, parentElement);
	liElement.attr("data-depth", dataDepthFish);
	liElement.css({
		"z-index" : Math.round(dataDepthFish * 100)
	});
	liElement.find("div")
		.css({
			"top": this.y,
			"left": this.x
		});
	liElement.find("div>img")
		.attr("src", this.src)
		.css({
			"transform": "scale(" + scaleFish +")" +
						(this.mirrored ? " scale(-1, 1)" : "") +
						" rotate(" + this.angle + "deg)",
		});
}

Fish.prototype.generateBrandNewHtml = function(parentElement) {

	var percent = randomInt(0, 100);
	var scaleFish = getPercentBetween(MIN_SCALE,MAX_SCALE,percent);

	var dataDepthFish = getPercentBetween(MIN_DATA_DEPTH, MAX_DATA_DEPTH, percent);

	var imgWrapper = $('<div />', {
				"class" : "fish",
				"css" : {
					"position" : "absolute",
					"top" : this.y,
					"left" : this.x,
					"display": "none"
				}
			}).append($('<img />', {
				"src" : this.src,
				"alt" : "fish",
				"css" : {
					"transform": "scale(" + scaleFish +")" +
								(this.mirrored ? " scale(-1, 1)" : "") +
								" rotate(" + this.angle + "deg)",
					// "animation" : moveFish + 5 + "s" + "infinite"
				}
			}));

	$('<li />', {
			"id" : this.fishId,
			"class" : "layer",
			"data-depth" : dataDepthFish,
			"css" : {
				"z-index" : Math.round(dataDepthFish * 100)
			}
	})
	.append(imgWrapper)
	.appendTo(parentElement);
}

Fish.prototype.animateFish = function(parentElement, onFinish) {

	var dX = randomInt(MIN_DISTANCE, MAX_DISTANCE);
	var dY = -dX * Math.tan(degToRad(this.angle));

	if (!this.mirrored) {
		dX *= -1;
	}
	var translateDuration = randomInt(MIN_TRANSLATION_DURATION, MAX_TRANSLATION_DURATION);

	var findLi = Fish.findLiElement(this, parentElement);

	var imgWrapper = findLi.find("div");

	imgWrapper.fadeIn({
		duration: FADE_DURATION,
	})
	.delay(translateDuration - FADE_DURATION*2)
	.fadeOut({
		duration: FADE_DURATION,
	});

	var self = this;

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


