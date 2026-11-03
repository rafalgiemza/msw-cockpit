import { setupWorker } from "msw/browser";
import { setupMswCockpit } from "msw-cockpit";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

setupMswCockpit({ worker });
