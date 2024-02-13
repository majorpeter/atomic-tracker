import { useRef } from "react";
import { RouteObject, redirect, useNavigate } from "react-router-dom";
import { getI18n } from "react-i18next";

import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormLabel,
  Input,
} from "@mui/joy";

import ErrorIcon from "@mui/icons-material/Error";

import { Api } from "@api";
import {
  apiFetchLoginParams,
  apiFetchLogout,
  useApiMutation_login,
} from "../util/api-client";
import { dashboardRoute } from "./Dashboard";
import { installRoute } from "./InstallPage";
import { AppLocalStorage } from "../util/local-storage";

const LoginPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const { mutate: loginMutate, isError } = useApiMutation_login((me) => {
    AppLocalStorage.setLanguage(me.language);
    getI18n().changeLanguage(me.language);

    navigate(dashboardRoute.path!);
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as Api.Auth.Login.post_type;
    loginMutate(data);
  }

  return (
    <Card>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
          {isError && (
            <Alert color="danger" startDecorator={<ErrorIcon />} sx={{ mb: 3 }}>
              Invalid credentials.
            </Alert>
          )}
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="userName"
              autoFocus
              slotProps={{ input: { autoCapitalize: "off" } }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button type="submit">Sign in</Button>
        </CardActions>
      </form>
    </Card>
  );
};

export const loginRoute: RouteObject = {
  path: "/login",
  element: <LoginPage />,
  loader: async () => {
    const loginParams = await apiFetchLoginParams();
    if (!loginParams.installed) {
      return redirect(installRoute.path!);
    }
    return null;
  },
};

export const logoutRoute: RouteObject = {
  path: "/logout",
  loader: async () => {
    if (await apiFetchLogout()) {
      return redirect(loginRoute.path!);
    }
    return redirect("/");
  },
};

export default LoginPage;
