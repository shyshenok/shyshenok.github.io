
var PICTURES = ["img/fish1.png",
				"img/fish3.png",
				"img/fish6.png"];

$(document).ready(function() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	console.log("width:"+windowWidth + " height:"+windowHeight);

	var x = random(0, windowWidth);
	var y = random(0, windowHeight);
	console.log("widthPlace:"+x+" heightPlace"+y);


	var pictureIndex = random(0, PICTURES.length-1);
	var picturePath = PICTURES[pictureIndex];
	console.log("name:"+picturePath);

	$('<li />', {
		"class" : "layer",
		"data-depth" : "1.00"
	})
	.append($('<div />', {
		css : {
			"position" : "absolute",
			"top" : y,
			"left" : x
		}
	})
	.append($('<img />', {
		"src" : picturePath,
		"alt" : "fish"
	})))
	.appendTo("#scene");
});

function random(min, max)  {  
    return Math.floor(Math.random() * (max - min + 1)) + min;  
} 

