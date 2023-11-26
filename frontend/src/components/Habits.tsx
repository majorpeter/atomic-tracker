import { Grid } from "@mui/joy";
import Habit, { HabitProps } from "./Habit";
import { useApiQuery } from "../util/api-client";

const DUMMY_DATA: HabitProps[] = [
  {
    title: "Workout",
    icon: "workout",
    value: 3,
    target: 5,
  },
  {
    title: "Reading",
    icon: "book",
    value: 2,
    target: 2,
  },
  {
    title: "Write Journal",
    icon: "journal",
    value: 3,
    target: 7,
  },
  { title: "Meditate", icon: "selfImprovement", value: 1, target: 3 },
];

const Habits: React.FC = () => {
  const { data } = useApiQuery.habits();

  return (
    <Grid container spacing={2} sx={{ marginBottom: 1 }}>
      {data &&
        data.map((item, index) => (
          <Grid key={index} xs="auto" md={3}>
            <Habit
              title={item.name}
              value={item.count}
              icon={DUMMY_DATA[index].icon}
              target={DUMMY_DATA[index].target}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default Habits;
