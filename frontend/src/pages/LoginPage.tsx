import { useRef } from "react";
import {
  RouteObject,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
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
  Typography,
} from "@mui/joy";

import GoogleIcon from "@mui/icons-material/Google";
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
  const loaderData = useLoaderData() as Api.Auth.Login.get_resp;
  const { mutate: loginMutate, isError } = useApiMutation_login((me) => {
    AppLocalStorage.setLanguage(me.language);
    getI18n().changeLanguage(me.language);

    navigate(dashboardRoute.path!);
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as Api.Auth.Login.post_type; // TODO type check :(
    loginMutate(data);
  }

  return (
    <>
      <Card>
        <form ref={formRef} onSubmit={handleSubmit}>
          <CardContent>
            {isError && (
              <Alert
                color="danger"
                startDecorator={<ErrorIcon />}
                sx={{ mb: 3 }}
              >
                Invalid credentials.
              </Alert>
            )}
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                autoFocus
                slotProps={{ input: { autoCapitalize: "off" } }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" required />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button type="submit">Sign in</Button>
          </CardActions>
        </form>
      </Card>

      {loaderData.social.google && (
        <Card sx={{ marginTop: "2em" }}>
          <CardContent
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>Social Login:</Typography>
            <Button
              component="a"
              href={Api.Auth.Login.Google.path}
              startDecorator={<GoogleIcon />}
            >
              Google
            </Button>
          </CardContent>
        </Card>
      )}
    </>
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
    return loginParams;
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
