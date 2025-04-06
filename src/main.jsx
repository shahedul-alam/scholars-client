import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router/AppRouter";
import AuthContextProvider from "./contexts/AuthContextProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  </StrictMode>
);
