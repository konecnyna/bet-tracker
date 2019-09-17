const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const processor = new (require("./processor"))();

module.exports = class Picks {
  async getPicks(week, override = false) {
    const $ = await this.loadPage(week, override);
    return this.parsePicks($);
  }

  parsePicks($) {
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
      const result = this.parseGameKey(
        $(item).text().trim().replace(/\s\s+/g, " ")
      );
      game["result"] = result;
    } else if (column == 1) {
      const { spread, team } = this.parseSpread($(item).text().trim());
      game["spread"] = spread;
      game["spreadTeam"] = team;
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
      result["winner"] = result.awayScore > result.homeScore ? result.awayTeam : result.homeTeam;
    }

    return result;
  }

  async loadPage(week, override) {
    const name = `./data/week_${week}_2019.html`;
    if (fs.existsSync(name) && !override) {
      console.log("Loading from cache...");
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
