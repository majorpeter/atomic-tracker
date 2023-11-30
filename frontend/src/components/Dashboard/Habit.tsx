import { Card, CardContent, CircularProgress, Typography } from "@mui/joy";

import { Link } from "react-router-dom";
import { habitTrackerRoute } from "../../pages/Dashboard/HabitTrackerModal";
import { getHabitIconByName } from "../../util/habit-icons";

export type HabitProps = {
  id: number;
  name: string;
  iconName: string | null;
  value: number;
  targetValue: number;
  historicalPercent: number;
};

const Habit: React.FC<HabitProps> = ({
  id,
  name,
  iconName,
  value,
  targetValue,
  historicalPercent,
}) => {
  const Icon = getHabitIconByName(iconName);

  return (
    <Card
      variant="outlined"
      sx={{
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
          transform: "scale(1.05)",
        },
        textDecoration: "none",
      }}
      component={Link}
      to={habitTrackerRoute.path!.replace(":id", id.toString())}
    >
      <Typography
        level="body-md"
        fontWeight="bold"
        sx={{ display: { xs: undefined, sm: "none" } }}
      >
        {name}
      </Typography>
      <CardContent orientation="horizontal">
        <CircularProgress
          sx={{
            "--_root-size": { xs: "32px", sm: "64px" },
            "--_progress-thickness": { xs: "2px", sm: "8px" },
          }}
          determinate
          value={historicalPercent}
        >
          <Icon />
        </CircularProgress>
        <CardContent>
          <Typography
            level="body-md"
            fontWeight="bold"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {name}
          </Typography>
          <Typography level="h3" color="neutral" sx={{ textAlign: "center" }}>
            <Typography color="primary" level="h1" sx={{ paddingRight: 0.3 }}>
              {value}
            </Typography>
            /{targetValue}
          </Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default Habit;
