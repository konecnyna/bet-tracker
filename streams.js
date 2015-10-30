var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var base_url = "https://www.reddit.com/r/nflstreams";
var schedule_url = "http://www.fantasyfootballnerd.com/service/schedule/json/ejwqdwezs7xi/";
var DEBUG = false;


module.exports = {
  getStreams: function (callback) {
  	getStreams(callback);
  }
};


function getStreams(callback){
	var games = [];
	var result = [];
	var startTime = new Date().getTime();
	utils.downloadFileSSL(base_url + ".json", function(json){
		posts = JSON.parse(json);
		for(var i=0; i<posts.data.children.length; i++){
			var currentPost = posts.data.children[i];
			if(currentPost.data.link_flair_text == "Game Thread"){
				games.push(currentPost);
			}
		}
		runParallel(callback,games, startTime);
	});	
}

function getVLCLinksFromPost(post){
	var links = [];
	var regex = /m3u8/;
	//var linkRegex = /(http:\/\/[\w-]+\.[\w-]+[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])/g;
	var linkRegex = /(http:\/\/.*m3u8)/g;
	

	for(var i=0; i<post.length; i++){
		for(var j=0; j<post[i].data.children.length; j++){
			var comment = post[i].data.children[j].data;
			if(regex.test(comment.body)){
				matches = comment.body.match(linkRegex);
				for(var matchIndex =0; matchIndex<matches.length; matchIndex++){
					if(matches[matchIndex].length > 0){
						links.push(matches[matchIndex]);		
					}			
				}				
			}
		}
	}
	return links;
}

function runParallel(webCallback, items, startTime){
	// Array to hold async tasks
	var asyncTasks = [];
	var result = [];

	// Loop through some items
	items.forEach(function(item){
		// We don't actually execute the async action here
		// We add a function containing it to an array of "tasks"
		asyncTasks.push(function(callback){
			// Call an async function, often a save() to DB
			var post_url = item.data.url;
			var json_url = post_url.slice(0, item.data.url.length-1) + ".json";
			console.log("Starting download for : " + item.data.title);
			utils.downloadFileSSL(json_url, function(data){
				var post = JSON.parse(data);
				var info = {
					game : item.data.title,
					links : getVLCLinksFromPost(post)
				};
				result.push(info);
				console.log("Finished download for : " + item.data.title);	  	
				callback();
			});
		});
	});
	 
	asyncTasks.push(function(callback){
		callback();	
	});
	 
	async.parallel(asyncTasks, function(){
		console.log("Total Time: " + ( (new Date().getTime() - startTime)/1000));			
	  	webCallback(result);	  
	});
}

function runAsync(callback, games, startTime){	
	var result = [];
	async.eachSeries(games, function iterator(item, callback) {		  
	  	var post_url = item.data.url;
	  	var json_url = post_url.slice(0, item.data.url.length-1) + ".json";

	  	utils.downloadFileSSL(json_url, function(data){
			var post = JSON.parse(data);
			var info = {
				game : item.data.title,
				links : getVLCLinksFromPost(post)
			};
			result.push(info);
			callback();
		});
	}, function done() {
		console.log("Total Time: " + ( (new Date().getTime() - startTime)/1000));			
	  	callback(result);
	});	
}