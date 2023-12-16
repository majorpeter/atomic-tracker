import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import {
  Button,
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { getIsoDate } from "../../util/formatter";
import { journalEditorRoute } from "../../pages/Dashboard/JournalEditorModal";
import { configPageRoute } from "../../pages/ConfigPage";
import { logoutRoute } from "../../pages/LoginPage";

import { AppLocalStorage } from "../../util/local-storage";
import WeatherBlock from "./WeatherBlock";
import RadioBlock from "./RadioBlock";

function greetingForTime(t: (s: string) => string, date: Date) {
  const h = date.getHours();
  if (5 <= h && h < 12) {
    return t("goodMorning");
  }
  if (12 <= h && h < 18) {
    return t("goodAfternoon");
  }
  return t("goodEvening");
}

const GreetingClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const { t } = useTranslation();

  const LANG = AppLocalStorage.getLanguage();
  const day = now.toLocaleDateString(LANG, { weekday: "long" });
  const date = now.toLocaleDateString(LANG, {
    month: "numeric",
    day: "numeric",
  });
  const time = now.toLocaleTimeString(LANG, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Stack direction="row">
      <Stack>
        <Typography level="h3">{greetingForTime(t, now)}</Typography>
        <p>
          <strong>{day}</strong>, {date}
        </p>
        <Typography level="body-lg" fontWeight="lg">
          {time}
        </Typography>
      </Stack>
      <WeatherBlock />
      <Stack sx={{ ml: "auto" }} direction="row">
        <RadioBlock />
        <Stack sx={{ ml: 1 }}>
          <Dropdown>
            <MenuButton sx={{ mb: 1 }} variant="solid" color="primary">
              <MoreVertIcon />
            </MenuButton>
            <Menu placement="bottom-end">
              <MenuItem component={Link} to={configPageRoute.path!}>
                <ListItemDecorator>
                  <SettingsIcon />
                </ListItemDecorator>
                <Trans>configuration</Trans>
              </MenuItem>
              <MenuItem component={Link} to={logoutRoute.path!}>
                <ListItemDecorator>
                  <LogoutIcon />
                </ListItemDecorator>
                <Trans>logout</Trans>
              </MenuItem>
            </Menu>
          </Dropdown>
          <Button
            sx={{ display: { sm: "none" } }}
            component={Link}
            to={journalEditorRoute.path!.replace(
              ":date",
              getIsoDate(new Date())
            )}
            endDecorator={<KeyboardArrowRightIcon />}
          >
            Journal
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GreetingClock;
