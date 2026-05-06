import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    try {
      const res = await fetch("/api/get-stocks");
      const data = await res.json();
      setStocks(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const updateAll = async () => {
    await fetch("/api/update-all");
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
              <td>{s.pmp || "-"}</td> {/* ✅ FIXED */}
              <td>{s.signal || "-"}</td>
              <td>{s.position_action || "-"}</td>

              <td>
                {s.updated_at
                  ? new Date(s.updated_at).toLocaleString()
                  : "-"}
              </td> {/* ✅ SAFE DATE */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
