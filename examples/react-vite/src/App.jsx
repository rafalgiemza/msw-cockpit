import { useEffect, useState } from "react";

export function App() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    fetch("/api/distributions")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setState({ status: "ready", data }))
      .catch((error) => setState({ status: "error", error: error.message }));
  }, []);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error") return <p>Something went wrong: {state.error}</p>;
  if (state.data.length === 0) return <p>No distributions yet.</p>;

  return (
    <ul>
      {state.data.map((d) => (
        <li key={d.id}>
          {d.recipient} — {d.status}
        </li>
      ))}
    </ul>
  );
}
