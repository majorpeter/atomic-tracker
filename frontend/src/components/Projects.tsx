import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const INACTIVE_TIMEOUT_DAYS = 2;
const STALE_TIMEOUT_DAYS = 7;

const DUMMY_PROJECTS: {
  title: string;
  progressPercent: number;
  lastChangedDaysAgo: number;
}[] = [
  { title: "Read Atomic Habits", lastChangedDaysAgo: 10, progressPercent: 95 },
  { title: "Reorganize furniture", lastChangedDaysAgo: 6, progressPercent: 30 },
  {
    title: "Automate lights in living room",
    lastChangedDaysAgo: 2,
    progressPercent: 50,
  },
  {
    title: "Develop habit tracker site",
    progressPercent: 5,
    lastChangedDaysAgo: 0,
  },
];

const Projects: React.FC = () => {
  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Projects
      </Typography>
      <Divider />
      <CardContent>
        <List>
          {DUMMY_PROJECTS.map((item, index) => {
            const isInactive = item.lastChangedDaysAgo >= INACTIVE_TIMEOUT_DAYS;
            const isStale = item.lastChangedDaysAgo >= STALE_TIMEOUT_DAYS;

            return (
              <ListItem key={index}>
                <ListItemDecorator sx={{ mr: 1 }}>
                  <CircularProgress
                    determinate={isInactive}
                    value={item.progressPercent}
                    title={item.progressPercent + "%"}
                    color={
                      isStale ? "danger" : isInactive ? "neutral" : "success"
                    }
                  >
                    <Typography fontSize="12px">
                      {item.progressPercent}%
                    </Typography>
                  </CircularProgress>
                </ListItemDecorator>
                {item.title}
                {item.lastChangedDaysAgo > 0 && (
                  <ListItemDecorator sx={{ ml: "auto" }}>
                    <Typography
                      color={isStale ? "danger" : undefined}
                      fontWeight={isStale ? "lg" : undefined}
                      sx={{ opacity: Math.min(item.lastChangedDaysAgo, 5) / 5 }}
                    >
                      {item.lastChangedDaysAgo} days ago
                    </Typography>
                  </ListItemDecorator>
                )}
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <CardActions>
          <Typography mr="auto">
            {DUMMY_PROJECTS.length} projects in progress
          </Typography>
          <Button startDecorator={<OpenInNewIcon />}>Open Projects</Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Projects;
