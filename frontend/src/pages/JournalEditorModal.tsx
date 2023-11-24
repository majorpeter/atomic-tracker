import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Textarea,
} from "@mui/joy";
import { RouteObject, useNavigate } from "react-router-dom";

const JournalEditorModal: React.FC = () => {
  const navigate = useNavigate();

  function handleClose() {
    navigate("..");
  }

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Journal</DialogTitle>
        <DialogContent>
          <Textarea minRows={3}></Textarea>
        </DialogContent>
        <DialogActions>
          <Button color="success">Save</Button>
          <Button color="neutral" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export const journalEditorRoute: RouteObject = {
  path: "/journal",
  element: <JournalEditorModal />,
};

export default JournalEditorModal;
