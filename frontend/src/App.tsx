import "./App.css";

import { Grid } from "@mui/joy";
import Habits from "./components/Habits";
import Todos from "./components/Todos";
import Agenda from "./components/Agenda";
import Projects from "./components/Projects";
import Journal from "./components/Journal";
import GreetingClock from "./components/GreetingClock";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <GreetingClock />
      <Habits />
      <Grid container spacing={2}>
        <Grid xs={7}>
          <Todos />
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
