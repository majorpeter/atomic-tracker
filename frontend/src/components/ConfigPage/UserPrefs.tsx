import { useRef } from "react";
import { getI18n } from "react-i18next";

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Option,
  Select,
  Sheet,
} from "@mui/joy";

import { AppLocalStorage } from "../../util/local-storage";
import { useApiMutation_config_user } from "../../util/api-client";

const LANGUAGES = {
  en: "English",
  hu: "Hungarian",
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
        <FormLabel>Interface Language</FormLabel>
        <Select name="language" defaultValue={AppLocalStorage.getLanguage()}>
          {Object.entries(LANGUAGES).map(([id, text]) => (
            <Option key={id} value={id}>
              {text}
            </Option>
          ))}
        </Select>
        <FormHelperText>Only affects date formatting now.</FormHelperText>
      </FormControl>
      <Sheet sx={{ mt: 2 }}>
        <Button onClick={handleSave}>Save</Button>
      </Sheet>
    </form>
  );
};

export default UserPrefs;
