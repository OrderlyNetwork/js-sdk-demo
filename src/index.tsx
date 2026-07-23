import React from "react";
import ReactDOM from "react-dom/client";
import AppRoute from "./routes";
import { registerChunkLoadRecovery } from "./utils/chunkLoadRecovery";
import "./styles/index.css";

registerChunkLoadRecovery();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppRoute />,
);
