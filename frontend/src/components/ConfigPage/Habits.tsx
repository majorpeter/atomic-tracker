import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Alert,
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
import InfoIcon from "@mui/icons-material/Info";

import {
  useApiMutation_config_habits_add,
  useApiMutation_config_habits_archive,
  useApiMutation_config_habits_delete,
  useApiMutation_config_habits_edit,
  useApiMutation_config_habits_move,
  useApiMutation_config_habits_unarchive,
  useApiQuery_config_habits,
  useApiQuery_config_habits_projects,
} from "../../util/api-client";
import { Api } from "@api";

import HabitEditor from "./Habits/HabitEditor";
import { getHabitIconByName } from "../../util/habit-icons";
import { Trans, useTranslation } from "react-i18next";

export type Handlers = {
  handleAddClick: (formData: Api.Config.Habits.HabitDescriptor) => void;
  handleSaveClick: (formData: Api.Config.Habits.HabitDescriptor) => void;
  handleMoveUpClick: () => void;
  handleMoveDownClick: () => void;
  handleArchiveClick: () => void;
  addActivityHandler: (t: (s: string) => string) => void;
  archiveActivityHandler: (id: number) => void;
  unarchiveActivityHandler: (id: number) => void;
  deleteActivityHandler: (id: number) => void;
};

const Habits: React.FC = () => {
  const [state, setState] = useState<{
    selectedExistingHabitId?: number;
    isCreatingNew: boolean;
    habit?: Api.Config.Habits.HabitDescriptor;
    isHabitRefreshRequired: boolean;
  }>({
    isCreatingNew: false,
    isHabitRefreshRequired: false,
  });

  const { t } = useTranslation();
  const { data } = useApiQuery_config_habits((newData) => {
    if (state.isHabitRefreshRequired && state.selectedExistingHabitId) {
      handleHabitSelection(state.selectedExistingHabitId, newData);
    }
  });
  const { data: projects } = useApiQuery_config_habits_projects();
  const { mutate: habitAddMutate } = useApiMutation_config_habits_add();
  const { mutate: habitEditMutate } = useApiMutation_config_habits_edit();
  const { mutate: habitArchiveMutate } = useApiMutation_config_habits_archive();
  const { mutate: habitUnarchiveMuate } =
    useApiMutation_config_habits_unarchive();
  const { mutate: habitMoveMutate } = useApiMutation_config_habits_move();
  const { mutate: habitDeleteMutate } = useApiMutation_config_habits_delete();

  function handleHabitSelection(id: number, _data = data) {
    if (_data) {
      setState({
        isCreatingNew: false,
        selectedExistingHabitId: id,
        habit: JSON.parse(
          JSON.stringify(_data.habits.find((item) => item.id === id)) // create a deep copy
        ),
        isHabitRefreshRequired: false,
      });
    }
  }

  function handleNewClick(t: (s: string, s2: string) => string) {
    setState({
      isCreatingNew: true,
      isHabitRefreshRequired: false,
      habit: {
        name: t("newHabit", "New habit"),
        type: "good",
        iconName: "",
        targetValue: 1,
        periodLength: 7,
        historyLength: 14,
        projectId: null,
        activities: [
          {
            id: -1, // negative values used on frontend for key, not sent over API
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
        isHabitRefreshRequired: false,
      });
    },
    async handleSaveClick(formData: Api.Config.Habits.HabitDescriptor) {
      setState((prev) => ({ ...prev, isHabitRefreshRequired: true }));
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
        isHabitRefreshRequired: false,
      });
    },
    addActivityHandler(t: (s: string, s2?: string) => string) {
      setState((prev) => {
        const s: typeof state = JSON.parse(JSON.stringify(prev));
        s.habit!.activities.push({
          name: t("newActivity", "New Activity"),
          value: 1,
          // this generates a "random" invalid negative ID that is required for UI key
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
    deleteActivityHandler(id: number) {
      if (
        confirm("This cannot be undone (after saving below). Are you sure?")
      ) {
        setState((prev) => {
          const s: typeof state = JSON.parse(JSON.stringify(prev));
          s.habit!.archivedActivites = s.habit!.archivedActivites.filter(
            (item) => item.id != id
          );
          return s;
        });
      }
    },
  };

  function handleUnarchiveClick(id: number) {
    habitUnarchiveMuate(id);
  }

  function handleDeleteClick(id: number) {
    if (confirm("This cannot be undone. Are you sure?")) {
      habitDeleteMutate({ id });
    }
  }

  return (
    <>
      <Stack direction="row">
        <Typography level="h2">
          <Trans i18nKey="allHabits">All Habits</Trans>
        </Typography>
        {!state.isCreatingNew && (
          <Button
            size="sm"
            startDecorator={<AddIcon />}
            sx={{ ml: "auto" }}
            onClick={() => handleNewClick(t)}
          >
            <Trans i18nKey="addNew">Add new</Trans>
          </Button>
        )}
      </Stack>

      <List variant="outlined">
        {data && data.habits.length ? (
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
          })
        ) : (
          <Alert variant="plain" startDecorator={<InfoIcon />}>
            <Trans i18nKey="thereAreNoHabitsGetStarted">
              There are currently no habits. Get started by adding one!
            </Trans>
          </Alert>
        )}
      </List>

      {data && data.archived.length > 0 && (
        <AccordionGroup size="md" sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary>
              <Typography fontWeight="lg">
                <Trans i18nKey="archived">Archived</Trans>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {data.archived.map((item) => (
                  <ListItem
                    key={item.id}
                    endAction={
                      <>
                        <IconButton
                          title={t("unarchive", "Unarchive")}
                          onClick={() => handleUnarchiveClick(item.id)}
                        >
                          <UnarchiveIcon />
                        </IconButton>
                        <IconButton
                          color="danger"
                          title={t("delete", "Delete")}
                          onClick={() => handleDeleteClick(item.id)}
                        >
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
          projects={projects}
        />
      )}
    </>
  );
};

export default Habits;
