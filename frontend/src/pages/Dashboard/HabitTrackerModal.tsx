import { useRef } from "react";

import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Modal,
  ModalClose,
  ModalDialog,
  Table,
  Typography,
} from "@mui/joy";

import {
  RouteObject,
  useNavigate,
  LoaderFunctionArgs,
  Params,
  ParamParseKey,
  redirect,
  useParams,
} from "react-router-dom";

import {
  apiQuery_habit_n,
  queryClient,
  useApiMutation_habit_track,
  useApiMutation_habit_track_delete,
  useApiQuery_habit_n,
} from "../../util/api-client";

import { formatDate, getIsoDate } from "../../util/formatter";
import { getHabitIconByName } from "../../util/habit-icons";

import DeleteIcon from "@mui/icons-material/Delete";

const HabitTrackerModal: React.FC = () => {
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    navigate("..");
  }

  function handleDelete(id: number) {
    trackDeleteMutate({ id });
  }

  function handleTrack(activityId: number) {
    trackPostMutate({
      activityId,
      date: dateInputRef.current!.value,
    });
  }

  const params = useParams<LoaderArgs["params"]>();
  const { data } = useApiQuery_habit_n(parseInt(params.id!));
  const {
    mutate: trackPostMutate,
    isPending: trackPosting,
    data: trackPostedResp,
  } = useApiMutation_habit_track();
  const { mutate: trackDeleteMutate, isPending: trackDeleting } =
    useApiMutation_habit_track_delete();

  const Icon = getHabitIconByName(data?.iconName);

  return (
    data && (
      <Modal open onClose={handleClose}>
        <ModalDialog>
          <ModalClose />
          <DialogTitle>
            <Icon />
            {data.name}
          </DialogTitle>
          <DialogContent>
            <Table>
              <tbody>
                <tr>
                  <th>Tracked</th>
                  <td>
                    <Chip
                      color={
                        data.trackedInPeriod.value >= data.targetValue
                          ? "success"
                          : "warning"
                      }
                    >
                      {data.trackedInPeriod.value}
                    </Chip>{" "}
                    over {data.trackedInPeriod.count} activites in the last{" "}
                    {data.periodLength} days
                    <p>
                      {data.history.length} activities in the last{" "}
                      {data.historyLength} days
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>Target</th>
                  <td>
                    <Chip color="primary">{data.targetValue}</Chip> over a
                    period of {data.periodLength} days
                  </td>
                </tr>
              </tbody>
            </Table>

            <List variant="outlined">
              {data.history.length ? (
                data.history.map((item) => (
                  <ListItemButton
                    key={item.id}
                    selected={trackPostedResp?.id == item.id}
                  >
                    <ListItemDecorator>
                      {formatDate(new Date(item.date))}
                    </ListItemDecorator>

                    <Typography fontWeight="lg" sx={{ ml: 2 }}>
                      {item.activityName}
                    </Typography>
                    <Chip color="success">+{item.value}</Chip>

                    <ListItemDecorator sx={{ ml: "auto" }}>
                      <IconButton
                        onClick={handleDelete.bind(undefined, item.id)}
                        disabled={trackDeleting}
                        aria-label="Delete"
                        size="sm"
                        sx={{
                          "&:hover": {
                            color: "red",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemDecorator>
                  </ListItemButton>
                ))
              ) : (
                <ListItem>
                  <Typography
                    sx={{
                      ml: "auto",
                      mr: "auto",
                    }}
                  >
                    This habit has not been tracked recently.
                  </Typography>
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: {
                xs: "column",
                md: "row",
              },
              alignItems: { xs: "normal" },
            }}
          >
            {data.activities.map((activity) => (
              <Button
                key={activity.id}
                onClick={() => handleTrack(activity.id)}
                loading={trackPosting}
              >
                Track "{activity.name}"
              </Button>
            ))}
            <Input
              type="date"
              slotProps={{
                input: {
                  ref: dateInputRef,
                  defaultValue: getIsoDate(new Date()),
                  disabled: trackPosting,
                },
              }}
              sx={{ ml: { md: "auto" } }}
            />
          </DialogActions>
        </ModalDialog>
      </Modal>
    )
  );
};

const path = "/dashboard/habit/:id";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<ParamParseKey<typeof path>>;
}

const loader = async ({ params }: LoaderArgs) => {
  if (params.id) {
    await queryClient.prefetchQuery(apiQuery_habit_n(parseInt(params.id)));
    return null;
  }
  return redirect("..");
};

export const habitTrackerRoute: RouteObject = {
  path,
  element: <HabitTrackerModal />,
  loader,
};

export default HabitTrackerModal;
