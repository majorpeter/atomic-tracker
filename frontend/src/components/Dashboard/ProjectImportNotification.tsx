import { useState } from "react";

import { Box, Button, Chip, Link, Snackbar, Stack, Typography } from "@mui/joy";

import ChecklistIcon from "@mui/icons-material/Checklist";
import LinkIcon from "@mui/icons-material/Link";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ScheduleIcon from "@mui/icons-material/Schedule";

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

  return (
    data &&
    data.projectActivity && (
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
            <>
              Progress changed from{" "}
              <Chip>{data.projectActivity.progressChanged.from}%</Chip> to{" "}
              <Chip color="primary">
                {data.projectActivity.progressChanged.to}%
              </Chip>
            </>
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
              Dismiss
            </Button>
            <Button
              color="neutral"
              onClick={handleClose}
              startDecorator={<ScheduleIcon />}
            >
              Later
            </Button>
          </Stack>
        </Box>
      </Snackbar>
    )
  );
};

export default ProjectImportNotification;
