import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import App from "./App.tsx";
import "./index.css";
import { queryClient } from "./util/api-client.ts";

import { dashboardRoute } from "./pages/Dashboard.tsx";
import { configPageRoute } from "./pages/ConfigPage.tsx";
import { loginRoute, logoutRoute } from "./pages/LoginPage.tsx";
import { installRoute } from "./pages/InstallPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: () => redirect(dashboardRoute.path!),
  },
  loginRoute,
  logoutRoute,
  dashboardRoute,
  configPageRoute,
  installRoute,
]);

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "atomicCache",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, buster: BUILD_NUMBER.toString() }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
