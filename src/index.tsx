import React from "react";
import ReactDOM from "react-dom/client";
import AppRoute from "./routes";
import { initSentryBrowser } from "./sentry";
import { registerChunkLoadRecovery } from "./utils/chunkLoadRecovery";
import "./styles/index.css";

initSentryBrowser();
registerChunkLoadRecovery();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppRoute />,
);
