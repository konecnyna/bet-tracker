var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var base_url = "";
var schedule_url = "http://www.fantasyfootballnerd.com/service/schedule/json/ejwqdwezs7xi/";
var DEBUG = false;


module.exports = {
  getStreams: function (callback, type) {
  	getStreams(callback, type);
  }
};


function getStreams(callback, type){
	var games = [];
	var result = [];
	var gameRegex = /Game Thread/;
	resolveTypeUrl(type);

	var startTime = new Date().getTime();
	utils.downloadFileSSL(base_url + ".json", function(json){
		posts = JSON.parse(json);
		//console.log("Total Time Subreddit download: " + ( (new Date().getTime() - startTime)/1000));

		for(var i=0; i<posts.data.children.length; i++){
			var currentPost = posts.data.children[i];
			if(gameRegex.test(currentPost.data.title)){
				games.push(currentPost);
			}
		}
		runParallel(callback,games, startTime);
	});
}

function getVLCLinksFromPost(post){
  var links = [];
  var m3u8_links = [];
	var regex = /m3u8/;
	var youTubeRegex = /https:\/\/.*youtu?.[^\s]+/;
	var linkRegex = /(http:\/\/.*m3u8)/g;
  var all_links = /(?:http[^\s]+)/g;
	var startTime = new Date().getTime();

	for(var i=0; i<post.length; i++){
		for(var j=0; j<post[i].data.children.length; j++){
			var comment = post[i].data.children[j].data;
      if(all_links.test(comment.body)){
				matches = comment.body.match(all_links);
				if(!matches){
					continue;
				}

				for(var matchIndex = 0; matchIndex < matches.length; matchIndex++){
					if(matches[matchIndex].length > 0){
            if(youTubeRegex.test(comment.body) || youTubeRegex.test(comment.body)){
              m3u8_links.push(matches[matchIndex]);
            }else{
              links.push(matches[matchIndex].replace(")","").replace(/\*/g,''));
            }

					}
				}
			}
		}
	}

	return {
    all_links: links,
    kodi_links: m3u8_links
  }
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
			var json_url = post_url.slice(0, item.data.url.length-1) + ".json?limit=30";
			utils.downloadFileSSL(json_url, function(data){
				var post = JSON.parse(data);
				var streamLinks = getVLCLinksFromPost(post);
				var info = {
					game : item.data.title,
					links : streamLinks,
					reddit_url : post_url,
					err_msg : ((streamLinks.length === 0) ? "No streams" : "")
				};
				result.push(info);
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
			var streamLinks = getVLCLinksFromPost(post);
			var info = {
				game : item.data.title,
				links : streamLinks,
				err_msg : ((streamLinks.length === 0) ? "No streams" : "")
			};
			result.push(info);
			callback();
		});
	}, function done() {
		//console.log("Total Time: " + ( (new Date().getTime() - startTime)/1000));
	  	callback(result);
	});
}

function resolveTypeUrl(type){
	if(type === "nfl"){
		base_url = "https://www.reddit.com/r/nflstreams";
	}else if(type === "mlb"){
		base_url = "https://www.reddit.com/r/mlbstreams";
	}else if(type === "nhl"){
		base_url = "https://www.reddit.com/r/nhlstreams";
	}else if(type === "nba"){
		base_url = "https://www.reddit.com/r/nbastreams";
	}else{
		base_url = "https://www.reddit.com/r/nflstreams";
	}
}
