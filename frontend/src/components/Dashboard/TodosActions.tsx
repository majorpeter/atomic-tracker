import { Trans } from "react-i18next";
import { Button, Divider, Typography } from "@mui/joy";
import { useApiQuery_todos } from "../../util/api-client";

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
      <Typography>
        <Trans i18nKey="n_items" count={data?.todos.length ?? 0}>
          {{ count: 0 }} items
        </Trans>
      </Typography>
      {countPastDue && (
        <>
          <Divider orientation="vertical" />
          <Typography color="danger">
            <Trans i18nKey="n_pastDue" count={countPastDue}>
              {{ count: 0 }} past due
            </Trans>
          </Typography>
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
          <Trans>edit</Trans>
        </Button>
      )}
    </>
  );
};

export default TodosActions;
