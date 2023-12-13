import {
  Card,
  CardContent,
  CircularProgress,
  ColorPaletteProp,
  Typography,
} from "@mui/joy";

import { Link } from "react-router-dom";
import { habitTrackerRoute } from "../../pages/Dashboard/HabitTrackerModal";
import { getHabitIconByName } from "../../util/habit-icons";

export type HabitProps = {
  id: number;
  name: string;
  type: "good" | "bad";
  iconName: string | null;
  value: number;
  targetValue: number;
  historicalPercent: number;
};

const Habit: React.FC<HabitProps> = ({
  id,
  name,
  type,
  iconName,
  value,
  targetValue,
  historicalPercent,
}) => {
  const Icon = getHabitIconByName(iconName);

  let color: ColorPaletteProp = "neutral";
  if (type == "good") {
    if (value == 0) {
      color = "danger";
    } else if (historicalPercent < 75) {
      color = "primary";
    } else {
      color = "success";
    }
  } else if (type == "bad") {
    if (historicalPercent < 1) {
      color = "neutral";
    } else if (historicalPercent < 75) {
      color = "warning";
    } else {
      color = "danger";
    }
  }

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
          color={color}
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
            <Typography color={color} level="h1" sx={{ paddingRight: 0.3 }}>
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
