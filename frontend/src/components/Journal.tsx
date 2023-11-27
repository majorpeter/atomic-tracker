import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Divider,
  Typography,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";

import { Link } from "react-router-dom";

import { journalEditorRoute } from "../pages/JournalEditorModal";

import { useApiQuery_journal_day } from "../util/api-client";

const Journal: React.FC = () => {
  const { data } = useApiQuery_journal_day(new Date());

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Journal
      </Typography>
      <Divider />
      <CardContent>
        {data &&
          data.text.split("\n").map((item, index) => <p key={index}>{item}</p>)}
      </CardContent>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <CardActions>
          <div>{/* required for button sizing (not only child) */}</div>
          <Button
            component={Link}
            to={journalEditorRoute.path!}
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
