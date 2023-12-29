import { useState } from "react";

import { Box, Button, Chip, Link, Snackbar, Stack, Typography } from "@mui/joy";

import ChecklistIcon from "@mui/icons-material/Checklist";
import LinkIcon from "@mui/icons-material/Link";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ScheduleIcon from "@mui/icons-material/Schedule";

import {
  useApiMutation_projectsRecentDismiss,
  useApiQuery_projectsRecent,
} from "../../util/api-client";

const ProjectImportNotification: React.FC = () => {
  const [state, setState] = useState<{ open: boolean }>({ open: true });
  const { data, refetch } = useApiQuery_projectsRecent();
  const { mutate: mutateDismiss } =
    useApiMutation_projectsRecentDismiss(onDismissSuccess);

  async function onDismissSuccess() {
    const data = await refetch();
    console.log(data);

    if (data.data?.event) {
      setState((s) => ({ ...s, open: true }));
    }
  }

  function handleDismiss() {
    if (data && data.event) {
      setState((s) => ({ ...s, open: false }));
      mutateDismiss({ id: data.event.id });
    }
  }
  function handleClose() {
    setState((s) => ({ ...s, open: false }));
  }

  return (
    data &&
    data.event && (
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
              href={data.event.url}
              target="_blank"
              sx={{ display: "inline" }}
            >
              {data.event.issueSubject}
            </Link>
          </Typography>
          {data.event.progressChanged && (
            <>
              Progress changed from{" "}
              <Chip>{data.event.progressChanged.from}%</Chip> to{" "}
              <Chip color="primary">{data.event.progressChanged.to}%</Chip>
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
