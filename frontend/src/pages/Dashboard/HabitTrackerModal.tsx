import { useRef } from "react";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  List,
  ListItem,
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

  function handleTrack() {
    trackPostMutate({
      habitId: parseInt(params.id!),
      date: dateInputRef.current!.value,
    });
  }

  const params = useParams<LoaderArgs["params"]>();
  const { data } = useApiQuery_habit_n(parseInt(params.id!));
  const {
    mutate: trackPostMutate,
    isLoading: trackPosting,
    data: trackPostedResp,
  } = useApiMutation_habit_track();
  const { mutate: trackDeleteMutate, isLoading: trackDeleting } =
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
                    <p>
                      {data.trackedInPeriod} in the last {data.periodLength}{" "}
                      days
                    </p>
                    <p>
                      {data.history.length} in the last {data.historyLength}{" "}
                      days
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>Target</th>
                  <td>
                    {data.targetValue} times over a period of{" "}
                    {data.periodLength} days
                  </td>
                </tr>
              </tbody>
            </Table>

            <List variant="outlined">
              {data.history.length ? (
                data.history.map((item) => (
                  <ListItem
                    key={item.id}
                    endAction={
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
                    }
                  >
                    <Typography
                      sx={{
                        fontWeight:
                          trackPostedResp?.id == item.id ? "lg" : undefined,
                      }}
                    >
                      {formatDate(new Date(item.date))}
                    </Typography>
                  </ListItem>
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
          <DialogActions>
            <Input
              type="date"
              slotProps={{
                input: {
                  ref: dateInputRef,
                  defaultValue: getIsoDate(new Date()),
                  disabled: trackPosting,
                },
              }}
            />
            <Button onClick={handleTrack} loading={trackPosting}>
              Track Activity
            </Button>
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
