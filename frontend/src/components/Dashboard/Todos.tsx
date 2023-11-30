import { Fragment } from "react";

import {
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Sheet,
  Typography,
} from "@mui/joy";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import RepeatIcon from "@mui/icons-material/Repeat";

import { useApiQuery_todos } from "../../util/api-client";
import { formatDate, formatTime } from "../../util/formatter";

/**
 * @param due ISO date or datetime string
 */
function formatDueDate(due: string) {
  if (due.includes("T")) {
    const d = new Date(due);
    return formatDate(d) + " " + formatTime(d);
  } else {
    return formatDate(new Date(due));
  }
}

const Todos: React.FC<{ isFullscreen: boolean }> = ({ isFullscreen }) => {
  const { data } = useApiQuery_todos();

  return (
    <Sheet sx={{ maxHeight: isFullscreen ? undefined : 250, overflow: "auto" }}>
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
                  {formatDueDate(item.due)}
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
  );
};

export default Todos;
