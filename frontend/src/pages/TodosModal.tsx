import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";

import { RouteObject, useNavigate } from "react-router-dom";

import Todos from "../components/Todos";
import TodosActions from "../components/TodosActions";

const TodosModal: React.FC = () => {
  const navigate = useNavigate();

  function handleClose() {
    navigate("..");
  }

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog layout="fullscreen">
        <DialogTitle>Todos</DialogTitle>
        <ModalClose />
        <DialogContent>
          <Todos isFullscreen={true} />
        </DialogContent>
        <DialogActions sx={{ flexDirection: "initial" }}>
          <TodosActions />
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export const todosModalRoute: RouteObject = {
  path: "/todos",
  element: <TodosModal />,
};
export default TodosModal;
