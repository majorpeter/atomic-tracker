import { Link, RouteObject, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Tabs, TabList, Tab, TabPanel, Button, Sheet } from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import UserPrefs from "../components/ConfigPage/UserPrefs";
import Habits from "../components/ConfigPage/Habits";
import Todos from "../components/ConfigPage/Todos";
import Agenda from "../components/ConfigPage/Agenda";
import Projects from "../components/ConfigPage/Projects";
import Radios from "../components/ConfigPage/Radios";
import Security from "../components/ConfigPage/Security";

import { dashboardRoute } from "./Dashboard";

const ConfigPage: React.FC = () => {
  const location = useLocation();

  // hook usage is required to detech language change on UserPrefs, <Trans/> does not work
  const { t } = useTranslation();

  const sp = new URLSearchParams(location.search);
  const agendaSelected = sp.get("agenda") != null;

  return (
    <>
      <Sheet sx={{ mb: 2 }}>
        <Button
          component={Link}
          to={dashboardRoute.path!}
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          {t("dashboard")}
        </Button>
      </Sheet>
      <Tabs defaultValue={agendaSelected ? "agenda" : "user"}>
        <TabList sx={{ flexWrap: "wrap" }}>
          <Tab value="user">{t("userPrefs", "User Preferences")}</Tab>
          <Tab value="habits">{t("habits", "Habits")}</Tab>
          <Tab value="todos">{t("todos", "Todos")}</Tab>
          <Tab value="agenda">{t("agenda", "Agenda")}</Tab>
          <Tab value="projects">{t("projects", "Projects")}</Tab>
          <Tab value="radios">{t("radios", "Radios")}</Tab>
          <Tab value="security">{t("security", "Security")}</Tab>
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
        <TabPanel value="agenda">
          <Agenda />
        </TabPanel>
        <TabPanel value="projects">
          <Projects />
        </TabPanel>
        <TabPanel value="radios">
          <Radios />
        </TabPanel>
        <TabPanel value="security">
          <Security />
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
