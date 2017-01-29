var MIN_DISTANCE = 400;
var MAX_DISTANCE = 700;

var MAX_FISH_COUNT = 10;

var FADE_DURATION = 1500;

var MIN_TRANSLATION_DURATION = 4000;
var MAX_TRANSLATION_DURATION = 6000;

var MAX_DIFF_ANGLE = 35; // degrees 

var PICTURES = ["img/fish3.png"];

$(document).ready(function() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	console.log("width:"+windowWidth + " height:"+windowHeight);

	var createFunc = function() {
		createFish(windowWidth, windowHeight, createFunc);
	}

	for (var i = 0; i < MAX_FISH_COUNT; i++) {
		createFish(windowWidth, windowHeight, createFunc);
	};
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

function createFish(windowWidth, windowHeight, onFinish) {

	var x = randomInt(0, windowWidth);
	var y = randomInt(0, windowHeight);
	console.log("widthPlace:"+x+" heightPlace"+y);


	var pictureIndex = randomInt(0, PICTURES.length-1);
	var picturePath = PICTURES[pictureIndex];
	console.log("name:"+picturePath);

	var mirrored = randomBoolean();
	var angle = randomInt(-MAX_DIFF_ANGLE, MAX_DIFF_ANGLE);
	console.log("angle" + angle);
	var computedAngle = angle < 0 ? 360 + angle : angle;
	console.log("computedAngle:" + computedAngle);
	var imgWrapper = $('<div />', {
						"class" : "fish",
						css : {
							"position" : "absolute",
							"top" : y,
							"left" : x
						}
					}).append($('<img />', {
						"src" : picturePath,
						"alt" : "fish",
						css : {
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
		left : "+=" + dX +"px",
		top	: "+="+ dY + "px"
	}, {
		duration: translateDuration,
		queue: false,
		complete: onFinish
	});
}




