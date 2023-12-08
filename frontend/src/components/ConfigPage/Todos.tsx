import React, { ChangeEvent, useState } from "react";
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
  useApiMutation_config_todos,
  useApiQuery_config_todos,
} from "../../util/api-client";

import { Api } from "@api";

const Todos: React.FC = () => {
  const { data } = useApiQuery_config_todos();
  const { mutate, isLoading: isSaving } = useApiMutation_config_todos();
  const [provider, setProvider] = useState<"none" | "nextcloud">();

  function handleProviderChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value == "none" || e.target.value == "nextcloud") {
      setProvider(e.target.value);
    } else {
      console.error("Invald input value: ", e.target.value);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(fd) as {
      provider: "none" | "nextcloud";
      nextcloud_url: string;
      nextcloud_user: string;
      nextcloud_token: string;
    };
    const payload: Api.Config.Todos.type = { schema: 1 };

    if (data.provider == "nextcloud") {
      payload.nextcloud = {
        serverUrl: data.nextcloud_url,
        user: data.nextcloud_user,
        token: data.nextcloud_token,
      };
    }

    mutate(payload);
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
          value={provider ?? (data.nextcloud ? "nextcloud" : "none")}
          onChange={handleProviderChange}
        >
          <Radio value="none" label="None" />
          <Radio value="nextcloud" label="Nextcloud" />
        </RadioGroup>
      </FormControl>

      {((data.nextcloud && !provider) || provider == "nextcloud") && (
        <Card>
          <Typography level="h4">Nextcloud settings</Typography>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <Input
              name="nextcloud_url"
              defaultValue={
                data.nextcloud
                  ? data.nextcloud.serverUrl
                  : "https://example.com"
              }
            />
            <FormHelperText>
              Base URL for all API requests and opening the web interface, e.g.
              <code>https://example.com</code>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              name="nextcloud_user"
              defaultValue={data.nextcloud ? data.nextcloud.user : undefined}
            />
            <FormHelperText>
              User name whose todos shall be displayed.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Token</FormLabel>
            <Input
              name="nextcloud_token"
              defaultValue={data.nextcloud ? data.nextcloud.token : ""}
            />
            <FormHelperText>
              Application token that can be used instead of password for API
              requests. Can be created under{" "}
              <code>Settings &gt; User &gt; Security</code>.
            </FormHelperText>
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
export default Todos;
