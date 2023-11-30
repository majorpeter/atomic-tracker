import { useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
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
import UnarchiveIcon from "@mui/icons-material/Unarchive";

import {
  useApiMutation_config_habits_add,
  useApiMutation_config_habits_archive,
  useApiMutation_config_habits_edt,
  useApiMutation_config_habits_move,
  useApiMutation_config_habits_unarchive,
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
  const { mutate: habitEditMutate } = useApiMutation_config_habits_edt();
  const { mutate: habitArchiveMuate } = useApiMutation_config_habits_archive();
  const { mutate: habitUnarchiveMuate } =
    useApiMutation_config_habits_unarchive();
  const { mutate: habitMoveMutate } = useApiMutation_config_habits_move();

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
      habit = data.habits.find((item) => item.id === selectedHabitId) || null;
    }
  }

  function handleHabitSelection(id: number) {
    setSelectedHabitId(id);
  }

  function handleNewClick() {
    setSelectedHabitId("new");
  }

  function collectFormData(): Api.Config.Habits.HabitDescriptor {
    const data = Object.fromEntries(new FormData(formRef.current!));
    return {
      name: data.name as string,
      iconName: (data.iconName as string) || null,
      targetValue: parseInt(data.targetValue as string),
      periodLength: parseInt(data.periodLength as string),
      historyLength: parseInt(data.historyLength as string),
    };
  }

  function handleAddClick() {
    habitAddMutate(collectFormData());
    setSelectedHabitId(null);
  }

  function handleSaveClick() {
    habitEditMutate({ ...collectFormData(), id: selectedHabitId as number });
  }

  function handleArchiveClick() {
    habitArchiveMuate(selectedHabitId as number);
  }

  function handleUnarchiveClick(id: number) {
    habitUnarchiveMuate(id);
  }

  function handleMoveUpClick() {
    habitMoveMutate({ id: selectedHabitId as number, direction: "up" });
  }

  function handleMoveDownClick() {
    habitMoveMutate({ id: selectedHabitId as number, direction: "down" });
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
          data.habits.map((item) => {
            const Icon = getHabitIconByName(item.iconName);
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleHabitSelection(item.id!)}
                selected={item.id == selectedHabitId}
              >
                <ListItemDecorator>
                  <Icon />
                </ListItemDecorator>
                {item.name}
              </ListItemButton>
            );
          })}
      </List>

      {data && data.archived.length > 0 && (
        <AccordionGroup size="md" sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary>
              <Typography fontWeight="lg">Archived</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {data.archived.map((item) => (
                  <ListItem
                    key={item.id}
                    endAction={
                      <>
                        <IconButton
                          title="Unarchive"
                          onClick={() => handleUnarchiveClick(item.id)}
                        >
                          <UnarchiveIcon />
                        </IconButton>
                        <IconButton color="danger" title="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    {item.name}
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      )}

      {habit && (
        <Sheet key={habit.id} variant="outlined" sx={{ p: 3, mt: 3 }}>
          <form ref={formRef}>
            <Stack direction="row" alignItems="center">
              <Typography level="h3" sx={{ mr: "auto" }}>
                {habit.name}
              </Typography>
              {habit.id && (
                <>
                  <IconButton onClick={handleMoveUpClick}>
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton onClick={handleMoveDownClick}>
                    <KeyboardArrowDownIcon />
                  </IconButton>
                  <IconButton
                    color="danger"
                    title="Archive"
                    onClick={handleArchiveClick}
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
                <Button onClick={handleSaveClick} startDecorator={<SaveIcon />}>
                  Save changes
                </Button>
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
