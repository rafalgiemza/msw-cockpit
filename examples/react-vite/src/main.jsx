import { createRoot } from "react-dom/client";
import { App } from "./App";

async function initMSW() {
  if (import.meta.env.VITE_MSW_ENABLED !== "true") {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

initMSW().then(() => {
  createRoot(document.getElementById("root")).render(<App />);
});
