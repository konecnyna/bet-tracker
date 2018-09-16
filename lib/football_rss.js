var RSS = require("rss");
var games = require("./games.js");

module.exports = {
  getFootballRss: function(callback) {
    footballRss(callback);
  }
};

function footballRss(callback) {
  var feed = new RSS({
    title: "Football Scores"
  });

  games.getUIData(function(data) {
    var games = data[0];
    for (var i = 0; i < games.length; i++) {
      var title_str =
        games[i].hnn +
        ": " +
        games[i].hs +
        " vs " +
        games[i].vnn +
        ": " +
        games[i].vs;
      feed.item({
        title: "     " + title_str + "     "
      });
    }

    var xml = feed.xml();
    callback(xml);
  });
}
