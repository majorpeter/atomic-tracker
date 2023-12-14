import { Express } from "express";
import { getForecast } from "../lib/weatherapi";
import { isLoggedInMiddleware } from "./auth";
import { Api } from "../lib/api";

export default function (app: Express) {
  app.get<{}, Api.Weather.type>(
    Api.Weather.path,
    isLoggedInMiddleware,
    async (_, res) => {
      const fc = await getForecast();
      if (fc) {
        res.send({
          temp_celsius: fc.temp,
          weather_symbol: fc.symbol,
        });
      } else {
        res.send({});
      }
    }
  );
}
