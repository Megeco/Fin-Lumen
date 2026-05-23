import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    const res = await fetch("/api/get-stocks");
    const data = await res.json();
    const sorted = (data || []).sort((a, b) =>
  a.name.localeCompare(b.name)
);

setStocks(sorted);
  };

  const updateAll = async () => {
    await fetch("/api/update-all", {
      method: "GET",
      cache: "no-store"
    });
    fetchStocks();
  };

  useEffect(() => {
    fetchStocks();
  }, []);


  const recommendationColors = {
  "FULL ATTACK": "#14532d",
  "AGGRESSIVE ACCUMULATION": "#166534",
  "CORE ACCUMULATION": "#16a34a",
  "CORE HOLD": "#2563eb",
  "STAGGERED ADD": "#06b6d4",
  "SATELLITE TRIM": "#f59e0b",
  "DISTRIBUTE RALLIES": "#dc2626",
  "AVOID": "#7f1d1d",
  "NEUTRAL": "#6b7280"
};
  
  return (
    <div style={{ padding: 20 }}>
      <h1>Fin-Lumen Tracker</h1>
      <button onClick={updateAll}>🔄 Weekly Update</button>

      <p>
  <p>
  Last Full System Update:{" "}
  {stocks.length > 0
    ? new Date(
        Math.max(
          ...stocks.map((s) =>
            s.updated_at ? new Date(s.updated_at).getTime() : 0
          )
        )
      ).toLocaleString()
    : "-"}
</p>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Week Bias</th>
            <th>Action Plan</th>
            <th>Position</th>
            <th>Astro Window</th>
            <th>PMP</th>
            <th>Signal</th>
            <th>Position Action</th>
            <th>Early Signal</th>
            <th>Next Week</th> {/* 🔥 NEW COLUMN */}
            <th>Pressure</th>
            <th>Conviction</th>
            <th>Momentum</th>
            <th>M-Score</th>
            <th>Recommendation</th>
            <th>2027 Cycle</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.week_bias || "-"}</td>
              <td>{s.action_plan || "-"}</td>
              <td>{s.positioning || "-"}</td>
              <td>{s.astro_window || "-"}</td>
              <td>{s.pmp_forecast || "-"}</td>
              <td>{s.signal || "-"}</td>
              <td>{s.position_action || "-"}</td>
              <td>{s.early_signal || "NONE"}</td>
              <td>{s.next_week_signal || "STABLE"}</td> {/* 🔥 DISPLAY */}
              <td>{s.pressure_score ?? "-"}</td>
              <td>{s.conviction || "-"}</td>
              <td>{s.momentum_state || "-"}</td>
              <td>{s.momentum_score ?? "-"}</td>

              <td
  style={{
    backgroundColor:
      recommendationColors[s.recommendation] || "#111827",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: "6px",
    padding: "6px 10px"
  }}
>
  {s.recommendation || "-"}
</td>

<td>{s.cycle_2027 || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
