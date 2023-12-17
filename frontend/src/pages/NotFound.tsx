import { RouteObject } from "react-router-dom";
import { Trans } from "react-i18next";

import { Button, Typography } from "@mui/joy";
import { dashboardRoute } from "./Dashboard";

const NotFound: React.FC = () => {
  return (
    <>
      <Typography level="h1">
        <Trans i18nKey="notFound">Not found</Trans>
      </Typography>
      <Typography>
        <Trans
          i18nKey="thisPageCannotBeFound"
          values={{ path: window.location.pathname }}
          tOptions={{
            interpolation: { escapeValue: false },
          }}
        >
          This page cannot be found: <code>{"{{path}}"}</code>
        </Trans>
      </Typography>
      <Button component="a" href={dashboardRoute.path!}>
        <Trans i18nKey="gotoDashboard">Go to Dashboard</Trans>
      </Button>
    </>
  );
};

export const notfoundFallbackRoute: RouteObject = {
  path: "*",
  element: <NotFound />,
};

export default NotFound;
