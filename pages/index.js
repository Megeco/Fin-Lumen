import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    const res = await fetch("/api/get-stocks");
    const data = await res.json();
    setStocks(data || []);
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

  return (
    <div style={{ padding: 20 }}>
      <h1>Fin-Lumen Tracker</h1>
      <button onClick={updateAll}>🔄 Weekly Update</button>

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
            <th>Updated</th>
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
              <td>{s.pressure_score || "-"}</td>
              <td>{s.conviction || "-"}</td>
              <td>
                {s.updated_at
                  ? new Date(s.updated_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
