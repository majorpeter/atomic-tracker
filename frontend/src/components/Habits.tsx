import { Grid } from "@mui/joy";
import Habit, { HabitProps } from "./Habit";
import { useApiQuery } from "../util/api-client";

const DUMMY_DATA: HabitProps[] = [
  {
    name: "Workout",
    icon: "workout",
    value: 3,
    targetValue: 5,
    historicalPercent: 30,
  },
  {
    name: "Reading",
    icon: "book",
    value: 2,
    targetValue: 2,
    historicalPercent: 35,
  },
  {
    name: "Write Journal",
    icon: "journal",
    value: 3,
    targetValue: 7,
    historicalPercent: 20,
  },
  {
    name: "Meditate",
    icon: "selfImprovement",
    value: 1,
    targetValue: 3,
    historicalPercent: 10,
  },
];

const Habits: React.FC = () => {
  const { data } = useApiQuery.habits();

  return (
    <Grid container spacing={2} sx={{ marginBottom: 1 }}>
      {data &&
        data.map((item, index) => (
          <Grid key={index} xs="auto" md={3}>
            <Habit {...item} icon={DUMMY_DATA[index].icon} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Habits;
