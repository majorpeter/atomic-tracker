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

  type DataKeys = keyof NonNullable<typeof data>;
  const dataItems: { [k in DataKeys]: string } = {
    today: "Today",
    thisWeek: "This Week",
    nextWeek: "Next Week",
    thisMonth: "This Month",
    nextMonth: "Next Month",
    later: "Later",
  };

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Agenda
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
        <CardActions>
          <Typography sx={{ mr: "auto" }}>
            {data?.today
              ? `${data.today.length} events today`
              : "No events today"}
          </Typography>
          <Button
            component="a"
            href="https://calendar.google.com/"
            target="_blank"
            startDecorator={<OpenInNewIcon />}
          >
            Open Calendar
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Agenda;
