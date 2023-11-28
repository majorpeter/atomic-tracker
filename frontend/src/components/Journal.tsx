import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

import { Link } from "react-router-dom";

import { journalEditorRoute } from "../pages/JournalEditorModal";

import { useApiQuery_journalOverview } from "../util/api-client";
import { getIsoDate } from "../util/formatter";

const COUNT_TARGET = 3;

const Journal: React.FC = () => {
  const { data } = useApiQuery_journalOverview();

  return (
    <Card>
      <Stack direction="row">
        <Typography fontSize="lg" fontWeight="lg">
          Journal
        </Typography>
        <Typography fontSize="md" sx={{ ml: "auto" }} title="Number of entries">
          {data?.today.count}
        </Typography>
      </Stack>
      <Divider />
      <CardContent>
        {data &&
          data.today.text
            .split("\n")
            .map((item, index) => <p key={index}>{item}</p>)}
      </CardContent>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <CardActions>
          <Box sx={{ "& > *": { mr: 1 } }}>
            {data &&
              data.history.map((item) => {
                const to = journalEditorRoute.path!.replace(":date", item.date);

                return item.count ? (
                  <Chip
                    key={item.date}
                    size="lg"
                    color={item.count < COUNT_TARGET ? "primary" : "success"}
                    title={item.date}
                    component={Link}
                    to={to}
                  >
                    <Typography fontSize="lg" fontWeight="lg">
                      {item.count}
                    </Typography>
                  </Chip>
                ) : (
                  <Chip
                    key={item.date}
                    color="danger"
                    title={item.date}
                    component={Link}
                    to={to}
                  >
                    <ClearIcon />
                  </Chip>
                );
              })}
          </Box>

          <Button
            component={Link}
            to={journalEditorRoute.path!.replace(
              ":date",
              getIsoDate(new Date())
            )}
            sx={{ ml: "auto" }}
          >
            <EditIcon />
            Edit
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Journal;
