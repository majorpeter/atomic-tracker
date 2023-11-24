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
  title: string;
  icon: string;
  value: number;
  target: number;
};

const Habit: React.FC<HabitProps> = ({ title, icon, value, target }) => {
  const Icon = icons[icon] || fallbackIcon;
  let progressPercent = (value / target) * 100;
  if (progressPercent > 100) {
    progressPercent = 100;
  }

  return (
    <Card>
      <CardContent orientation="horizontal">
        <CircularProgress size="lg" determinate value={progressPercent}>
          <Icon />
        </CircularProgress>
        <CardContent>
          <Typography level="body-md" fontWeight="bold">
            {title}
          </Typography>
          <Typography level="h3" color="neutral">
            <Typography color="primary" level="h1" sx={{ paddingRight: 0.3 }}>
              {value}
            </Typography>
            /{target}
          </Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default Habit;
