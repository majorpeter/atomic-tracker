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
  useApiMutation_config_projects,
  useApiQuery_config_projects,
} from "../../util/api-client";

import { Api } from "@api";

const Projects: React.FC = () => {
  const { data } = useApiQuery_config_projects();
  const { mutate, isPending: isSaving } = useApiMutation_config_projects();
  const [issueTracker, setIssueTracker] = useState<"none" | "redmine">();

  function handleIssueTrackerChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value == "none" || e.target.value == "redmine") {
      setIssueTracker(e.target.value);
    } else {
      console.error("Invald input value: ", e.target.value);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(fd) as {
      issueTracker: string;
      redmine_url: string;
      redmine_api_key: string;
      redmine_inprogress_status_id: string;
      redmine_board_url: string;
    };
    const payload: Api.Config.Projects.type = { schema: 1 };

    if (data.issueTracker == "redmine") {
      payload.redmine = {
        url: data.redmine_url,
        api_key: data.redmine_api_key,
        inprogress_status_id: parseInt(data.redmine_inprogress_status_id),
        board_url:
          data.redmine_board_url.trim().length > 0
            ? data.redmine_board_url
            : undefined,
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
        <FormLabel>Issue Tracking System</FormLabel>
        <RadioGroup
          name="issueTracker"
          value={issueTracker ?? (data.redmine ? "redmine" : "none")}
          onChange={handleIssueTrackerChange}
        >
          <Radio value="none" label="None" />
          <Radio value="redmine" label="Redmine" />
        </RadioGroup>
      </FormControl>

      {((data.redmine && !issueTracker) || issueTracker == "redmine") && (
        <Card>
          <Typography level="h4">Redmine settings</Typography>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <Input
              name="redmine_url"
              defaultValue={
                data.redmine ? data.redmine.url : "https://example.com"
              }
            />
            <FormHelperText>
              Base URL for all API requests and opening the web interface, e.g.
              <code>https://example.com</code>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>API key</FormLabel>
            <Input
              name="redmine_api_key"
              defaultValue={data.redmine ? data.redmine.api_key : undefined}
            />
            <FormHelperText>
              Key can be created under <i>My account</i>. REST web service has
              to be enabled.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>In Progress status ID</FormLabel>
            <Input
              type="number"
              name="redmine_inprogress_status_id"
              defaultValue={
                data.redmine ? data.redmine.inprogress_status_id : 2
              }
            />
            <FormHelperText>
              All statuses are just plain-text labels in Redmine. By default,
              the In Progress gets assigned number 2.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Agile board URL</FormLabel>
            <Input
              name="redmine_board_url"
              defaultValue={data.redmine ? data.redmine.board_url : ""}
            />
            <FormHelperText>
              Optional. If an agile plugin is installed on this instance, you
              may want to access a kanban board via this URL.
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
export default Projects;
