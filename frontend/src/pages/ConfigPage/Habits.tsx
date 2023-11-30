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
  Table,
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
  const [state, setState] = useState<{
    selectedExistingHabitId?: number;
    isCreatingNew: boolean;
    habit?: Api.Config.Habits.HabitDescriptor;
  }>({
    isCreatingNew: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const { data } = useApiQuery_config_habits();
  const { mutate: habitAddMutate } = useApiMutation_config_habits_add();
  const { mutate: habitEditMutate } = useApiMutation_config_habits_edt();
  const { mutate: habitArchiveMuate } = useApiMutation_config_habits_archive();
  const { mutate: habitUnarchiveMuate } =
    useApiMutation_config_habits_unarchive();
  const { mutate: habitMoveMutate } = useApiMutation_config_habits_move();

  function handleHabitSelection(id: number) {
    if (data) {
      setState({
        isCreatingNew: false,
        selectedExistingHabitId: id,
        habit: JSON.parse(
          JSON.stringify(data.habits.find((item) => item.id === id)) // create a deep copy
        ),
      });
    }
  }

  function handleNewClick() {
    setState({
      isCreatingNew: true,
      habit: {
        name: "New habit",
        iconName: "",
        targetValue: 1,
        periodLength: 7,
        historyLength: 14,
        activities: [
          {
            name: "Activity",
            value: 1,
          },
        ],
        archivedActivites: [],
      },
    });
  }

  function collectFormData(): Api.Config.Habits.HabitDescriptor {
    const data = Object.fromEntries(new FormData(formRef.current!));
    return {
      name: data.name as string,
      iconName: (data.iconName as string) || null,
      targetValue: parseInt(data.targetValue as string),
      periodLength: parseInt(data.periodLength as string),
      historyLength: parseInt(data.historyLength as string),
      activities: [], //TODO!
      archivedActivites: [],
    };
  }

  function handleAddClick() {
    habitAddMutate(collectFormData());
    setState({
      isCreatingNew: false,
    });
  }

  function handleSaveClick() {
    habitEditMutate({
      ...collectFormData(),
      id: state.selectedExistingHabitId!,
    });
  }

  function handleArchiveClick() {
    habitArchiveMuate(state.selectedExistingHabitId!);
    setState({
      isCreatingNew: false,
    });
  }

  function handleUnarchiveClick(id: number) {
    habitUnarchiveMuate(id);
  }

  function handleMoveUpClick() {
    habitMoveMutate({ id: state.selectedExistingHabitId!, direction: "up" });
  }

  function handleMoveDownClick() {
    habitMoveMutate({ id: state.selectedExistingHabitId!, direction: "down" });
  }

  function addActivityHandler() {
    setState((prev) => {
      const s: typeof state = JSON.parse(JSON.stringify(prev));
      s.habit!.activities.push({
        name: "New Activity",
        value: 1,
        id: s.habit!.activities.reduce(
          (prev, item) => Math.min(item.id! - 1, prev),
          -1
        ),
      });
      return s;
    });
  }

  function archiveActivityHandler(id: number) {
    setState((prev) => {
      const s: typeof state = JSON.parse(JSON.stringify(prev));

      const item = s.habit!.activities.find((item) => item.id === id);
      if (item?.id && item.id > 0) {
        s.habit!.archivedActivites.push({
          id: item.id,
          name: item.name,
        });
      }

      s.habit!.activities.splice(
        s.habit!.activities.findIndex((item) => item.id! === id),
        1
      );
      return s;
    });
  }

  function unarchiveActivityHandler(id: number) {
    setState((prev) => {
      const s: typeof state = JSON.parse(JSON.stringify(prev));

      const activity = s.habit!.archivedActivites.find((a) => a.id === id);
      s.habit!.archivedActivites.splice(
        s.habit!.archivedActivites.findIndex((a) => a.id === id)
      );

      s.habit!.activities.push({
        id: activity!.id,
        name: activity!.name,
        value: 1,
      });

      return s;
    });
  }

  return (
    <>
      <Stack direction="row">
        <Typography level="h2">All Habits</Typography>
        {!state.isCreatingNew && (
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
                selected={item.id == state.selectedExistingHabitId}
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

      {state.habit && (
        <Sheet key={state.habit.id} variant="outlined" sx={{ p: 3, mt: 3 }}>
          <form ref={formRef}>
            <Stack direction="row" alignItems="center">
              <Typography level="h3" sx={{ mr: "auto" }}>
                {state.habit.name}
              </Typography>
              {state.habit.id && (
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
                <Input defaultValue={state.habit.name} name="name" />
              </FormControl>
              <FormControl>
                <FormLabel>Target Value</FormLabel>
                <Input
                  defaultValue={state.habit.targetValue}
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
                  defaultValue={state.habit.periodLength}
                  type="number"
                  name="periodLength"
                />
                <FormHelperText>Number of days in a period.</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>History Length</FormLabel>
                <Input
                  defaultValue={state.habit.historyLength}
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
                  defaultValue={state.habit.iconName}
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

              <Stack direction="row">
                <Typography level="h4" sx={{ mr: "auto" }}>
                  Activities
                </Typography>
                <Button
                  onClick={addActivityHandler}
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
                  {state.habit.activities.map((activity) => (
                    <tr key={activity.id!}>
                      <td>
                        <input
                          name="activityId[]"
                          type="hidden"
                          value={activity.id}
                        />
                        <Input
                          name="activityName[]"
                          defaultValue={activity.name}
                        />
                      </td>
                      <td>
                        <Input
                          name="activityValue[]"
                          defaultValue={activity.value}
                          type="number"
                        />
                      </td>
                      <td>
                        {state.habit!.activities!.length > 1 && (
                          <IconButton
                            onClick={() => archiveActivityHandler(activity.id!)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {state.habit.archivedActivites.map((activity) => (
                <Typography
                  key={activity.id}
                  endDecorator={
                    <>
                      <IconButton
                        onClick={() => unarchiveActivityHandler(activity.id)}
                      >
                        <UnarchiveIcon />
                      </IconButton>
                      <IconButton color="danger">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  {activity.name}
                </Typography>
              ))}

              {!state.isCreatingNew ? (
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
