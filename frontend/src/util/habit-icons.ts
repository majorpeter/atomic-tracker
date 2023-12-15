import { SvgIconComponent } from "@mui/icons-material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClassIcon from "@mui/icons-material/Class";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import PhoneIcon from "@mui/icons-material/Phone";
import ForestIcon from "@mui/icons-material/Forest";
import HotelIcon from "@mui/icons-material/Hotel";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

const icons: Record<string, SvgIconComponent> = {
  workout: FitnessCenterIcon,
  run: DirectionsRunIcon,
  bike: DirectionsBikeIcon,
  book: MenuBookIcon,
  journal: ClassIcon,
  selfImprovement: SelfImprovementIcon,
  phone: PhoneIcon,
  forest: ForestIcon,
  bed: HotelIcon,
  alarm: AlarmOnIcon,
  fastfood: FastfoodIcon,
  toast: BreakfastDiningIcon,
  beer: SportsBarIcon,
  cleaning: CleaningServicesIcon,
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
