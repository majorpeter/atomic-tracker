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
  useLoaderData,
  useNavigate,
  LoaderFunctionArgs,
  Params,
  ParamParseKey,
  redirect,
} from "react-router-dom";

import { fetchHabit } from "../util/api-client";

const HabitTrackerModal: React.FC = () => {
  const navigate = useNavigate();

  const data = useLoaderData() as Exclude<
    Awaited<ReturnType<typeof loader>>,
    Response
  >;

  function handleClose() {
    navigate("..");
  }

  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const dateStr = date.toJSON().slice(0, 10);

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{data.name}</DialogTitle>
        <DialogContent>
          <Table>
            <tbody>
              <tr>
                <th>Tracked</th>
                <td>
                  <p>
                    {data.trackedInPeriod} in the last {data.periodLength} days
                  </p>
                  <p>
                    {data.history.length} in the last {data.historyLength} days
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
            <p key={item.date}>{item.date}</p>
          ))}
        </DialogContent>
        <DialogActions>
          <Input
            type="date"
            slotProps={{
              input: {
                defaultValue: dateStr,
              },
            }}
          />
          <Button>Track Activity</Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

const path = "/habit/:id";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<ParamParseKey<typeof path>>;
}

const loader = async ({ params }: LoaderArgs) => {
  if (params.id) {
    return fetchHabit(parseInt(params.id));
  }
  return redirect("..");
};

export const habitTrackerRoute: RouteObject = {
  path,
  element: <HabitTrackerModal />,
  loader,
};

export default HabitTrackerModal;
