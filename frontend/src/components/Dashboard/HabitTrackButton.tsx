import { Trans, useTranslation } from "react-i18next";
import { Badge, Button } from "@mui/joy";
import { Api } from "@api";

const HabitTrackButton: React.FC<{
  activity: Api.Habit.type["activities"][number];
  type: Api.Habit.type["type"];
  handleTrack: (activityId: number) => void;
  trackPosting: boolean;
}> = ({ activity, type, handleTrack, trackPosting }) => {
  const { t } = useTranslation();

  return (
    <Badge
      key={activity.id}
      badgeContent={"+" + activity.value}
      color={type == "good" ? "primary" : "warning"}
      variant="solid"
      sx={{
        flexGrow: 1,
        maxWidth: { md: 300 },
      }}
    >
      <Button
        onClick={() => handleTrack(activity.id)}
        loading={trackPosting}
        color={type == "good" ? "primary" : "warning"}
        sx={{ flexGrow: 1 }}
        title={(() => {
          const lastTracked = new Date(activity.lastTracked);
          if (lastTracked.getTime() == 0) {
            return t("trackedActivityNever");
          }
          const trackedDaysAgo = Math.floor(
            (new Date().getTime() - lastTracked.getTime()) / (24 * 3600 * 1e3)
          );

          if (trackedDaysAgo == 0) {
            return t("trackedActivityToday");
          }
          if (trackedDaysAgo == 1) {
            return t("trackedActivityYesterday");
          }
          return t("trackedActivityNDays", { count: trackedDaysAgo });
        })()}
      >
        <Trans i18nKey="trackActivityName" values={{ name: activity.name }}>
          Track "{"{{name}}"}"
        </Trans>
      </Button>
    </Badge>
  );
};
export default HabitTrackButton;
