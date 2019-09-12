const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const analyzer = new (require("./analyzer"))();

module.exports = class Picks {
  async getPicks() {
    const $ = await this.loadPage();
    this.parsePicks($);
  }

  parsePicks($) {
    const $tableRows = $("#oddsTable tr").first();
    $tableRows.each((i, item) => {
      this.parseRow($, item);
    });
  }

  parseRow($, item) {
    $(".gameLineCtr").each((i, item) => {
      //console.log($(item).text());
    });

    // 1 game info 8 picks
    let column = 0;
    const test = [];

    let game = {
      picks: [],
    };
    $('[width="60"]').each((i, item) => {
      if (i > 10 && i < 160) {
        if (column == 0) {
          const result = this.parseGameKey(
            $(item).text().trim().replace(/\s\s+/g, " ")
          );          
          game["result"] = result;
        } else if (column == 1) {
          const { spread, team } = this.parseSpread($(item).text().trim());
          game["spread"] = spread;
          game["favoredTeam"] = team;
        } else {
          game.picks.push($(item).text().trim());
        }

        if (column > 8) {
          column = 0;
          if (game.result.winner) {
            analyzer.analyzeResult(game);
          }
          test.push(game);
          game = {
            picks: [],
          };          
        } else {
          column++;
        }
      }
    });

    // console.log(test);
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
    if (key.includes("RECAP")) {
      const split = key.split(" ");
      const result = {
        awayTeam: split[0],
        homeTeam: split[2],
        awayScore: parseInt(split[3]),
        homeScore: parseInt(split[5]),
      };

      result["winner"] = result.awayScore > result.homeScore ? result.awayTeam : result.homeTeam;
      return result;
    }

    return {};
  }

  async loadPage(override) {
    const name = "week1.html";
    if (fs.existsSync(name) && !override) {
      return cheerio.load(fs.readFileSync(name));
    }

    const options = {
      uri:
        "https://www.cbssports.com/nfl/features/writers/expert/picks/against-the-spread/1",
      transform: body => {
        fs.writeFileSync(name, body);
        return cheerio.load(body);
      },
    };
    const html = await request.get(options);
    return html;
  }
};
