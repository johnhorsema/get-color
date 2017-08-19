var express = require('express');
var fs = require('fs');
var app = express();
var Vibrant = require('node-vibrant')

function generateCircle(color){
	return '<div style="display: inline-block; border-radius: 5rem; width: 20px; height: 20px; background-color: rgb('+ color +')"></div>';
}

function imgTag(path){
	return '<img style="width: 100px; height: auto" src="source/'+path+'">';
}

app.use('/source', express.static('source'));

app.get('/', function(req, res){
	var tasks = [];
	fs.readdir('source', function(err, items) {
	    for (var i=0; i<items.length; i++) {
	        var v = new Vibrant('source/'+items[i], {});
	        tasks.push(v.getPalette());
	    }
	    Promise.all(tasks).then(function(palettes){
			var final_res = palettes.reduce(function(acc, palette, idx){
				console.log('processing: '+idx+'/'+items.length);
				var vibrant_color = palette['Vibrant']['_rgb'];
				var l_vibrant_color = palette['LightVibrant']['_rgb'];
				var d_vibrant_color = palette['DarkVibrant']['_rgb'];
				var muted_color = palette['Muted']['_rgb'];
				var l_muted_color = palette['LightMuted']['_rgb'];
				var d_muted_color = palette['DarkMuted']['_rgb'];
				return acc + '<tr><td>'+ imgTag(items[idx]) +'</td><td>' + generateCircle(vibrant_color)+generateCircle(l_vibrant_color)+generateCircle(d_vibrant_color)+generateCircle(muted_color)+generateCircle(l_muted_color)+generateCircle(d_muted_color)+'</td></tr>';
			},'');
			res.send('<table><tbody>'+final_res+'</tbody></table>');
		});
	});
});

app.listen(3000);