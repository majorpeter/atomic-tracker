import React, { useRef, useState } from "react";
import { RouteObject, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Textarea,
} from "@mui/joy";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  useApiMutation_journal,
  useApiQuery_journal_day,
} from "../util/api-client";

import { getIsoDate } from "../util/formatter";

const JournalEditorModal: React.FC = () => {
  const navigate = useNavigate();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [userInput, setUserInput] = useState<string | undefined>();
  const { data } = useApiQuery_journal_day(date);

  const { mutate: mutateSave, isLoading: isSaving } = useApiMutation_journal();

  function handleDayPrev() {
    setDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
    setUserInput(undefined);
  }

  function handleDayNext() {
    setDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
    setUserInput(undefined);
  }

  function handleDayChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDate(new Date(event.target.value));
    setUserInput(undefined);
  }

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserInput(event.target.value);
  }

  function handleClose() {
    if (!isSaving) {
      navigate("..");
    }
  }

  function handleSave() {
    mutateSave({
      payload: { text: textAreaRef.current!.value },
      date: date,
    });
  }

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog>
        {!isSaving && <ModalClose />}
        <DialogTitle>Journal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex" }}>
            <IconButton onClick={handleDayPrev} disabled={isSaving}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Input
              sx={{ flexGrow: 1 }}
              slotProps={{
                input: {
                  type: "date",
                  value: getIsoDate(date),
                  onChange: handleDayChange,
                  disabled: isSaving,
                },
              }}
            />
            <IconButton onClick={handleDayNext} disabled={isSaving}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>

          <Textarea
            slotProps={{ textarea: { ref: textAreaRef } }}
            minRows={3}
            value={userInput || data?.text}
            onChange={handleInput}
            disabled={isSaving}
          ></Textarea>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleSave} loading={isSaving}>
            Save
          </Button>
          <Button color="neutral" onClick={handleClose} disabled={isSaving}>
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
