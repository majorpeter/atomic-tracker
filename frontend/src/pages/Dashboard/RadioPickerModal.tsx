import { RouteObject, useNavigate } from "react-router-dom";
import { Trans } from "react-i18next";

import {
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemDecorator,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import RadioIcon from "@mui/icons-material/Radio";

import {
  apiQuery_radio,
  queryClient,
  useApiQuery_radio,
} from "../../util/api-client";

import { AppLocalStorage } from "../../util/local-storage";

const RadioPickerModal: React.FC = () => {
  const navigate = useNavigate();
  const { data, refetch } = useApiQuery_radio();
  const selectedIndex = AppLocalStorage.getRadioIndex();

  function handleClose() {
    navigate("..");
  }

  function handleSelect(index: number) {
    AppLocalStorage.setRadioIndex(index);
    refetch(); // this triggers an update on the RadioBlock (without using a context)
    handleClose();
  }

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>
          <Trans i18nKey="selectRadio">Select Radio...</Trans>
        </DialogTitle>
        <DialogContent>
          <List>
            {data?.stations.map((item, index) => (
              <ListItemButton
                key={index}
                selected={index === selectedIndex}
                onClick={() => handleSelect(index)}
              >
                <ListItemDecorator>
                  <RadioIcon />
                </ListItemDecorator>
                {item.name}
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

async function loader() {
  await queryClient.prefetchQuery(apiQuery_radio);
  return null;
}

export const radioPickerRoute: RouteObject = {
  path: "/dashboard/radios",
  element: <RadioPickerModal />,
  loader,
};

export default RadioPickerModal;
