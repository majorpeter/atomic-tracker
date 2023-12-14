import { Stack, Typography } from "@mui/joy";

import * as WeatherIcons from "weather-icons-react";

import { Api } from "@api";
import { useApiQuery_weather } from "../../util/api-client";

const WeatherSymbol: React.FC<{
  symbol: Api.Weather.type["weather_symbol"];
  size?: number;
  color?: string;
}> = ({ symbol, ...props }) => {
  switch (symbol) {
    case "clearsky_day":
    case "clearsky_polartwilight":
      return <WeatherIcons.WiDaySunny {...props} />;
    case "clearsky_night":
      return <WeatherIcons.WiNightClear {...props} />;
    case "fair_day":
    case "fair_polartwilight":
      return <WeatherIcons.WiDaySunnyOvercast {...props} />;
    case "fair_night":
      return <WeatherIcons.WiNightAltPartlyCloudy {...props} />;
    case "lightssnowshowersandthunder_day":
    case "lightssnowshowersandthunder_polartwilight":
      return <WeatherIcons.WiDaySnowThunderstorm {...props} />;
    case "lightssnowshowersandthunder_night":
      return <WeatherIcons.WiNightSnowThunderstorm {...props} />;
    case "lightsnowshowers_day":
    case "lightsnowshowers_polartwilight":
      return <WeatherIcons.WiDaySnow {...props} />;
    case "lightsnowshowers_night":
      return <WeatherIcons.WiNightSnow {...props} />;
    case "heavyrainandthunder":
    case "rainandthunder":
      return <WeatherIcons.WiStormShowers {...props} />;
    case "heavysnowandthunder":
      return <WeatherIcons.WiNightSnowThunderstorm {...props} />;
    case "heavysleetshowersandthunder_day":
    case "heavysleetshowersandthunder_polartwilight":
      return <WeatherIcons.WiDaySleetStorm {...props} />;
    case "heavysleetshowersandthunder_night":
      return <WeatherIcons.WiNightSleetStorm {...props} />;
    case "heavysnow":
      return <WeatherIcons.WiDaySnow {...props} />;
    case "heavyrainshowers_day":
    case "heavyrainshowers_polartwilight":
    case "lightrainshowers_day":
    case "lightrainshowers_polartwilight":
      return <WeatherIcons.WiDayRain {...props} />;
    case "heavyrainshowers_night":
    case "lightrainshowers_night":
      return <WeatherIcons.WiNightShowers {...props} />;
    case "lightsleet":
      return <WeatherIcons.WiSleet {...props} />;
    case "heavyrain":
      return <WeatherIcons.WiRain {...props} />;
    case "heavysleetshowers_day":
    case "heavysleetshowers_polartwilight":
    case "lightsleetshowers_day":
    case "lightsleetshowers_polartwilight":
      return <WeatherIcons.WiDaySleet {...props} />;
    case "heavysleetshowers_night":
    case "lightsleetshowers_night":
      return <WeatherIcons.WiNightSleet {...props} />;
    case "snow":
      return <WeatherIcons.WiSnow {...props} />;

    //TODO finish mapping!

    case "lightrain":
    case "rain":
      return <WeatherIcons.WiRain {...props} />;
    case "cloudy":
      return <WeatherIcons.WiCloudy {...props} />;
  }
  return <WeatherIcons.WiAlien {...props} />;
};

const WeatherBlock: React.FC = () => {
  const { data } = useApiQuery_weather();
  if (data && data.weather_symbol) {
    return (
      <Stack
        sx={{ ml: 2, textDecoration: "none", color: "inherit" }}
        direction="row"
        component="a"
        href="https://www.google.com/search?q=weather"
        target="_blank"
      >
        <WeatherSymbol symbol={data.weather_symbol} size={64} />
        <Stack>
          <Typography>
            <Typography level="body-lg" fontWeight="xl">
              {data.temp_celsius}
            </Typography>{" "}
            ˚C
          </Typography>
          {data.weather_symbol}
        </Stack>
      </Stack>
    );
  }
};

export default WeatherBlock;
