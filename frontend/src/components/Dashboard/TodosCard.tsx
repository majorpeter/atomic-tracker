import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Divider,
  IconButton,
  Typography,
} from "@mui/joy";

import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import Todos from "./Todos";
import TodosActions from "./TodosActions";
import { todosModalRoute } from "../../pages/Dashboard/TodosModal";

const TodosCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        {t("todos", "Todos")}
      </Typography>
      <IconButton
        component={Link}
        to={todosModalRoute.path!}
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
      >
        <OpenInFullIcon />
      </IconButton>

      <Divider />
      <CardContent>
        <Todos isFullscreen={false} />
      </CardContent>
      <CardOverflow variant="soft">
        <Divider inset="context" />

        <CardActions>
          <TodosActions />
        </CardActions>
      </CardOverflow>
    </Card>
  );
};

export default TodosCard;
