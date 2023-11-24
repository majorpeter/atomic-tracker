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
import { useApiMutation, useApiQuery } from "../util/api-client";
import { useRef } from "react";

const JournalEditorModal: React.FC = () => {
  const navigate = useNavigate();

  const textArea = useRef<HTMLTextAreaElement>(null);
  const { data } = useApiQuery.journal();
  const mutation = useApiMutation.journal();

  function handleClose() {
    navigate("..");
  }

  function handleSave() {
    mutation.mutate(
      { items: textArea.current!.value.split("\n") },
      {
        onSuccess: handleClose,
      }
    );
  }

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Journal</DialogTitle>
        <DialogContent>
          <Textarea
            slotProps={{ textarea: { ref: textArea } }}
            minRows={3}
            defaultValue={data?.items.join("\n")}
          ></Textarea>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleSave}>
            Save
          </Button>
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
