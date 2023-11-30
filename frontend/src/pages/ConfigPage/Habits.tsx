import { useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItemButton,
  Radio,
  RadioGroup,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

import {
  useApiMutation_config_habits_add,
  useApiQuery_config_habits,
} from "../../util/api-client";
import { getHabitIconByName, getHabitIconNames } from "../../util/habit-icons";
import { Api } from "@api";

const Habits: React.FC = () => {
  const [selectedHabitId, setSelectedHabitId] = useState<number | "new" | null>(
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  const { data } = useApiQuery_config_habits();
  const { mutate: habitAddMutate } = useApiMutation_config_habits_add();

  let habit: Api.Config.Habits.HabitDescriptor | null = null;
  if (data && selectedHabitId) {
    if (selectedHabitId == "new") {
      habit = {
        name: "New habit",
        iconName: "",
        targetValue: 1,
        periodLength: 7,
        historyLength: 14,
      };
    } else {
      habit = data.find((item) => item.id === selectedHabitId) || null;
    }
  }

  function handleNewClick() {
    setSelectedHabitId("new");
  }

  function handleAddClick() {
    const data = Object.fromEntries(new FormData(formRef.current!));
    habitAddMutate({
      name: data.name as string,
      iconName: (data.iconName as string) || null,
      targetValue: parseInt(data.targetValue as string),
      periodLength: parseInt(data.periodLength as string),
      historyLength: parseInt(data.historyLength as string),
    });
  }

  function handleHabitClick(id: number) {
    setSelectedHabitId(id);
  }

  return (
    <>
      <Stack direction="row">
        <Typography level="h2">All Habits</Typography>
        {selectedHabitId != "new" && (
          <Button
            size="sm"
            startDecorator={<AddIcon />}
            sx={{ ml: "auto" }}
            onClick={handleNewClick}
          >
            Add new
          </Button>
        )}
      </Stack>
      <List variant="outlined">
        {data &&
          data.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleHabitClick(item.id!)}
              selected={item.id == selectedHabitId}
            >
              {item.name}
            </ListItemButton>
          ))}
      </List>

      {habit && (
        <Sheet key={habit.id} variant="outlined" sx={{ p: 3, mt: 3 }}>
          <form ref={formRef}>
            <Stack direction="row" alignItems="center">
              <Typography level="h3" sx={{ mr: "auto" }}>
                {habit.name}
              </Typography>
              {habit.id && (
                <>
                  <IconButton>
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton>
                    <KeyboardArrowDownIcon />
                  </IconButton>
                  <IconButton color="danger">
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
                  How many days the history affects the display of progress bars
                  on the dashboard.
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
              {habit.id ? (
                <Button startDecorator={<SaveIcon />}>Save changes</Button>
              ) : (
                <Button onClick={handleAddClick} startDecorator={<AddIcon />}>
                  Add
                </Button>
              )}
            </Stack>
          </form>
        </Sheet>
      )}
    </>
  );
};

export default Habits;
