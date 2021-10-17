var express = require("express");
var path = require("path");
var games = require("./lib/games.js");
const request = require('request-promise');
var path = require("path");
var ROOT_NAME = "/bet-tracker";

const URL = `https://project-3654207232474154346.firebaseio.com/bet-tracker/games.json`

function BetTracker(app) {
  console.log("*********************************************************");
  console.log("Running as default route:", ROOT_NAME);
  console.log("*********************************************************");

  app.use(ROOT_NAME, express.static(path.join(__dirname, "lib/public")));

  app.get(ROOT_NAME + "/api/v1/scores", async (req, res) => {
    const options = {
      url: "http://home-remote-api.herokuapp.com/bets/open",
      json: true,
    };
    const body = await request.get(options)
    const bets = body || [];
    games.getUIData(function (callback) {
      res.json(callback);
    }, [bets.map(({ pick, risk, spread }) => {
      if (!pick) { return null }
      if (!spread) { spread = 0; }
      const split = pick.split(" ");
      const bet = {}
      bet[split[split.length - 1]] = {
        spread: spread,
        risk: risk
      }
      return bet;
    }).filter(it => it)]);
  });
}

module.exports = BetTracker;
