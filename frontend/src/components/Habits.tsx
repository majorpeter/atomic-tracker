import { Grid } from "@mui/joy";
import Habit, { HabitProps } from "./Habit";

const Habits: React.FC = () => {
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

  return (
    <Grid container spacing={2} sx={{ marginBottom: 1 }}>
      {DUMMY_DATA.map((item, index) => (
        <Grid key={index} xs="auto" md={3}>
          <Habit {...item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Habits;
