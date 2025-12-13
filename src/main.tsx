import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Initialize stores
import { useAudioStore } from "./stores/audioStore";

// Initialize audio store
useAudioStore.getState().initialize();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
