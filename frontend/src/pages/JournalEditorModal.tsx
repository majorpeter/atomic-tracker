import React, { useRef, useState } from "react";
import { RouteObject, useNavigate, useParams } from "react-router-dom";

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
  const params = useParams<{ date: string }>();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [userInput, setUserInput] = useState<string | undefined>();
  const { data } = useApiQuery_journal_day(new Date(params.date!));

  const { mutate: mutateSave, isLoading: isSaving } = useApiMutation_journal();

  function navigateToDate(date: Date) {
    navigate(journalEditorRoute.path!.replace(":date", getIsoDate(date)));
  }

  function handleDayPrev() {
    const d = new Date(params.date!);
    d.setDate(d.getDate() - 1);
    navigateToDate(d);

    setUserInput(undefined);
  }

  function handleDayNext() {
    const d = new Date(params.date!);
    d.setDate(d.getDate() + 1);
    navigateToDate(d);
  }

  function handleDayChange(event: React.ChangeEvent<HTMLInputElement>) {
    navigateToDate(new Date(event.target.value));
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
      date: new Date(params.date!),
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
                  value: params.date,
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
            slotProps={{
              textarea: {
                ref: textAreaRef,
              },
            }}
            value={userInput || data?.text}
            onChange={handleInput}
            disabled={isSaving}
            sx={{
              width: 400,
              height: 200,
            }}
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
  path: "/journal/:date",
  element: <JournalEditorModal />,
};

export default JournalEditorModal;
