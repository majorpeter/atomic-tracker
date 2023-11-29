import { Grid } from "@mui/joy";
import Habit from "./Habit";
import { useApiQuery_habits } from "../util/api-client";

const Habits: React.FC = () => {
  const { data } = useApiQuery_habits();

  return (
    <Grid
      container
      columns={{ xs: 2, sm: 2, md: 4 }}
      spacing={{ xs: 1, sm: 2 }}
      sx={{ marginBottom: 1 }}
    >
      {data &&
        data.map((item, index) => (
          <Grid key={index} xs={1}>
            <Habit {...item} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Habits;
