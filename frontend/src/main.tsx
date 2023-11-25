import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { journalEditorRoute } from "./pages/JournalEditorModal.tsx";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./util/api-client.ts";
import { todosModalRoute } from "./pages/TodosModal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [todosModalRoute, journalEditorRoute],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
