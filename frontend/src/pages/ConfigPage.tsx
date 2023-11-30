import { Link, RouteObject } from "react-router-dom";

import { Tabs, TabList, Tab, TabPanel, Button, Sheet } from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import Habits from "./ConfigPage/Habits";
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
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>Habits</Tab>
          <Tab>TODO</Tab>
        </TabList>
        <TabPanel value={0}>
          <Habits />
        </TabPanel>
        <TabPanel value={1}>TODO</TabPanel>
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
