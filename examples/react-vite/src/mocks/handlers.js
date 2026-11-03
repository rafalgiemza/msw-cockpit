import { http, HttpResponse } from "msw";
import { distributionListMock } from "./data/distributionList";

export const handlers = [
  http.get("/api/distributions", () => {
    // The scenario comes from the page URL, e.g. ?scenario=empty
    const scenario = new URL(window.location.href).searchParams.get("scenario");

    if (scenario === "empty") {
      return HttpResponse.json([]);
    }
    if (scenario === "error") {
      return HttpResponse.json({ message: "Internal server error" }, { status: 500 });
    }
    return HttpResponse.json(distributionListMock);
  }),
];
