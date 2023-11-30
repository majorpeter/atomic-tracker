import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";

import AddIcon from "@mui/icons-material/Add";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useApiMutation_config_habits_add,
  useApiMutation_config_habits_archive,
  useApiMutation_config_habits_edt,
  useApiMutation_config_habits_move,
  useApiMutation_config_habits_unarchive,
  useApiQuery_config_habits,
} from "../../util/api-client";
import { Api } from "@api";

import HabitEditor from "./Habits/HabitEditor";
import { getHabitIconByName } from "../../util/habit-icons";

export type Handlers = {
  handleAddClick: (formData: Api.Config.Habits.HabitDescriptor) => void;
  handleSaveClick: (formData: Api.Config.Habits.HabitDescriptor) => void;
  handleMoveUpClick: () => void;
  handleMoveDownClick: () => void;
  handleArchiveClick: () => void;
  addActivityHandler: () => void;
  archiveActivityHandler: (id: number) => void;
  unarchiveActivityHandler: (id: number) => void;
};

const Habits: React.FC = () => {
  const [state, setState] = useState<{
    selectedExistingHabitId?: number;
    isCreatingNew: boolean;
    habit?: Api.Config.Habits.HabitDescriptor;
  }>({
    isCreatingNew: false,
  });

  const { data } = useApiQuery_config_habits();
  const { mutate: habitAddMutate } = useApiMutation_config_habits_add();
  const { mutate: habitEditMutate } = useApiMutation_config_habits_edt();
  const { mutate: habitArchiveMutate } = useApiMutation_config_habits_archive();
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

  const handlers: Handlers = {
    handleAddClick(formData: Api.Config.Habits.HabitDescriptor) {
      habitAddMutate(formData);
      setState({
        isCreatingNew: false,
      });
    },
    handleSaveClick(formData: Api.Config.Habits.HabitDescriptor) {
      habitEditMutate({
        ...formData,
        id: state.selectedExistingHabitId!,
      });
    },
    handleMoveUpClick() {
      habitMoveMutate({ id: state.selectedExistingHabitId!, direction: "up" });
    },

    handleMoveDownClick() {
      habitMoveMutate({
        id: state.selectedExistingHabitId!,
        direction: "down",
      });
    },
    handleArchiveClick() {
      habitArchiveMutate(state.selectedExistingHabitId!);
      setState({
        isCreatingNew: false,
      });
    },
    addActivityHandler() {
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
    },
    archiveActivityHandler(id: number) {
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
    },
    unarchiveActivityHandler(id: number) {
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
    },
  };

  function handleUnarchiveClick(id: number) {
    habitUnarchiveMuate(id);
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
        <HabitEditor
          habit={state.habit}
          isCreatingNew={state.isCreatingNew}
          handlers={handlers}
        />
      )}
    </>
  );
};

export default Habits;
