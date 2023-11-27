import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";

import App from "./App.tsx";
import "./index.css";
import { queryClient } from "./util/api-client.ts";

import { habitTrackerRoute } from "./pages/HabitTrackerModal.tsx";
import { todosModalRoute } from "./pages/TodosModal.tsx";
import { journalEditorRoute } from "./pages/JournalEditorModal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [todosModalRoute, journalEditorRoute, habitTrackerRoute],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
