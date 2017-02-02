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
	

	
	console.log("width:"+windowWidth + " height:"+windowHeight);

	var createFunc = function() {
		createFish(windowWidth, windowHeight, createFunc);
	}

	for (var i = 0; i < MAX_FISH_COUNT; i++) {
		createFish(windowWidth, windowHeight, createFunc);
	};

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

function FishPool() {
	this.pool = [];

	this.getFish = function() {

		if (this.pool.length) {

			var takenFish = this.pool.pop();

			return Fish.randomFishInit(takenFish);
		} else {
			fish = Fish.randomFishInit();
		}
	}

	this.releaseFish = function (fish) {
		this.pool.push(fish);
	}
}

function Fish() {
	this.fishId = Date.now();

	static randomFishInit(fish) {
		if (fish === undefined) {
			fish = new Fish();
		}

		fish.init(randomInt(0, WINDOW_WIDTH,
				  randomInt(0, WINDOW_HEIGHT,
				  randomInt(-MAX_DIFF_ANGLE, MAX_DIFF_ANGLE),
				  randomBoolean(),
				  PICTURES[randomInt(0, PICTURES.length-1)]);
		return fish;		  
	}

	this.init = function(x, y, angle, mirrored, src) {
		this.x = x;
		this.y = y;
		this.angle = angle < 0 ? 360 + angle : angle;
		this.mirrored = mirrored;
		this.src = src;
	}

	this.invalidateExistingHtml = function(parentElement) {
		var liElement = parentElement.find("#" + this.fishId); 
		liElement.find("div")
			.css({
				"top": this.y;
				"left": this.x;
			});
		liElement.find("div>img")
			.attr("src", this.src)
			.css({
				"transform": "scale(0.4)" +
				(this.mirrored ? " scale(-1, 1)" : "") +
				" rotate(" + this.angle + "deg)",
			});
	}

	this.generateBrandNewHtml = function(parentElement) {
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
	}
}

function createFish(windowWidth, windowHeight, onFinish) {

	var x = randomInt(0, windowWidth);
	var y = randomInt(0, windowHeight);

	var picturePath = PICTURES[randomInt(0, PICTURES.length-1)];

	var mirrored = randomBoolean();
	var angle = randomInt(-MAX_DIFF_ANGLE, MAX_DIFF_ANGLE);

	var computedAngle = angle < 0 ? 360 + angle : angle;

	var imgWrapper = $('<div />', {
						"class" : "fish",
						"css" : {
							"position" : "absolute",
							"top" : y,
							"left" : x
						}
					}).append($('<img />', {
						"src" : picturePath,
						"alt" : "fish",
						"css" : {
							"transform": "scale(0.4)" +
							(mirrored ? " scale(-1, 1)" : "") +
							" rotate(" + computedAngle + "deg)",
						}
					}));

	imgWrapper.hide();

	$('<li />', {
		"class" : "layer",
		"data-depth" : "1.00"
	})
	.append(imgWrapper)
	.appendTo("#scene");

	
	var dX = randomInt(MIN_DISTANCE, MAX_DISTANCE);
	var dY = -dX * Math.tan(degToRad(angle));

	if (!mirrored) {
		dX *= -1;
	}

	var translateDuration = randomInt(MIN_TRANSLATION_DURATION, MAX_TRANSLATION_DURATION);

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
}




