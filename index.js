var express = require('express');
var fs = require('fs');
var app = express();
var Vibrant = require('node-vibrant');
var getColors = require('get-image-colors');

var port = process.env.PORT || 8080;

function generateCircle(color){
	return '<div style="display: inline-block; border-radius: 5rem; width: 20px; height: 20px; background-color: rgb('+ color +')"></div>';
}

function imgTag(path){
	return '<img style="width: 100px; height: auto" src="source/'+path+'">';
}

app.use('/source', express.static('source'));

app.get('/getcolor', function (req, res, next) {
	var id = req.query.url;
	var tasks = [];
	var res_json = {};

	var v = new Vibrant(id, {});
    tasks.push(v.getPalette());
    tasks.push(getColors(id));

    Promise.all(tasks).then(function(colors){
    	var vibrants = Object.keys(colors[0]).map(function(a){
    		return colors[0][a]['_rgb'];
    	});
    	var normals = colors[1].map(function(a){
    		return a['_rgb'];
    	});
    	res.send({
    		vibrants: vibrants,
    		normals: normals
    	});
    });
});

app.listen(port);