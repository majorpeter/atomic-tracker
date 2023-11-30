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
  return (
    <>
      <Stack direction="row">
        <Typography level="h4" sx={{ mr: "auto" }}>
          Activities
        </Typography>
        <Button
          onClick={handlers.addActivityHandler}
          startDecorator={<AddIcon />}
        >
          Add
        </Button>
      </Stack>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score Value</th>
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
      {habit.archivedActivites.map((activity) => (
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
