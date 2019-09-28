const request = require("request-promise");
const fs = require("fs");

global.requestCachePromise = (options, name, override) => {
  if (fs.existsSync(name) && !override) {
    console.log("Loading from cache...");
    return JSON.parse(fs.readFileSync(name));
  }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      fs.writeFileSync(name, JSON.stringify(body), { flag: "wx" });
      resolve(body);
    });
  });
};

module.exports = class Weather {
  async getWeatherForWeek(week) {
    const name = `${__dirname}/../data/weather_week_${week}_2019.json`;
    const options = {
      url: `https://www.fantasyfootballnerd.com/service/weather/json/6eb6ua9srbfm/`,
      json: true,
    };
    return await requestCachePromise(options, name, false);
  }
};
