import { Outlet, RouteObject } from "react-router-dom";
import { Grid } from "@mui/joy";

import GreetingClock from "../components/Dashboard/GreetingClock.tsx";
import Habits from "../components/Dashboard/Habits.tsx";
import TodosCard from "../components/Dashboard/TodosCard.tsx";
import Agenda from "../components/Dashboard/Agenda.tsx";
import Projects from "../components/Dashboard/Projects.tsx";
import Journal from "../components/Dashboard/Journal.tsx";

import { habitTrackerRoute } from "./Dashboard/HabitTrackerModal.tsx";
import { todosModalRoute } from "./Dashboard/TodosModal.tsx";
import { journalEditorRoute } from "./Dashboard/JournalEditorModal.tsx";

function Dashboard() {
  return (
    <>
      <Outlet />
      <GreetingClock />
      <Habits />
      <Grid container spacing={2} columns={{ xs: 5, sm: 12 }}>
        <Grid xs={7}>
          <TodosCard />
        </Grid>
        <Grid xs={5}>
          <Agenda />
        </Grid>
        <Grid xs={7}>
          <Projects />
        </Grid>
        <Grid xs={5}>
          <Journal />
        </Grid>
      </Grid>
    </>
  );
}

export const dashboardRoute: RouteObject = {
  path: "/dashboard",
  element: <Dashboard />,
  children: [todosModalRoute, journalEditorRoute, habitTrackerRoute],
};

export default Dashboard;
