import { useState } from "react";
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

import { useApiQuery_config_habits } from "../../util/api-client";
import { getHabitIconByName, getHabitIconNames } from "../../util/habit-icons";

const Habits: React.FC = () => {
  const [selectedHabitId, setSelectedHabitId] = useState<number | "new" | null>(
    null
  );
  const { data } = useApiQuery_config_habits();

  let selectedHabit: Exclude<typeof data, undefined>[0] | null = null;
  if (data && selectedHabitId) {
    if (selectedHabitId == "new") {
      selectedHabit = {
        name: "New habit",
        iconName: "",
        targetValue: 1,
        periodLength: 7,
        historyLength: 14,
      };
    } else {
      selectedHabit = data.find((item) => item.id === selectedHabitId) || null;
    }
  }

  function handleNewClick() {
    setSelectedHabitId("new");
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

      {selectedHabit && (
        <Sheet key={selectedHabit.id} variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Stack direction="row" alignItems="center">
            <Typography level="h3" sx={{ mr: "auto" }}>
              {selectedHabit.name}
            </Typography>
            {selectedHabit.id && (
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
              <Input defaultValue={selectedHabit.name} />
            </FormControl>
            <FormControl>
              <FormLabel>Target Value</FormLabel>
              <Input defaultValue={selectedHabit.targetValue} type="number" />
              <FormHelperText>
                The number of tracked activities you wish to achieve over a
                <strong>period</strong>.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Period Length</FormLabel>
              <Input defaultValue={selectedHabit.periodLength} type="number" />
              <FormHelperText>Number of days in a period.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>History Length</FormLabel>
              <Input defaultValue={selectedHabit.historyLength} type="number" />
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
                defaultValue={selectedHabit.iconName}
                sx={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  "& > *": { mr: 3 },
                }}
              >
                {getHabitIconNames().map((icon) => {
                  const Icon = getHabitIconByName(icon);
                  return <Radio key={icon} value={icon} label={<Icon />} />;
                })}
              </RadioGroup>
            </FormControl>
            {selectedHabit.id ? (
              <Button startDecorator={<SaveIcon />}>Save changes</Button>
            ) : (
              <Button startDecorator={<AddIcon />}>Add</Button>
            )}
          </Stack>
        </Sheet>
      )}
    </>
  );
};

export default Habits;
