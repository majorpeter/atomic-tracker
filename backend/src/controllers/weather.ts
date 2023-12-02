import { Express } from "express";
import { getForecast } from "../lib/weatherapi";
import { Api } from "../lib/api";

export default function (app: Express) {
  //TODO loggedin assert and user location
  app.get<{}, Api.Weather.type>(Api.Weather.path, async (req, res) => {
    const fc = await getForecast();
    if (fc) {
      res.send({
        temp_celsius: fc.temp,
        weather_symbol: fc.symbol,
      });
    } else {
      res.sendStatus(500);
    }
  });
}
