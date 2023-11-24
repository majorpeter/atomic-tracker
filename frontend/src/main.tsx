import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { journalEditorRoute } from "./pages/JournalEditorModal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [journalEditorRoute],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
