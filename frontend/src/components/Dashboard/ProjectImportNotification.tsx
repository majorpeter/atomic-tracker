import { useState } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Link,
  Snackbar,
  Stack,
  Typography,
} from "@mui/joy";

import ChecklistIcon from "@mui/icons-material/Checklist";
import LinkIcon from "@mui/icons-material/Link";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ScheduleIcon from "@mui/icons-material/Schedule";

import { Trans } from "react-i18next";

import {
  useApiMutation_projectsRecentTrack,
  useApiMutation_projectsRecentDismiss,
  useApiQuery_projectsRecent,
} from "../../util/api-client";

const ProjectImportNotification: React.FC = () => {
  const [state, setState] = useState<{ open: boolean }>({ open: true });
  const { data, refetch } = useApiQuery_projectsRecent();
  const { mutate: mutateTrack } = useApiMutation_projectsRecentTrack(
    onTrackDismissSuccess
  );
  const { mutate: mutateDismiss } = useApiMutation_projectsRecentDismiss(
    onTrackDismissSuccess
  );

  async function onTrackDismissSuccess() {
    const data = await refetch();

    if (data.data?.projectActivity) {
      setState((s) => ({ ...s, open: true }));
    }
  }

  function handleTrack(activityId: number) {
    if (data && data.projectActivity) {
      setState((s) => ({ ...s, open: false }));
      mutateTrack({ activityId, id: data.projectActivity.projectActivityId });
    }
  }

  function handleDismiss() {
    if (data && data.projectActivity) {
      setState((s) => ({ ...s, open: false }));
      mutateDismiss({ id: data.projectActivity.projectActivityId });
    }
  }
  function handleClose() {
    setState((s) => ({ ...s, open: false }));
  }

  if (data && data.projectActivity) {
    return (
      <Snackbar
        open={state.open}
        onClose={handleClose}
        startDecorator={<ChecklistIcon />}
        sx={{
          maxWidth: { xs: "calc(100% - 60px)", sm: "450px" },
        }}
      >
        <Box sx={{ overflow: "hidden" }}>
          <Typography
            level="title-md"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Link
              href={data.projectActivity.url}
              target="_blank"
              sx={{ display: "inline" }}
            >
              {data.projectActivity.issueSubject}
            </Link>
          </Typography>
          {data.projectActivity.progressChanged && (
            <Box>
              <Trans
                i18nKey="progressChangedFromTo"
                values={{
                  from: data.projectActivity.progressChanged.from + "%",
                  to: data.projectActivity.progressChanged.to + "%",
                }}
              >
                Progress changed from <Chip>{"{{from}}"}</Chip> to{" "}
                <Chip color="primary">{"{{to}}"}</Chip>
              </Trans>
            </Box>
          )}
          {data.projectActivity.statusChanged && (
            <Box>
              <Trans
                i18nKey="statusChangedFromTo"
                values={{
                  from: data.projectActivity.statusChanged.from,
                  to: data.projectActivity.statusChanged.to,
                }}
              >
                Status changed from <Chip>{"{{from}}"}</Chip> to{" "}
                <Chip
                  color={
                    data.projectActivity.statusChanged.closed
                      ? "success"
                      : "primary"
                  }
                >
                  {"{{to}}"}
                </Chip>
              </Trans>
            </Box>
          )}
          <Stack
            direction="row"
            spacing="4"
            flexWrap="wrap"
            sx={{
              mt: 2,
              "& > *": { mr: "5px !important", mb: "5px !important" },
            }}
          >
            {data.activities &&
              data.activities.map((a) => (
                <Button
                  key={a.id}
                  color="primary"
                  onClick={() => handleTrack(a.id)}
                  startDecorator={<LinkIcon />}
                >
                  {a.name}
                </Button>
              ))}
            <Button
              color="danger"
              onClick={handleDismiss}
              startDecorator={<HighlightOffIcon />}
            >
              <Trans i18nKey="dismiss">Dismiss</Trans>
            </Button>
            <Button
              color="neutral"
              onClick={handleClose}
              startDecorator={<ScheduleIcon />}
            >
              <Trans i18nKey="later">Later</Trans>
            </Button>
          </Stack>
        </Box>
      </Snackbar>
    );
  } else if (data && data.importStatus && data.importStatus.totalIssues > 0) {
    const percent =
      (data.importStatus.processedIssues / data.importStatus.totalIssues) * 100;
    return (
      <Snackbar
        open
        startDecorator={
          <CircularProgress determinate value={percent}>
            <Typography fontSize="12px">{Math.round(percent)}%</Typography>
          </CircularProgress>
        }
      >
        <Box>
          <Typography level="title-md">
            <Trans i18nKey="importingProjActivity">
              Importing project activity
            </Trans>
          </Typography>
          <Trans
            i18nKey="importIssuesProcessedProgress"
            values={{
              processed: data.importStatus.processedIssues,
              total: data.importStatus.totalIssues,
            }}
          >
            {"{{processed}}"} of {"{{total}}"} issues processed.
          </Trans>
        </Box>
      </Snackbar>
    );
  }
};

export default ProjectImportNotification;
