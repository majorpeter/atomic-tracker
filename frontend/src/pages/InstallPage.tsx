import { useState } from "react";
import { RouteObject, redirect, useNavigate } from "react-router-dom";

import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";

import { KeyboardArrowRight, TipsAndUpdates } from "@mui/icons-material";

import {
  apiFetchLoginParams,
  useApiMutation_install,
} from "../util/api-client";
import { loginRoute } from "./LoginPage";

const InstallPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { mutate: mutateInstall, isLoading } = useApiMutation_install(() => {
    navigate(loginRoute.path!);
  });
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as { userName: string; password: string; password2: string };

    if (data.userName.length == 0) {
      setErrorMessage("User name required!");
      return;
    }
    if (data.password != data.password2) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    if (data.password.length < 6) {
      setErrorMessage("Password too short! Minimum 6 characters.");
      return;
    }

    setErrorMessage(undefined);

    mutateInstall({
      userName: data.userName,
      password: data.password,
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Typography level="h1">Welcome to Atomic Tracker!</Typography>
          <Alert
            startDecorator={<TipsAndUpdates />}
            sx={{ mb: 2 }}
            color="primary"
          >
            Let's get started by creating a user account for this installation!
          </Alert>
          {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input name="userName" autoFocus disabled={isLoading} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" disabled={isLoading} />
          </FormControl>
          <FormControl>
            <FormLabel>Repeat Password</FormLabel>
            <Input name="password2" type="password" disabled={isLoading} />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            endDecorator={<KeyboardArrowRight />}
            loading={isLoading}
          >
            Create Account
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export const installRoute: RouteObject = {
  path: "/install",
  element: <InstallPage />,
  loader: async () => {
    const loginParams = await apiFetchLoginParams();
    if (loginParams.installed) {
      return redirect("/");
    }
    return null;
  },
};

export default InstallPage;
