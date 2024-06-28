import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
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
  Badge,
  Button,
  Chip,
  ColorPaletteProp,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Table,
  Typography,
} from "@mui/joy";

import DeleteIcon from "@mui/icons-material/Delete";

import {
  apiQuery_habit_n,
  queryClient,
  useApiMutation_habit_track,
  useApiMutation_habit_track_delete,
  useApiQuery_habit_n,
} from "../../util/api-client";

import { formatDate, getIsoDate } from "../../util/formatter";
import { getHabitIconByName } from "../../util/habit-icons";
import { useResponsiveBreakpoint } from "../../util/responsive-breakpoint";

function colorValue(
  type: "good" | "bad",
  value: number,
  target: number
): ColorPaletteProp {
  if (type == "good") {
    if (value >= target) {
      return "success";
    }
    return "warning";
  }
  if (value >= target) {
    return "danger";
  }
  return "warning";
}

const HabitTrackerModal: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const responsiveSmOrLarger = useResponsiveBreakpoint("sm");

  return (
    data && (
      <Modal open onClose={handleClose}>
        <ModalDialog layout={responsiveSmOrLarger ? "center" : "fullscreen"}>
          <ModalClose />
          <DialogTitle>
            <Icon />
            {data.name}
          </DialogTitle>
          <DialogContent>
            <Table>
              <tbody>
                <tr>
                  <th>
                    <Trans i18nKey="tracked">Tracked</Trans>
                  </th>
                  <td>
                    <Trans
                      i18nKey="trackedScoreOverActivityInPeriod"
                      values={{
                        score: data.trackedInPeriod.value,
                        count: data.trackedInPeriod.count,
                        period: data.periodLength,
                      }}
                    >
                      <Chip
                        color={colorValue(
                          data.type,
                          data.trackedInPeriod.value,
                          data.targetValue
                        )}
                      >
                        {"{{score}}"}
                      </Chip>{" "}
                      over {"{{count}}"} activites in the last {"{{period}}"}{" "}
                      days
                    </Trans>
                    <p>
                      <Trans
                        i18nKey="trackedAcitvitiesInHistory"
                        values={{
                          count: data.history.length,
                          length: data.historyLength,
                        }}
                      >
                        {"{{count}}"} activities in the last {"{{length}}"} days
                      </Trans>
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>
                    {data.type == "good"
                      ? t("target", "Target")
                      : t("limit", "Limit")}
                  </th>
                  <td>
                    <Trans
                      i18nKey="targetScoreOverPeriodLength"
                      values={{
                        target: data.targetValue,
                        length: data.periodLength,
                      }}
                    >
                      <Chip color={data.type == "good" ? "primary" : "warning"}>
                        {"{{target}}"}
                      </Chip>{" "}
                      over a period of {"{{length}}"} days
                    </Trans>
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
                      {formatDate(new Date(item.date), {
                        day: "numeric",
                        month: "numeric",
                      })}
                    </ListItemDecorator>

                    <ListItemContent>
                      <Stack direction="row">
                        <Typography fontWeight="lg" sx={{ ml: 2 }}>
                          {item.activityName}
                        </Typography>
                        <Chip color="success">+{item.value}</Chip>
                      </Stack>

                      {item.project && (
                        <Typography noWrap>
                          <Link
                            href={item.project.url}
                            target="_blank"
                            sx={{ display: "inline" }}
                          >
                            {item.project.issueSubject}
                          </Link>
                        </Typography>
                      )}
                    </ListItemContent>

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
                    <Trans i18nKey="habitNotTrackedRecently">
                      This habit has not been tracked recently.
                    </Trans>
                  </Typography>
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
              flexGrow: 1,
              alignItems: { xs: "normal" },
            }}
          >
            {data.activities.map((activity) => (
              <Badge
                key={activity.id}
                badgeContent={"+" + activity.value}
                color={data.type == "good" ? "primary" : "warning"}
                variant="solid"
                sx={{
                  flexGrow: 1,
                  maxWidth: { md: 300 },
                }}
              >
                <Button
                  onClick={() => handleTrack(activity.id)}
                  loading={trackPosting}
                  color={data.type == "good" ? "primary" : "warning"}
                  sx={{ flexGrow: 1 }}
                  title={(() => {
                    const lastTracked = new Date(activity.lastTracked);
                    if (lastTracked.getTime() == 0) {
                      return t("trackedActivityNever");
                    }
                    const trackedDaysAgo = Math.floor(
                      (new Date().getTime() - lastTracked.getTime()) /
                        (24 * 3600 * 1e3)
                    );

                    if (trackedDaysAgo == 0) {
                      return t("trackedActivityToday");
                    }
                    if (trackedDaysAgo == 1) {
                      return t("trackedActivityYesterday");
                    }
                    return t("trackedActivityNDays", { count: trackedDaysAgo });
                  })()}
                >
                  <Trans
                    i18nKey="trackActivityName"
                    values={{ name: activity.name }}
                  >
                    Track "{"{{name}}"}"
                  </Trans>
                </Button>
              </Badge>
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
              sx={{
                ml: { md: "auto" },
                width: { xs: "100%", md: "auto" },
              }}
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
