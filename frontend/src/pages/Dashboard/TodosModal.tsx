import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";

import { RouteObject, useNavigate } from "react-router-dom";
import { Trans } from "react-i18next";

import Todos from "../../components/Dashboard/Todos";
import TodosActions from "../../components/Dashboard/TodosActions";

const TodosModal: React.FC = () => {
  const navigate = useNavigate();

  function handleClose() {
    navigate("..");
  }

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog layout="fullscreen">
        <DialogTitle>
          <Trans i18nKey="todos">Todos</Trans>
        </DialogTitle>
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
  path: "/dashboard/todos",
  element: <TodosModal />,
};
export default TodosModal;
