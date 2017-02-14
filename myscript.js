var MIN_DISTANCE = 400;
var MAX_DISTANCE = 700;

var MAX_FISH_COUNT = 10;

var FADE_DURATION = 1500;

var MIN_TRANSLATION_DURATION = 6000;
var MAX_TRANSLATION_DURATION =  10000;

var MAX_DIFF_ANGLE = 35; // degrees

var PICTURES = ["img/fish13.png"];
var EASING = ["easeOutSine", "easeInSine" , "easeOutQuad",
			  "easeOutCubic", "easeInCirc", "easeOutCirc",
			  "easeInOutBounce", "easeInBounce", "easeOutBounce"];

var WINDOW_WIDTH = $(window).width();
var WINDOW_HEIGHT = $(window).height();

var MIN_DATA_DEPTH = 0.20;
var MAX_DATA_DEPTH = 1.00;

var MIN_SCALE = 0.2;
var MAX_SCALE = 0.53;

var MIN_DELAY_BEFORE_APPEARANCE = 500;
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


			fishfish.animateFish(scene, onFinishCall); 
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

	var supportedFlag = $.keyframe.isSupported();
	console.log(supportedFlag);

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
	this.fishImgElement;
	this.fishImgWrapper;
	this.fishLi;
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

Fish.prototype.generateBrandNewHtml = function(parentElement) {

	var percent = randomInt(0, 100);
	var scaleFish = getPercentBetween(MIN_SCALE,MAX_SCALE,percent);

	var dataDepthFish = getPercentBetween(MIN_DATA_DEPTH, MAX_DATA_DEPTH, percent);

	this.fishImgElement = $('<img />', {
				"class" : "img-fish",
				"src" : this.src,
				"alt" : "fish",
				"css" : {
					"transform": "scale(" + scaleFish +")" +
								(this.mirrored ? " scale(-1, 1)" : "") +
								" rotate(" + this.angle + "deg)"		
					}
				});

	this.fishImgWrapper = $('<div />', {
				"class" : "fish",
				"css" : {
					"position" : "absolute",
					"top" : this.y,
					"left" : this.x,
					"display": "none"
				}
			}).append(this.fishImgElement);

	this.fishLi = $('<li />', {
			"id" : this.fishId,
			"class" : "layer",
			"data-depth" : dataDepthFish,
			"css" : {
				"z-index" : Math.round(dataDepthFish * 100)
			}
	})
	.append(this.fishImgWrapper);
	this.fishLi.appendTo(parentElement);
}

Fish.prototype.invalidateExistingHtml = function(parentElement) {

	var percent = randomInt(0, 100);
	var scaleFish = getPercentBetween(MIN_SCALE,MAX_SCALE,percent);

	var dataDepthFish = getPercentBetween(MIN_DATA_DEPTH, MAX_DATA_DEPTH, percent);

	this.fishLi.attr("data-depth", dataDepthFish);
	this.fishLi.css({
		"z-index" : Math.round(dataDepthFish * 100)
	});
	this.fishImgWrapper
		.css({
			"top": this.y,
			"left": this.x
		});
	this.fishImgElement
		.attr("src", this.src)
		.css({
			"transform": "scale(" + scaleFish +")" +
						(this.mirrored ? " scale(-1, 1)" : "") +
						" rotate(" + this.angle + "deg)",
		});
}

Fish.prototype.animateFish = function(parentElement, onFinish) {

	var dX = randomInt(MIN_DISTANCE, MAX_DISTANCE);
	var dY = -dX * Math.tan(degToRad(this.angle));	

	if (!this.mirrored) {
		dX *= -1;
	}
	var translateDuration = randomInt(MIN_TRANSLATION_DURATION, MAX_TRANSLATION_DURATION);

	var self = this;

	$.keyframe.define([{
	    'name': 'new',
	    '0%': {"transform": "rotateY(0deg)"},
	    '50%': {"transform": "rotateY(30deg)"},
	    '100%': {"transform": "rotateY(0deg)"}
	}]);

	this.fishImgElement.playKeyframe({
	    name: 'new', // name of the keyframe you want to bind to the selected element
	    duration: '3s', // [optional, default: 0, in ms] how long you want it to last in milliseconds
	    timingFunction: 'linear', // [optional, default: ease] specifies the speed curve of the animation
	    delay: '0s', //[optional, default: 0s]  how long you want to wait before the animation starts
	    iterationCount: 'infinite', //[optional, default:1]  how many times you want the animation to repeat
	    direction: 'normal', //[optional, default: 'normal']  which direction you want the frames to flow
	    fillMode: 'forwards' //[optional] Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
});

	this.fishImgWrapper.fadeIn({
		duration: FADE_DURATION,
	})
	.delay(translateDuration - FADE_DURATION*2)
	.fadeOut({
		duration: FADE_DURATION,
	});

	this.fishImgWrapper.animate({
		left : "+="+ dX +"px",
		top : "+="+ dY + "px"
	}, {
		duration: translateDuration,
		easing : EASING[randomInt(0, EASING.length-1)],
		queue: false,
		complete: function() {
			onFinish(self);
		}
	});


	
}


