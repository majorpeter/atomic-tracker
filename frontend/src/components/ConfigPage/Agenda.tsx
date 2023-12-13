import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/joy";

import SaveIcon from "@mui/icons-material/Save";

import {
  useApiQuery_config_agenda_state,
  apiFetchGoogleCalendarAuthUrl,
  useApiMutation_config_agenda,
} from "../../util/api-client";

const Agenda: React.FC = () => {
  const { data } = useApiQuery_config_agenda_state();
  const { mutate, isPending: isSaving } = useApiMutation_config_agenda();
  const filePickerRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  const gCalCode = sp.get("code");
  const [provider, setProvider] = useState<undefined | "none" | "google">(
    gCalCode != null ? "google" : undefined
  );

  function handleProviderChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value == "none" || e.target.value == "google") {
      setProvider(e.target.value);
    } else {
      console.error("Invald input value: ", e.target.value);
    }
  }

  function handleBrowseClientSecret(_: React.MouseEvent<HTMLButtonElement>) {
    filePickerRef.current!.click();
  }

  function handleClientSecretBrowsed(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const f = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (ev: ProgressEvent<FileReader>) => {
        const credentials = JSON.parse(ev.target!.result as string) as {
          installed: { client_id: string; client_secret: string };
        };
        const authUrl = await apiFetchGoogleCalendarAuthUrl({
          client_id: credentials.installed.client_id,
          client_secret: credentials.installed.client_secret,
          redirect_uri: window.location.href.split("?")[0] + "?agenda",
        });

        // redirect to google oauth screen
        window.location.href = authUrl.url;
      };
      reader.readAsText(f);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(fd) as {
      provider: "none" | "google";
    };

    let vars: Parameters<typeof mutate>[0] = {};
    if (data.provider == "google") {
      if (!gCalCode) {
        alert("New Token required for saving (for now).");
        return;
      }
      vars = {
        google: {
          code: gCalCode,
        },
      };
    }

    mutate(vars);
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSave}>
      <FormControl>
        <FormLabel>Provider</FormLabel>
        <RadioGroup
          name="provider"
          value={provider ?? (data.provider == "google" ? "google" : "none")}
          onChange={handleProviderChange}
        >
          <Radio value="none" label="None" />
          <Radio value="google" label="Google Calendar" />
        </RadioGroup>
      </FormControl>

      {((data.provider == "google" && !provider) || provider == "google") && (
        <Card>
          <Typography level="h4">Google Calendar settings</Typography>
          <FormControl>
            <FormLabel>Application Client Credentials</FormLabel>
            <Input
              readOnly
              endDecorator={
                <Button onClick={handleBrowseClientSecret}>Browse...</Button>
              }
              value={
                gCalCode
                  ? "New Code: " + gCalCode
                  : data.provider == "google"
                  ? "(Saved Token)"
                  : "(not configured)"
              }
            />
            <FormHelperText>
              This{" "}
              <code>
                client_secret_SOMETHING.apps.googleusercontent.com.json
              </code>{" "}
              file has to be created in{" "}
              <a href="https://console.cloud.google.com/" target="_blank">
                Google Cloud Console
              </a>
              . Would be preconfigured if this app was not self-hosted.
            </FormHelperText>
            <input
              ref={filePickerRef}
              onChange={handleClientSecretBrowsed}
              type="file"
              accept=".json"
              style={{ display: "none" }}
            />
          </FormControl>
        </Card>
      )}

      <Stack sx={{ mt: 2 }}>
        <Button type="submit" loading={isSaving} startDecorator={<SaveIcon />}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default Agenda;
