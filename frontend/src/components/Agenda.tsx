import { Fragment } from "react";

import {
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  ListSubheader,
  Sheet,
  Typography,
} from "@mui/joy";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const DUMMY_AGENDA: {
  title: string;
  items: {
    day?: string;
    start: string;
    title: string;
  }[];
}[] = [
  {
    title: "Today",
    items: [
      {
        start: "8:00",
        title: "Work",
      },
      {
        start: "14:00",
        title: "Important meeting",
      },
    ],
  },
  {
    title: "Tomorrow (25)",
    items: [
      {
        start: "9:00",
        title: "Kickoff meeting",
      },
      { start: "12:00", title: "Lunch with John" },
      { start: "18:30", title: "Movies" },
    ],
  },
  {
    title: "Next week",
    items: [{ day: "02", start: "19:00", title: "Birtday party" }],
  },
];

const Agenda: React.FC = () => {
  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Agenda
      </Typography>
      <Divider />
      <Sheet sx={{ maxHeight: 250, overflow: "auto" }}>
        <List>
          {DUMMY_AGENDA.map((item, index) => (
            <Fragment key={index}>
              <ListSubheader sticky>{item.title}</ListSubheader>
              {item.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemDecorator
                    sx={{
                      justifyContent: "end",
                      width: 30,
                      marginRight: 1,
                    }}
                  >
                    <Typography level="body-sm" title={item.day ? item.start : undefined}>
                      {item.day ?? item.start}
                    </Typography>
                  </ListItemDecorator>
                  {item.title}
                </ListItem>
              ))}
            </Fragment>
          ))}
        </List>
      </Sheet>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <CardActions>
          <Typography sx={{ mr: "auto" }}>x events today</Typography>
          <Button startDecorator={<OpenInNewIcon />}>Open Calendar</Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Agenda;
