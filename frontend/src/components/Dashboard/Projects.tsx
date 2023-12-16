import { Trans, useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useApiQuery_projectsInProgress } from "../../util/api-client";

const INACTIVE_TIMEOUT_DAYS = 2;
const STALE_TIMEOUT_DAYS = 7;

const Projects: React.FC = () => {
  const { data } = useApiQuery_projectsInProgress();
  const { t } = useTranslation();

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        <Trans>projects</Trans>
      </Typography>
      <Divider />
      <CardContent>
        <List>
          {data &&
            data.inprogress
              .map((item) => ({
                ...item,
                lastChangedDaysAgo:
                  (new Date().getTime() - new Date(item.updatedAt).getTime()) /
                  (24 * 3600 * 1000),
              }))
              .sort((a, b) => b.lastChangedDaysAgo - a.lastChangedDaysAgo)
              .map((item) => {
                const isInactive =
                  item.lastChangedDaysAgo >= INACTIVE_TIMEOUT_DAYS;
                const isStale = item.lastChangedDaysAgo >= STALE_TIMEOUT_DAYS;

                return (
                  <ListItem key={item.id}>
                    <ListItemDecorator sx={{ mr: 1 }}>
                      <CircularProgress
                        determinate={isInactive}
                        value={item.donePercent}
                        title={item.donePercent + "%"}
                        color={
                          isStale
                            ? "danger"
                            : isInactive
                            ? "neutral"
                            : "success"
                        }
                      >
                        <Typography fontSize="12px">
                          {item.donePercent}%
                        </Typography>
                      </CircularProgress>
                    </ListItemDecorator>
                    <Link href={item.url} target="_blank">
                      {item.subject}
                    </Link>
                    {item.lastChangedDaysAgo >= 1 && (
                      <ListItemDecorator sx={{ ml: "auto" }}>
                        <Typography
                          color={isStale ? "danger" : undefined}
                          fontWeight={isStale ? "lg" : undefined}
                          sx={{
                            opacity: Math.min(item.lastChangedDaysAgo, 5) / 5,
                          }}
                          title={item.updatedAt}
                        >
                          <Trans
                            i18nKey="n_daysAgo"
                            count={Math.floor(item.lastChangedDaysAgo)}
                          >
                            n days ago
                          </Trans>
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
            {data &&
              t("n_projectsInProgress", { count: data.inprogress.length })}
          </Typography>
          {data?.url && (
            <Button
              component="a"
              href={data.url}
              target="_blank"
              startDecorator={<OpenInNewIcon />}
            >
              <Trans>openProjects</Trans>
            </Button>
          )}
          {data?.board_url && (
            <Button
              component="a"
              href={data.board_url}
              target="_blank"
              startDecorator={<OpenInNewIcon />}
            >
              <Trans>agileBoard</Trans>
            </Button>
          )}
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default Projects;
