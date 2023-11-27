import { Card, CardContent, CircularProgress, Typography } from "@mui/joy";
import { SvgIconComponent } from "@mui/icons-material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClassIcon from "@mui/icons-material/Class";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

const icons: Record<string, SvgIconComponent> = {
  workout: FitnessCenterIcon,
  book: MenuBookIcon,
  journal: ClassIcon,
  selfImprovement: SelfImprovementIcon,
};
const fallbackIcon = QuestionMarkIcon;

export type HabitProps = {
  name: string;
  icon: string;
  value: number;
  targetValue: number;
  historicalPercent: number;
};

const Habit: React.FC<HabitProps> = ({
  name,
  icon,
  value,
  targetValue,
  historicalPercent,
}) => {
  const Icon = icons[icon] || fallbackIcon;

  return (
    <Card>
      <CardContent orientation="horizontal">
        <CircularProgress size="lg" determinate value={historicalPercent}>
          <Icon />
        </CircularProgress>
        <CardContent>
          <Typography level="body-md" fontWeight="bold">
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
