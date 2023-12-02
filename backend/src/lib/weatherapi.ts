import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";

async function getConfig(): Promise<{
  lat: number;
  lon: number;
}> {
  return JSON.parse(
    (
      await fs.readFile(
        path.resolve(__dirname, "..", "..", "dist", "weather.json")
      )
    ).toString()
  );
}

export type WeatherSymbolCode =
  | "clearsky_day"
  | "clearsky_night"
  | "clearsky_polartwilight"
  | "fair_day"
  | "fair_night"
  | "fair_polartwilight"
  | "lightssnowshowersandthunder_day"
  | "lightssnowshowersandthunder_night"
  | "lightssnowshowersandthunder_polartwilight"
  | "lightsnowshowers_day"
  | "lightsnowshowers_night"
  | "lightsnowshowers_polartwilight"
  | "heavyrainandthunder"
  | "heavysnowandthunder"
  | "rainandthunder"
  | "heavysleetshowersandthunder_day"
  | "heavysleetshowersandthunder_night"
  | "heavysleetshowersandthunder_polartwilight"
  | "heavysnow"
  | "heavyrainshowers_day"
  | "heavyrainshowers_night"
  | "heavyrainshowers_polartwilight"
  | "lightsleet"
  | "heavyrain"
  | "lightrainshowers_day"
  | "lightrainshowers_night"
  | "lightrainshowers_polartwilight"
  | "heavysleetshowers_day"
  | "heavysleetshowers_night"
  | "heavysleetshowers_polartwilight"
  | "lightsleetshowers_day"
  | "lightsleetshowers_night"
  | "lightsleetshowers_polartwilight"
  | "snow"
  | "heavyrainshowersandthunder_day"
  | "heavyrainshowersandthunder_night"
  | "heavyrainshowersandthunder_polartwilight"
  | "snowshowers_day"
  | "snowshowers_night"
  | "snowshowers_polartwilight"
  | "fog"
  | "snowshowersandthunder_day"
  | "snowshowersandthunder_night"
  | "snowshowersandthunder_polartwilight"
  | "lightsnowandthunder"
  | "heavysleetandthunder"
  | "lightrain"
  | "rainshowersandthunder_day"
  | "rainshowersandthunder_night"
  | "rainshowersandthunder_polartwilight"
  | "rain"
  | "lightsnow"
  | "lightrainshowersandthunder_day"
  | "lightrainshowersandthunder_night"
  | "lightrainshowersandthunder_polartwilight"
  | "heavysleet"
  | "sleetandthunder"
  | "lightrainandthunder"
  | "sleet"
  | "lightssleetshowersandthunder_day"
  | "lightssleetshowersandthunder_night"
  | "lightssleetshowersandthunder_polartwilight"
  | "lightsleetandthunder"
  | "partlycloudy_day"
  | "partlycloudy_night"
  | "partlycloudy_polartwilight"
  | "sleetshowersandthunder_day"
  | "sleetshowersandthunder_night"
  | "sleetshowersandthunder_polartwilight"
  | "rainshowers_day"
  | "rainshowers_night"
  | "rainshowers_polartwilight"
  | "snowandthunder"
  | "sleetshowers_day"
  | "sleetshowers_night"
  | "sleetshowers_polartwilight"
  | "cloudy"
  | "heavysnowshowersandthunder_day"
  | "heavysnowshowersandthunder_night"
  | "heavysnowshowersandthunder_polartwilight"
  | "heavysnowshowers_day"
  | "heavysnowshowers_night"
  | "heavysnowshowers_polartwilight";

/**
 * Locationforecast
 * @see https://api.met.no/weatherapi/locationforecast/2.0/documentation
 */
export async function getForecast() {
  const config = await getConfig();
  const resp = await fetch(
    "https://api.met.no/weatherapi/locationforecast/2.0/compact?" +
      new URLSearchParams({
        lat: config.lat.toString(),
        lon: config.lon.toString(),
      }),
    {
      headers: {
        "User-Agent": "atomic-tracker github.com/majorpeter/atomic-tracker",
      },
    }
  );
  if (resp.ok) {
    const data = (await resp.json()) as {
      properties: {
        meta: {
          updated_at: string;
          units: {
            air_temperature: "celsius" | string;
            precipitation_amount: "mm" | string;
          };
        };
        timeseries: [
          {
            time: string;
            data: {
              instant: { details: { air_temperature: number } };
              next_6_hours: { summary: { symbol_code: WeatherSymbolCode } };
            };
          }
        ];
      };
    };

    return {
      temp: data.properties.timeseries[0].data.instant.details.air_temperature,
      symbol:
        data.properties.timeseries[0].data.next_6_hours.summary.symbol_code,
    };
  }
}
