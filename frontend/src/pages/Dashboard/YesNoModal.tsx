import { Trans } from "react-i18next";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

const YesNoModal: React.FC<
  | {
      open: false;
    }
  | {
      open: true;
      title: string;
      message: string;
      onYesClicked: () => void;
      onNoClicked: () => void;
    }
> = (props) => {
  if (props.open) {
    return (
      <Modal open>
        <ModalDialog>
          <DialogTitle>
            <Typography startDecorator={<HelpOutlineIcon />}>
              {props.title}
            </Typography>
          </DialogTitle>
          <DialogContent>{props.message}</DialogContent>
          <DialogActions>
            <Button
              color="success"
              onClick={props.onYesClicked}
              startDecorator={<DoneIcon />}
            >
              <Trans i18nKey="yes">Yes</Trans>
            </Button>
            <Button
              color="danger"
              onClick={props.onNoClicked}
              startDecorator={<ClearIcon />}
            >
              <Trans i18nKey="no">No</Trans>
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    );
  }
  return null;
};

export default YesNoModal;
