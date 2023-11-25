import { Fragment } from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Divider,
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Sheet,
  Typography,
} from "@mui/joy";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import RepeatIcon from "@mui/icons-material/Repeat";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useApiQuery } from "../util/api-client";

const Todos: React.FC = () => {
  const { data } = useApiQuery.todos();
  const countPastDue = data
    ? data.todos.reduce(
        (value, item) =>
          value + (item.due && new Date(item.due) < new Date() ? 1 : 0),
        0
      )
    : undefined;

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Todos
      </Typography>
      <Divider />
      <CardContent>
        <Sheet sx={{ maxHeight: 250, overflow: "auto" }}>
          <List>
            {data &&
              data.todos.map((item, index) => {
                const pastDue = item.due && new Date(item.due) < new Date();
                const deadLine = item.due ? (
                  <ListItemDecorator sx={{ ml: "auto" }}>
                    <Typography
                      color={pastDue ? "danger" : "neutral"}
                      fontWeight={pastDue ? "lg" : ""}
                    >
                      {item.due}
                    </Typography>
                  </ListItemDecorator>
                ) : null;

                return (
                  <Fragment key={item.uid}>
                    {index > 0 && <ListDivider />}
                    <ListItem>
                      <ListItemDecorator>
                        {item.repeats ? (
                          <RepeatIcon />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )}{" "}
                      </ListItemDecorator>
                      <Typography
                        color={pastDue ? "danger" : "neutral"}
                        fontWeight={pastDue ? "lg" : ""}
                      >
                        {item.summary}
                      </Typography>
                      {deadLine}
                    </ListItem>
                  </Fragment>
                );
              })}
          </List>
        </Sheet>
      </CardContent>

      <CardOverflow variant="soft">
        <Divider inset="context" />

        <CardActions>
          <Typography>{data?.todos.length} items</Typography>
          {countPastDue && (
            <>
              <Divider orientation="vertical" />
              <Typography color="danger">{countPastDue} past due</Typography>
            </>
          )}
          {data?.webui && (
            <Button
              component="a"
              href={data?.webui}
              target="_blank"
              sx={{ ml: "auto" }}
              startDecorator={<OpenInNewIcon />}
            >
              Edit
            </Button>
          )}
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Todos;
