var utils = require("./utils.js");
var util = require("util");
var async = require("async");
var fs = require("fs");
var path = require("path");
var base_url = "";
var schedule_url =
  "http://www.fantasyfootballnerd.com/service/schedule/json/ejwqdwezs7xi/";
var DEBUG = false;
var regex = /m3u8/;
var youTubeRegex = /https:\/\/.*youtu?.[^\s]+/;
var aceRegex = /acestream:\/\/\w+/;
var linkRegex = /([a-z]+[:.]\S+m3u8)/g;
var linkDescRegex = /([a-z]+[:.]\S+m3u8)/;
var all_links = /(?:http[^\s]+)/g;

module.exports = {
  getStreams: function(callback, type) {
    getStreams(callback, type);
  }
};

function getStreams(callback, type) {
  var games = [];
  var result = [];
  var gameRegex = /Game Thread/;
  resolveTypeUrl(type);

  var startTime = new Date().getTime();
  utils.downloadFileSSL(base_url + ".json", function(json) {
    posts = JSON.parse(json);

    for (var i = 0; i < posts.data.children.length; i++) {
      var currentPost = posts.data.children[i];
      if (gameRegex.test(currentPost.data.title)) {
        games.push(currentPost);
      }
    }
    runParallel(callback, games, startTime);
  });
}

function getVLCLinksFromPost(post) {
  var links = [];
  var m3u8_links = [];
  var startTime = new Date().getTime();

  for (var i = 0; i < post.length; i++) {
    for (var j = 0; j < post[i].data.children.length; j++) {
      var comment = post[i].data.children[j].data;
      if (all_links.test(comment.body)) {
        matches = comment.body.match(all_links);
        if (!matches) {
          continue;
        }
        populateLinks(matches, comment, links, m3u8_links);

        aces = comment.body.match(aceRegex);
        if (!aces) {
          continue;
        }
        m3u8_links.push({
          link: aces[0],
          desc: aces[0]
        });
      }
    }
  }

  return {
    all_links: links.sort(),
    kodi_links: m3u8_links
  };
}

function populateLinks(matches, comment, links, m3u8_links) {
  for (var matchIndex = 0; matchIndex < matches.length; matchIndex++) {
    if (matches[matchIndex].length > 0) {
      if (youTubeRegex.test(comment.body) || youTubeRegex.test(comment.body)) {
        m3u8_links.push({
          link: matches[matchIndex],
          desc: matches[matchIndex]
        });
      } else {
        if (linkDescRegex.test(comment.body)) {
          var linkDescMatch = comment.body.match(linkDescRegex);
          if (linkDescMatch.length > 4) {
            links.push({
              link: linkDescMatch[4],
              desc: linkDescMatch[2].replace(")", "").replace(/\*/g, "")
            });
          }
        } else {
          var linkMatch = matches[matchIndex]
            .replace(")", "")
            .replace(/\*/g, "");
          links.push({
            link: linkMatch,
            desc: linkMatch
          });
        }
      }
    }
  }
}

function runParallel(webCallback, items, startTime) {
  var asyncTasks = [];
  var result = [];

  items.forEach(function(item) {
    asyncTasks.push(function(callback) {
      var post_url = item.data.url;
      var json_url =
        post_url.slice(0, item.data.url.length - 1) + ".json?limit=30";
      utils.downloadFileSSL(json_url, function(data) {
        var post = JSON.parse(data);
        var streamLinks = getVLCLinksFromPost(post);
        var info = {
          game: item.data.title,
          links: streamLinks,
          reddit_url: post_url,
          err_msg: streamLinks.length === 0 ? "No streams" : "",
          err_link: streamLinks.length === 0 ? base_url : ""
        };
        result.push(info);
        callback();
      });
    });
  });

  asyncTasks.push(function(callback) {
    callback();
  });

  async.parallel(asyncTasks, function() {
    console.log("Total Time: " + (new Date().getTime() - startTime) / 1000);
    if (result.length === 0) {
      webCallback({
        err_link: base_url
      });
    } else {
      webCallback(result);
    }
  });
}

function runAsync(callback, games, startTime) {
  var result = [];
  async.eachSeries(
    games,
    function iterator(item, callback) {
      var post_url = item.data.url;
      var json_url = post_url.slice(0, item.data.url.length - 1) + ".json";

      utils.downloadFileSSL(json_url, function(data) {
        var post = JSON.parse(data);
        var streamLinks = getVLCLinksFromPost(post);
        var info = {
          game: item.data.title,
          links: streamLinks,
          err_msg: streamLinks.length === 0 ? "No streams" : ""
        };
        result.push(info);
        callback();
      });
    },
    function done() {
      callback(result);
    }
  );
}

function resolveTypeUrl(type) {
  if (type === "nfl") {
    base_url = "https://www.reddit.com/r/nflstreams";
  } else if (type === "mlb") {
    base_url = "https://www.reddit.com/r/mlbstreams";
  } else if (type === "nhl") {
    base_url = "https://www.reddit.com/r/nhlstreams";
  } else if (type === "nba") {
    base_url = "https://www.reddit.com/r/nbastreams";
  } else if (type === "mma") {
    base_url = "https://www.reddit.com/r/MMAStreams";
  } else {
    base_url = "https://www.reddit.com/r/nflstreams";
  }
}
