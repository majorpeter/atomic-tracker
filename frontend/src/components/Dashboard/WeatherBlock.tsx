import { Stack, Typography } from "@mui/joy";

import * as WeatherIcons from "weather-icons-react";

import { Api } from "@api";
import { useApiQuery_weather } from "../../util/api-client";

function getWeatherSymbol(
  symbol: Api.Weather.type["weather_symbol"]
): React.JSX.Element {
  switch (symbol) {
    case "cloudy":
      return <WeatherIcons.WiCloudy />;
  }
  return <WeatherIcons.WiAlien />;
}

const WeatherBlock: React.FC = () => {
  const { data } = useApiQuery_weather();
  if (data) {
    return (
      <Stack sx={{ ml: 2 }}>
        {getWeatherSymbol(data.weather_symbol)}
        <Typography>{data.temp_celsius} ˚C</Typography>
      </Stack>
    );
  }
};

export default WeatherBlock;
