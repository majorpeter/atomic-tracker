import { Grid } from "@mui/joy";
import Habit from "./Habit";
import { useApiQuery_habits } from "../util/api-client";

const Habits: React.FC = () => {
  const { data } = useApiQuery_habits();

  return (
    <Grid container spacing={2} sx={{ marginBottom: 1 }}>
      {data &&
        data.map((item, index) => (
          <Grid key={index} xs="auto" md={3}>
            <Habit {...item} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Habits;
