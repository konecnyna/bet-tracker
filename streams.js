var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var base_url = "http://www.reddit.com/r/nflstreams";
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
	utils.downloadFile(base_url + ".json", function(json){
		posts = JSON.parse(json);
		for(var i=0; i<posts.data.children.length; i++){
			var currentPost = posts.data.children[i];
			if(currentPost.data.link_flair_text == "Game Thread"){
				games.push(currentPost);
			}
		}

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
		  	callback(result);
		});		
	});	
}

function getVLCLinksFromPost(post){
	var links = [];
	var regex = /m3u8/;
	var linkRegex = /(http:\/\/[\w-]+\.[\w-]+[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

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