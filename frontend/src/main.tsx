import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { QueryClientProvider } from "react-query";

import App from "./App.tsx";
import "./index.css";
import { queryClient } from "./util/api-client.ts";

import { dashboardRoute } from "./pages/Dashboard.tsx";
import { configPageRoute } from "./pages/ConfigPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: () => redirect(dashboardRoute.path!),
  },
  dashboardRoute,
  configPageRoute,
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
