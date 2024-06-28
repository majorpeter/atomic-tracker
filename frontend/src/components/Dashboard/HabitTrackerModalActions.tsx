import { Chip, DialogActions, Input } from "@mui/joy";
import { getIsoDate } from "../../util/formatter";
import { Api } from "@api";
import { RefObject, useState } from "react";
import { useResponsiveBreakpoint } from "../../util/responsive-breakpoint";
import HabitTrackButton from "./HabitTrackButton";
import { useTranslation } from "react-i18next";

const ACTIVITY_COUNT_COLLAPSE = 4;

const HabitTrackerModalActions: React.FC<{
  activities: Api.Habit.type["activities"];
  type: Api.Habit.type["type"];
  handleTrack: (activityId: number) => void;
  trackPosting: boolean;
  dateInputRef: RefObject<HTMLInputElement>;
}> = ({ activities, type, handleTrack, trackPosting, dateInputRef }) => {
  const { t } = useTranslation();
  const [activitiesCollapsed, setActivitiesCollapsed] = useState<boolean>(true);
  const activitiesCanBeCollapsed =
    !useResponsiveBreakpoint("lg") &&
    activities.length > ACTIVITY_COUNT_COLLAPSE;

  function toggleActivitiesCollapsed() {
    setActivitiesCollapsed((value) => !value);
  }

  return (
    <DialogActions
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        flexGrow: 1,
        alignItems: { xs: "normal" },
      }}
    >
      {!activitiesCanBeCollapsed ? (
        activities.map((activity) => (
          <HabitTrackButton
            key={activity.id}
            activity={activity}
            type={type}
            handleTrack={handleTrack}
            trackPosting={trackPosting}
          />
        ))
      ) : (
        <>
          {activities
            .slice(0, activitiesCollapsed ? ACTIVITY_COUNT_COLLAPSE : undefined)
            .map((activity) => (
              <HabitTrackButton
                key={activity.id}
                activity={activity}
                type={type}
                handleTrack={handleTrack}
                trackPosting={trackPosting}
              />
            ))}
          <Chip onClick={toggleActivitiesCollapsed}>
            {activitiesCollapsed
              ? t("expandActivities", { defaultValue: "More..." })
              : t("collapseActivities", { defaultValue: "Less..." })}
          </Chip>
        </>
      )}
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
