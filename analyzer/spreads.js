const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

ColumnEnum = {
  moneyLine: 0,
  team: 1,
  openSpread: 3,
  closeSpreadThurs: 8,
  closeSpread: 12,
};

String.prototype.sanitize = function() {
  return this.trim().replace("½", ".5").replace("pk", "0");
};

module.exports = class Spreads {
  async getSpreads(week) {
    if (!week) {
      throw new Error("No week passed to spreads");
    }
    const $ = await this.loadPage(week);
    const lookup = objectFlip(MAP);
    const gameData = {};
    $("table.collapsable").each((i, item) => {
      const table = $(item);
      const rows = table.children().eq(1).children();
      rows.each((i, item) => {
        const row = $(item).children();
        const team = row.eq(ColumnEnum.team).text().trim();

        const spreadOpen = row.eq(ColumnEnum.openSpread).text();
        let spread = row.eq(ColumnEnum.closeSpread).text().trim();
        if (!spread || !spread.length) {
          spread = row.eq(ColumnEnum.closeSpreadThurs).text();
        }

        gameData[lookup[team]] = {
          spreadOpen: spreadOpen.sanitize(),
          spreadClose: spread.sanitize(),
          spreadDiff: `${parseFloat(spread.sanitize()) - parseFloat(spreadOpen.sanitize())}`
        };
      });
    });
    
    if (JSON.stringify(gameData) === JSON.stringify({})) {
      // throw new Error("Error parsing spreads");
    }
    return gameData;
  }

  async loadPage(week, override) {
    const name = `./data/week_${week}_spread_data_2019.html`;
    if (fs.existsSync(name) && !override) {
      console.log("Loading from cache...");
      return cheerio.load(fs.readFileSync(name));
    }

    console.log("Loading picks from web...");
    const options = {
      uri: `https://picksfootball.com/PointSpreadMoves.aspx?WeekID=${week + 4}`,
      transform: body => {
        fs.writeFileSync(name, body);
        return cheerio.load(body);
      },
    };
    const html = await request.get(options);
    return html;
  }
};

const MAP = {
  GB: "Packers",
  CHI: "Bears",
  ATL: "Falcons",
  MIN: "Vikings",
  WAS: "Redskins",
  PHI: "Eagles",
  BUF: "Bills",
  NYJ: "Jets",
  BAL: "Ravens",
  MIA: "Dolphins",
  SF: "49ers",
  TB: "Buccaneers",
  KC: "Chiefs",
  JAC: "Jaguars",
  TEN: "Titans",
  CLE: "Browns",
  LAR: "Rams",
  CAR: "Panthers",
  DET: "Lions",
  ARI: "Cardinals",
  CIN: "Bengals",
  SEA: "Seahawks",
  IND: "Colts",
  LAC: "Chargers",
  NYG: "Giants",
  DAL: "Cowboys",
  PIT: "Steelers",
  NE: "Patriots",
  HOU: "Texans",
  NO: "Saints",
  DEN: "Broncos",
  OAK: "Raiders",
};

const objectFlip = obj => {
  const ret = {};
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key;
  });
  return ret;
};