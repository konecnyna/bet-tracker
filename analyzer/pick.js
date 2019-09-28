const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const spreads = new (require("./spreads"))();
const processor = new (require("./processor"))();

module.exports = class Picks {
  async getPicks(week, override = false) {
    const $ = await this.loadPage(week, override);
    return await this.parsePicks($, week);
  }

  async parsePicks($, week) {
    this.spreadData = await spreads.getSpreads(week);
    const data = this.parseRow($);
    data["analysts_historical"] = processor.getExpertRating($, data);
    data["analysts_overall"] = processor.getOverallExpertRating($);
    return data;
  }

  parseRow($) {
    // 1 game info 8 picks
    let column = 0;
    const data = {
      games: [],
    };

    let game = {
      picks: [],
    };

    $('[width="60"]').each((i, item) => {
      if (i > 10 && i < 172) {
        if (
          column == 0 &&
          !$(item).text().trim().replace(/\s\s+/g, " ").includes("at")
        ) {
          return;
        }
        this.parseGame($, column, item, game);
        if (column > 8) {
          column = 0;
          if (game.result && game.result.winner) {
            processor.analyzeGame(game);
          }
          data.games.push(game);
          game = { picks: [] };
        } else {
          column++;
        }
      }
    });

    return data;
  }

  parseGame($, column, item, game) {
    if (column == 0) {
      const text = $(item).text().trim().replace(/\s\s+/g, " ");
      const result = this.parseGameKey(text);
      game["result"] = result;
    } else if (column == 1) {
      const { spread, team } = this.parseSpread($(item).text().trim());
      game["spread"] = spread;
      game["spreadTeam"] = team;
      if (game.result) {
        const { result } = game;        
        game.spreadData = {};
        game.spreadData[result.awayTeam] = this.spreadData[result.awayTeam];
        game.spreadData[result.homeTeam] = this.spreadData[result.homeTeam];        
      }
    } else {
      game.picks.push($(item).text().trim());
    }

    return game;
  }
  parseSpread(spread) {
    const expiredExpression = /(?<spread>.*\d?\.?\d)(?<team>.*)/g;
    const match = expiredExpression.exec(spread);
    return {
      spread: match.groups.spread.replace("+", ""),
      team: match.groups.team,
    };
  }

  parseGameKey(key) {
    const result = {};
    const split = key.split(" ");
    result.awayTeam = split[0];
    result.homeTeam = split[2];

    if (key.includes("RECAP")) {
      result.awayScore = parseInt(split[3]);
      result.homeScore = parseInt(split[5]);
      result["winner"] =
        result.awayScore > result.homeScore ? result.awayTeam : result.homeTeam;
    }

    return result;
  }

  async loadPage(week, override) {
    const name = `./data/week_${week}_${new Date().getFullYear()}.html`;
    if (fs.existsSync(name) && !override) {
      console.log("Load ing from cache...");
      return cheerio.load(fs.readFileSync(name));
    }

    console.log("Loading picks from web...");
    const options = {
      uri: `https://www.cbssports.com/nfl/features/writers/expert/picks/against-the-spread/${week}`,
      transform: body => {
        fs.writeFileSync(name, body);
        return cheerio.load(body);
      },
    };
    const html = await request.get(options);
    return html;
  }
};
