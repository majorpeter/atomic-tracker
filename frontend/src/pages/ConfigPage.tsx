import { Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import { RouteObject } from "react-router-dom";
import Habits from "./ConfigPage/Habits";

const ConfigPage: React.FC = () => {
  return (
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
  );
};

export const configPageRoute: RouteObject = {
  path: "/config",
  element: <ConfigPage />,
  //children: [],
};

export default ConfigPage;
