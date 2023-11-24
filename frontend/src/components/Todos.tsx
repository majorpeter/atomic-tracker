import {
  Card,
  CardContent,
  Divider,
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Fragment } from "react";

const DUMMY_TODOS: {
  title: string;
  repeats: boolean;
  deadline?: string;
  pastDue: boolean;
}[] = [
  { title: "Testing", repeats: false, deadline: "2023-10-01", pastDue: true },
  {
    title: "Documentation",
    repeats: false,
    deadline: "2023-11-01",
    pastDue: false,
  },
  {
    title: "Water plants",
    repeats: true,
    deadline: "2023-11-30",
    pastDue: false,
  },
  { title: "Grocery shopping", repeats: false, pastDue: false },
];

const Todos: React.FC = () => {
  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Todos
      </Typography>
      <Divider />
      <CardContent>
        <List>
          {DUMMY_TODOS.map((item, index) => {
            const deadLine = item.deadline ? (
              <Typography
                color={item.pastDue ? "danger" : "neutral"}
                fontWeight={item.pastDue ? "lg" : ""}
              >
                {item.deadline}
              </Typography>
            ) : null;

            return (
              <Fragment key={index}>
                {index > 0 && <ListDivider />}
                <ListItem endAction={deadLine}>
                  <ListItemDecorator>
                    {item.repeats ? (
                      <RepeatIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}{" "}
                  </ListItemDecorator>
                  <Typography
                    color={item.pastDue ? "danger" : "neutral"}
                    fontWeight={item.pastDue ? "lg" : ""}
                  >
                    {item.title}
                  </Typography>
                </ListItem>
              </Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default Todos;
