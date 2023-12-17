import { useRef } from "react";
import { Trans, getI18n } from "react-i18next";

import {
  Button,
  FormControl,
  FormLabel,
  Option,
  Select,
  Sheet,
} from "@mui/joy";

import { AppLocalStorage } from "../../util/local-storage";
import { useApiMutation_config_user } from "../../util/api-client";

const LANGUAGES = {
  en: "English",
  hu: "Hungarian / Magyar",
};

const UserPrefs: React.FC = () => {
  const formRef = useRef(null);
  const { mutate: mutateSave } = useApiMutation_config_user((me) => {
    AppLocalStorage.setLanguage(me.language);
    getI18n().changeLanguage(me.language);
  });

  function handleSave() {
    const formData = Object.fromEntries(new FormData(formRef.current!)) as {
      language: string;
    };

    mutateSave(formData);
  }

  return (
    <form ref={formRef}>
      <FormControl>
        <FormLabel>
          <Trans i18nKey="interfaceLang">Interface Language</Trans>
        </FormLabel>
        <Select name="language" defaultValue={AppLocalStorage.getLanguage()}>
          {Object.entries(LANGUAGES).map(([id, text]) => (
            <Option key={id} value={id}>
              {text}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Sheet sx={{ mt: 2 }}>
        <Button onClick={handleSave}>
          <Trans i18nKey="save">Save</Trans>
        </Button>
      </Sheet>
    </form>
  );
};

export default UserPrefs;
