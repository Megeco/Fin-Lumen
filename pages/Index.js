import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    const res = await fetch("/api/get-stocks");
    const data = await res.json();
    setStocks(data);
  };

  const updateStock = async (name) => {
    await fetch("/api/update-stock", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    fetchStocks();
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
      <button onClick={updateAll}>🔄 Update All</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Phase</th>
            <th>Action</th>
            <th>Position</th>
            <th>AT</th>
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
              <td>{s.AT}</td>
              <td>{s.signal}</td>
              <td>{s.updated}</td>
              <td>
                <button onClick={() => updateStock(s.name)}>🔄</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}