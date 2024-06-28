import { Trans, useTranslation } from "react-i18next";
import { Badge, Button, DialogActions, Input } from "@mui/joy";
import { getIsoDate } from "../../util/formatter";
import { Api } from "@api";
import { RefObject } from "react";

const HabitTrackerModalActions: React.FC<{
  activities: Api.Habit.type["activities"];
  type: Api.Habit.type["type"];
  handleTrack: (activityId: number) => void;
  trackPosting: boolean;
  dateInputRef: RefObject<HTMLInputElement>;
}> = ({ activities, type, handleTrack, trackPosting, dateInputRef }) => {
  const { t } = useTranslation();

  return (
    <DialogActions
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        flexGrow: 1,
        alignItems: { xs: "normal" },
      }}
    >
      {activities.map((activity) => (
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
                (new Date().getTime() - lastTracked.getTime()) /
                  (24 * 3600 * 1e3)
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
      ))}
      <Input
        type="date"
        slotProps={{
          input: {
            ref: dateInputRef,
            defaultValue: getIsoDate(new Date()),
            disabled: trackPosting,
          },
        }}
        sx={{
          ml: { md: "auto" },
          width: { xs: "100%", md: "auto" },
        }}
      />
    </DialogActions>
  );
};

export default HabitTrackerModalActions;
