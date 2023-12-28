import { useState } from "react";

import { Box, Chip, Link, Snackbar, Typography } from "@mui/joy";

import ChecklistIcon from "@mui/icons-material/Checklist";

import { useApiQuery_projectsRecent } from "../../util/api-client";

const ProjectImportNotification: React.FC = () => {
  const [state, setState] = useState<{ open: boolean }>({ open: true });
  const { data } = useApiQuery_projectsRecent();

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
        </Box>
      </Snackbar>
    )
  );
};

export default ProjectImportNotification;
