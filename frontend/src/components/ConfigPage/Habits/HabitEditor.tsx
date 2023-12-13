import { useRef } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";

import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Api } from "@api";
import {
  getHabitIconByName,
  getHabitIconNames,
} from "../../../util/habit-icons";

import Activities from "./Activities";
import { Handlers } from "../Habits";

const HabitEditor: React.FC<{
  habit: Api.Config.Habits.HabitDescriptor;
  isCreatingNew: boolean;
  handlers: Handlers;
}> = ({ habit, isCreatingNew, handlers }) => {
  const formRef = useRef<HTMLFormElement>(null);

  function collectFormData(): Api.Config.Habits.HabitDescriptor {
    const fd = new FormData(formRef.current!);
    const data = Object.fromEntries(fd);

    const activityId = fd.getAll("activityId[]") as string[];
    const activityName = fd.getAll("activityName[]") as string[];
    const activityValue = fd.getAll("activityValue[]") as string[];

    return {
      name: data.name as string,
      type: data.type as "good" | "bad",
      iconName: (data.iconName as string) || null,
      targetValue: parseInt(data.targetValue as string),
      periodLength: parseInt(data.periodLength as string),
      historyLength: parseInt(data.historyLength as string),
      activities: activityId.map((id, index) => ({
        id: parseInt(id) > 0 ? parseInt(id) : undefined,
        name: activityName[index],
        value: parseInt(activityValue[index]),
      })),
      archivedActivites: habit.archivedActivites, // this can be retrieved from state since there's no form input for it
    };
  }

  return (
    <Sheet key={habit.id} variant="outlined" sx={{ p: 3, mt: 3 }}>
      <form ref={formRef}>
        <Stack direction="row" alignItems="center">
          <Typography level="h3" sx={{ mr: "auto" }}>
            {habit.name}
          </Typography>
          {habit.id && (
            <>
              <IconButton onClick={handlers.handleMoveUpClick}>
                <KeyboardArrowUpIcon />
              </IconButton>
              <IconButton onClick={handlers.handleMoveDownClick}>
                <KeyboardArrowDownIcon />
              </IconButton>
              <IconButton
                color="danger"
                title="Archive"
                onClick={handlers.handleArchiveClick}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Stack>
        <Stack sx={{ "&>*": { mb: 2 } }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input defaultValue={habit.name} name="name" />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              defaultValue={habit.type}
              sx={{
                flexDirection: "row",
                alignItems: "baseline",
                "& > *": { mr: 3 },
              }}
            >
              <Radio
                name="type"
                value="good"
                label="Good"
                color="primary"
              ></Radio>
              <Radio
                name="type"
                value="bad"
                label="Bad"
                color="warning"
              ></Radio>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Target Value</FormLabel>
            <Input
              defaultValue={habit.targetValue}
              type="number"
              name="targetValue"
            />
            <FormHelperText>
              The number of tracked activities you wish to achieve over a
              <strong>period</strong>.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Period Length</FormLabel>
            <Input
              defaultValue={habit.periodLength}
              type="number"
              name="periodLength"
            />
            <FormHelperText>Number of days in a period.</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>History Length</FormLabel>
            <Input
              defaultValue={habit.historyLength}
              type="number"
              name="historyLength"
            />
            <FormHelperText>
              How many days the history affects the display of progress bars on
              the dashboard.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel
              component="span" // fixes "incorrect use of <label..." warning
            >
              Icon
            </FormLabel>
            <RadioGroup
              defaultValue={habit.iconName}
              sx={{
                flexDirection: "row",
                alignItems: "baseline",
                "& > *": { mr: 3 },
              }}
            >
              {getHabitIconNames().map((icon) => {
                const Icon = getHabitIconByName(icon);
                return (
                  <Radio
                    key={icon}
                    value={icon}
                    label={<Icon />}
                    name="iconName"
                  />
                );
              })}
            </RadioGroup>
          </FormControl>

          <Activities habit={habit} handlers={handlers} />

          {!isCreatingNew ? (
            <Button
              onClick={() => handlers.handleSaveClick(collectFormData())}
              startDecorator={<SaveIcon />}
            >
              Save changes
            </Button>
          ) : (
            <Button
              onClick={() => handlers.handleAddClick(collectFormData())}
              startDecorator={<AddIcon />}
            >
              Add
            </Button>
          )}
        </Stack>
      </form>
    </Sheet>
  );
};

export default HabitEditor;
