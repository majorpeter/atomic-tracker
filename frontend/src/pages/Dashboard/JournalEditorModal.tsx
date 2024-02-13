import React, { useRef, useState } from "react";
import { RouteObject, useNavigate, useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import {
  Alert,
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
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";

import {
  useApiMutation_journal,
  useApiQuery_journal_day,
} from "../../util/api-client";

import { getIsoDate } from "../../util/formatter";
import { useResponsiveBreakpoint } from "../../util/responsive-breakpoint";

import YesNoModal from "./YesNoModal";

const JournalEditorModal: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ date: string }>();
  const { t } = useTranslation();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [userInput, setUserInput] = useState<string | undefined>();
  const [yesNoState, setYesNoState] = useState<
    React.ComponentProps<typeof YesNoModal>
  >({ open: false });
  const { data } = useApiQuery_journal_day(new Date(params.date!));

  const responsiveSmOrLarger = useResponsiveBreakpoint("sm");

  const {
    mutate: mutateSave,
    isPending: isSaving,
    isError: saveFailed,
  } = useApiMutation_journal(onSaveSuccessful);

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
    if (isSaving) {
      return;
    }

    if (userInput === undefined) {
      navigate("..");
    } else {
      showYesNoModal(
        t("unsavedChanges", "Unsaved Changes"),
        t("discardChangesClose", "Discard changes and close editor?"),
        () => {
          navigate("..");
        }
      );
    }
  }

  function showYesNoModal(
    title: string,
    message: string,
    onYesClicked: () => void
  ) {
    setYesNoState({
      open: true,
      title,
      message,
      onYesClicked() {
        onYesClicked();
        setYesNoState({ open: false });
      },
      onNoClicked() {
        setYesNoState({ open: false });
      },
    });
  }

  function handleSave() {
    mutateSave({
      payload: { text: textAreaRef.current!.value },
      date: new Date(params.date!),
    });
  }

  function onSaveSuccessful() {
    // this disables the save button since there's no unsaved change anymore
    setUserInput(undefined);
  }

  return (
    <>
      <Modal open onClose={handleClose}>
        <ModalDialog layout={responsiveSmOrLarger ? "center" : "fullscreen"}>
          {!isSaving && <ModalClose />}
          <DialogTitle>
            <Trans i18nKey="journal">Journal</Trans>
          </DialogTitle>
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
                  autoFocus: true,
                  autocapitalize: "off",
                },
              }}
              value={userInput !== undefined ? userInput : data?.text}
              onChange={handleInput}
              disabled={isSaving}
              sx={{
                width: { sm: 400 },
                minHeight: 200,
                height: "100%",
              }}
            ></Textarea>

            {saveFailed && (
              <Alert
                color="danger"
                variant="outlined"
                startDecorator={<WarningIcon />}
              >
                <Trans i18nKey="savingFailedTryAgain">
                  Saving failed, please try again.
                </Trans>
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="success"
              onClick={handleSave}
              loading={isSaving}
              disabled={userInput === undefined}
              startDecorator={<DoneIcon />}
            >
              <Trans i18nKey="save">Save</Trans>
            </Button>
            <Button
              color="neutral"
              onClick={handleClose}
              disabled={isSaving}
              startDecorator={<CancelIcon />}
            >
              <Trans i18nKey="close">Close</Trans>
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <YesNoModal {...yesNoState} />
    </>
  );
};

export const journalEditorRoute: RouteObject = {
  path: "/dashboard/journal/:date",
  element: <JournalEditorModal />,
};

export default JournalEditorModal;
