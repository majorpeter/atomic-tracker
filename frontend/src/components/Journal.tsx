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

import { Journal as api } from "@api";
import { useEffect, useState } from "react";

const Journal: React.FC = () => {
  const [data, setData] = useState<api.type>([]);

  useEffect(() => {
    (async () => {
      setData(await (await fetch("http://localhost:8080" + api.path)).json());
    })();
  }, []);

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Journal
      </Typography>
      <Divider />
      <CardContent>
        {data.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
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
