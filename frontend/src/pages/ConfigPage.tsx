import { Link, RouteObject } from "react-router-dom";

import { Tabs, TabList, Tab, TabPanel, Button, Sheet } from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import UserPrefs from "../components/ConfigPage/UserPrefs";
import Habits from "../components/ConfigPage/Habits";

import { dashboardRoute } from "./Dashboard";

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
        </TabList>
        <TabPanel value="user">
          <UserPrefs />
        </TabPanel>
        <TabPanel value="habits">
          <Habits />
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
