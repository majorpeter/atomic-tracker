import { Stack } from "@mui/joy";
import { useApiQuery_weather } from "../../util/api-client";

const WeatherBlock: React.FC = () => {
  const { data } = useApiQuery_weather();
  return (
    <Stack>
      {data?.temp_celsius}
      <br />
      {data?.weather_symbol}
    </Stack>
  );
};

export default WeatherBlock;
