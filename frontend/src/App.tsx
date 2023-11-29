import "./App.css";

import { Outlet } from "react-router-dom";
import { Grid } from "@mui/joy";

import GreetingClock from "./components/GreetingClock";
import Habits from "./components/Habits";
import TodosCard from "./components/TodosCard";
import Agenda from "./components/Agenda";
import Projects from "./components/Projects";
import Journal from "./components/Journal";

function App() {
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

export default App;
