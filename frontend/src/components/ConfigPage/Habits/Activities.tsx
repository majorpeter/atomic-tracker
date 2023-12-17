import { Trans, useTranslation } from "react-i18next";
import { Button, IconButton, Input, Stack, Table, Typography } from "@mui/joy";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

import { Api } from "@api";
import { Handlers } from "../Habits";

const Activities: React.FC<{
  habit: Api.Config.Habits.HabitDescriptor;
  handlers: Handlers;
}> = ({ habit, handlers }) => {
  const { t } = useTranslation();
  return (
    <>
      <Stack direction="row">
        <Typography level="h4" sx={{ mr: "auto" }}>
          <Trans i18nKey="activites">Activities</Trans>
        </Typography>
        <Button
          onClick={() => handlers.addActivityHandler(t)}
          startDecorator={<AddIcon />}
        >
          <Trans i18nKey="add">Add</Trans>
        </Button>
      </Stack>
      <Table>
        <thead>
          <tr>
            <th>
              <Trans i18nKey="name">Name</Trans>
            </th>
            <th>
              <Trans i18nKey="scoreValue">Score Value</Trans>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {habit.activities.map((activity) => (
            <tr key={activity.id!}>
              <td>
                <input name="activityId[]" type="hidden" value={activity.id} />
                <Input name="activityName[]" defaultValue={activity.name} />
              </td>
              <td>
                <Input
                  name="activityValue[]"
                  defaultValue={activity.value}
                  type="number"
                />
              </td>
              <td>
                {habit.activities!.length > 1 && (
                  <IconButton
                    onClick={() =>
                      handlers.archiveActivityHandler(activity.id!)
                    }
                  >
                    {activity.id! > 0 ? <ArchiveIcon /> : <DeleteIcon />}
                  </IconButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {habit.archivedActivites
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .map((activity) => (
          <Typography
            key={activity.id}
            endDecorator={
              <>
                <IconButton
                  onClick={() => handlers.unarchiveActivityHandler(activity.id)}
                >
                  <UnarchiveIcon />
                </IconButton>
                <IconButton
                  onClick={() => handlers.deleteActivityHandler(activity.id)}
                  color="danger"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            {activity.name}
          </Typography>
        ))}
    </>
  );
};

export default Activities;
