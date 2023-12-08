import { Link, RouteObject } from "react-router-dom";

import { Tabs, TabList, Tab, TabPanel, Button, Sheet } from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import UserPrefs from "../components/ConfigPage/UserPrefs";
import Habits from "../components/ConfigPage/Habits";
import Projects from "../components/ConfigPage/Projects";

import { dashboardRoute } from "./Dashboard";
import Todos from "../components/ConfigPage/Todos";
import Radios from "../components/ConfigPage/Radios";

const ConfigPage: React.FC = () => {
  return (
    <>
      <Sheet sx={{ mb: 2 }}>
        <Button
          component={Link}
          to={dashboardRoute.path!}
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Dashboard
        </Button>
      </Sheet>
      <Tabs defaultValue="user">
        <TabList>
          <Tab value="user">User Preferences</Tab>
          <Tab value="habits">Habits</Tab>
          <Tab value="todos">Todos</Tab>
          <Tab value="agenda">Agenda</Tab>
          <Tab value="projects">Projects</Tab>
          <Tab value="radios">Radios</Tab>
        </TabList>
        <TabPanel value="user">
          <UserPrefs />
        </TabPanel>
        <TabPanel value="habits">
          <Habits />
        </TabPanel>
        <TabPanel value="todos">
          <Todos />
        </TabPanel>
        <TabPanel value="agenda">TBD</TabPanel>
        <TabPanel value="projects">
          <Projects />
        </TabPanel>
        <TabPanel value="radios">
          <Radios />
        </TabPanel>
      </Tabs>
    </>
  );
};

export const configPageRoute: RouteObject = {
  path: "/config",
  element: <ConfigPage />,
  //children: [],
};

export default ConfigPage;
