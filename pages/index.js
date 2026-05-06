import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      const res = await fetch("/api/get-stocks");
      const data = await res.json();
      setStocks(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Update single stock
  const updateStock = async (name) => {
    try {
      await fetch("/api/update-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      fetchStocks();
    } catch (err) {
      console.error("Update stock error:", err);
    }
  };

  // Update all stocks
  const updateAll = async () => {
    try {
      await fetch("/api/update-all");
      fetchStocks();
    } catch (err) {
      console.error("Update all error:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Fin-Lumen Tracker</h1>

      <button
        onClick={updateAll}
        style={{
          padding: "8px 12px",
          marginTop: 10,
          cursor: "pointer",
        }}
      >
        🔄 Update All
      </button>

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: 20, borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Stock</th>
            <th>Phase</th>
            <th>Action</th>
            <th>Position</th>
            <th>AT</th>
            <th>DZ</th>
            <th>Signal</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.phase}</td>
              <td>{s.action}</td>
              <td>{s.positioning}</td>

              <td>{s.at ? s.at.toFixed(2) : ""}</td>
              <td>{s.dz ? s.dz.toFixed(2) : ""}</td>

              <td
                style={{
                  color:
                    s.signal === "BUY"
                      ? "green"
                      : s.signal === "BUILD"
                      ? "orange"
                      : s.signal === "AVOID"
                      ? "red"
                      : "black",
                  fontWeight: "bold",
                }}
              >
                {s.signal}
              </td>

              <td>
                {s.updated_at
                  ? new Date(s.updated_at).toLocaleString()
                  : ""}
              </td>

              <td>
                <button
                  onClick={() => updateStock(s.name)}
                  style={{ cursor: "pointer" }}
                >
                  🔄
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
