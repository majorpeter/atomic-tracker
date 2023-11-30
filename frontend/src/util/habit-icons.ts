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

export function getHabitIconNames() {
  return Object.keys(icons);
}

export function getHabitIconByName(name?: string | null) {
  if (name) {
    return icons[name] || fallbackIcon;
  }
  return fallbackIcon;
}
