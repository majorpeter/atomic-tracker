import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Table,
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
  useApiQuery_habit_n,
} from "../util/api-client";

import { getHabitIconByName } from "../util/habit-icons";
import { useRef } from "react";

const HabitTrackerModal: React.FC = () => {
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    navigate("..");
  }

  function handleTrack() {
    trackPostMutate({
      date: dateInputRef.current!.value,
    });
  }

  const params = useParams<LoaderArgs["params"]>();
  const { data } = useApiQuery_habit_n(parseInt(params.id!));
  const {
    mutate: trackPostMutate,
    isLoading: trackPosting,
    data: trackPostedResp,
  } = useApiMutation_habit_track(parseInt(params.id!));

  const Icon = getHabitIconByName(data?.iconName);

  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const dateStr = date.toJSON().slice(0, 10);

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
                    {data.targetValue} over a period of {data.periodLength} days
                  </td>
                </tr>
              </tbody>
            </Table>

            {data.history.map((item) => (
              <p
                key={item.date}
                style={{
                  color: trackPostedResp?.id == item.id ? "red" : undefined,
                }}
              >
                {item.date}
              </p>
            ))}
          </DialogContent>
          <DialogActions>
            <Input
              type="date"
              slotProps={{
                input: {
                  ref: dateInputRef,
                  defaultValue: dateStr,
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

const path = "/habit/:id";

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
