import { Button, Divider, Typography } from "@mui/joy";
import { useApiQuery_todos } from "../util/api-client";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const TodosActions: React.FC = () => {
  const { data } = useApiQuery_todos();
  const countPastDue = data
    ? data.todos.reduce(
        (value, item) =>
          value + (item.due && new Date(item.due) < new Date() ? 1 : 0),
        0
      )
    : undefined;

  return (
    <>
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
    </>
  );
};

export default TodosActions;
