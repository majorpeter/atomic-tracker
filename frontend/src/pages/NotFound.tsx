import { RouteObject } from "react-router-dom";
import { Button, Typography } from "@mui/joy";
import { dashboardRoute } from "./Dashboard";

const NotFound: React.FC = () => {
  return (
    <>
      <Typography level="h1">Not found</Typography>
      <Typography>
        This page cannot be found: <code>{window.location.pathname}</code>
      </Typography>
      <Button component="a" href={dashboardRoute.path!}>
        Go to Dashboard
      </Button>
    </>
  );
};

export const notfoundFallbackRoute: RouteObject = {
  path: "*",
  element: <NotFound />,
};

export default NotFound;
