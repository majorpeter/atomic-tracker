import React, { ChangeEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { data } = useApiQuery_config_todos();
  const { mutate, isPending: isSaving } = useApiMutation_config_todos();
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
        <FormLabel>
          <Trans i18nKey="provider">Provider</Trans>
        </FormLabel>
        <RadioGroup
          name="provider"
          value={provider ?? (data.nextcloud ? "nextcloud" : "none")}
          onChange={handleProviderChange}
        >
          <Radio value="none" label={t("none", "None")} />
          <Radio value="nextcloud" label="Nextcloud" />
        </RadioGroup>
      </FormControl>

      {((data.nextcloud && !provider) || provider == "nextcloud") && (
        <Card>
          <Typography level="h4">
            <Trans i18nKey="sg_settings" values={{ sg: "Nextcloud" }}>
              {"{{sg}}"} settings
            </Trans>
          </Typography>
          <FormControl>
            <FormLabel>
              <Trans i18nKey="url">URL</Trans>
            </FormLabel>
            <Input
              name="nextcloud_url"
              defaultValue={
                data.nextcloud
                  ? data.nextcloud.serverUrl
                  : "https://example.com"
              }
            />
            <FormHelperText>
              <Trans i18nKey="baseUrlHelperText">
                Base URL for all API requests and opening the web interface,
                e.g.
                <code>https://example.com</code>
              </Trans>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>
              <Trans i18nKey="userName">User name</Trans>
            </FormLabel>
            <Input
              name="nextcloud_user"
              defaultValue={data.nextcloud ? data.nextcloud.user : undefined}
            />
            <FormHelperText>
              <Trans i18nKey="userNameTodosHelper">
                User name whose todos shall be displayed.
              </Trans>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>
              <Trans i18nKey="token">Token</Trans>
            </FormLabel>
            <Input
              name="nextcloud_token"
              defaultValue={data.nextcloud ? data.nextcloud.token : ""}
            />
            <FormHelperText>
              <Trans i18nKey="applicationTokenHelper">
                Application token that can be used instead of password for API
                requests. Can be created under{" "}
                <code>Settings &gt; User &gt; Security</code>.
              </Trans>
            </FormHelperText>
          </FormControl>
        </Card>
      )}

      <Stack sx={{ mt: 2 }}>
        <Button type="submit" loading={isSaving} startDecorator={<SaveIcon />}>
          <Trans i18nKey="save">Save</Trans>
        </Button>
      </Stack>
    </form>
  );
};
export default Todos;
