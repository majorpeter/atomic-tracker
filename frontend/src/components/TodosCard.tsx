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

import { Link } from "react-router-dom";

import Todos from "./Todos";
import TodosActions from "./TodosActions";
import { todosModalRoute } from "../pages/TodosModal";

const TodosCard: React.FC = () => {
  return (
    <Card>
      <Typography fontSize="lg" fontWeight="lg">
        Todos
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
