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

const DUMMY_JOURNAL = {
  text: [
    "I saw a cute dog today",
    "had lunch with a friend",
    "watched the latest episode of my show",
  ],
};

const Journal: React.FC = () => {
  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Journal
      </Typography>
      <Divider />
      <CardContent>
        {DUMMY_JOURNAL.text.map((item) => (
          <p>{item}</p>
        ))}
      </CardContent>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <CardActions>
          <div>{/* required for button sizing (not only child) */}</div>
          <Button sx={{ ml: "auto" }}>
            <EditIcon />
            Edit
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Journal;
