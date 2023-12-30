import { Fragment } from "react";

import {
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  Link,
  List,
  ListItem,
  ListItemDecorator,
  ListSubheader,
  Sheet,
  Typography,
} from "@mui/joy";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useApiQuery_calendar } from "../../util/api-client";
import { formatTime } from "../../util/formatter";
import { Api } from "@api";
import { Trans, useTranslation } from "react-i18next";

function formatDateOrTimeForListing(
  item: NonNullable<Api.Calendar.type["today"]>[0],
  category: keyof Api.Calendar.type
): string {
  if (category == "today") {
    if (item.dateTime) {
      const d = new Date(item.dateTime);
      return formatTime(d);
    } else {
      return ""; // all day event
    }
  } else {
    if (item.dateTime) {
      const d = new Date(item.dateTime);
      return d.getDate().toString();
    }
    const d = new Date(item.date!);
    return d.getDate().toString();
  }
}

const Agenda: React.FC = () => {
  const { data } = useApiQuery_calendar();
  const { t } = useTranslation();

  type DataKeys = keyof NonNullable<typeof data>;
  const dataItems: { [k in DataKeys]: string } = {
    today: t("today"),
    thisWeek: t("thisWeek"),
    nextWeek: t("nextWeek"),
    thisMonth: t("thisMonth"),
    nextMonth: t("nextMonth"),
    later: t("later"),
  };

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        <Trans i18nKey="agenda">Agenda</Trans>
      </Typography>
      <Divider />
      <Sheet sx={{ maxHeight: 250, overflow: "auto" }}>
        {data && (
          <List>
            {Object.values(data).reduce(
              (val) => (val !== undefined ? 1 : 0),
              0
            ) == 0 && <p>No events found in Calendar!</p>}
            {Object.entries(dataItems).map(([key, value]) => {
              if (data[key as DataKeys])
                return (
                  <Fragment key={key}>
                    <ListSubheader sticky>{value}</ListSubheader>
                    {data[key as DataKeys]!.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemDecorator
                          sx={{
                            justifyContent: "end",
                            width: 30,
                            marginRight: 1,
                          }}
                        >
                          <Typography
                            level="body-sm"
                            title={item.dateTime || item.date}
                          >
                            {formatDateOrTimeForListing(item, key as DataKeys)}
                          </Typography>
                        </ListItemDecorator>
                        {item.url ? (
                          <Link href={item.url} target="_blank">
                            {item.summary}
                          </Link>
                        ) : (
                          item.summary
                        )}
                      </ListItem>
                    ))}
                  </Fragment>
                );
            })}
          </List>
        )}
      </Sheet>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <CardActions sx={{ flexWrap: "wrap" }}>
          <Typography sx={{ mr: "auto" }}>
            {data?.today
              ? t("n_eventsToday", { count: data.today.length })
              : t("noEventsToday")}
          </Typography>
          <Button
            component="a"
            href="https://calendar.google.com/"
            target="_blank"
            startDecorator={<OpenInNewIcon />}
          >
            <Trans>openCalendar</Trans>
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Agenda;
