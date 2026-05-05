let stocks = [
  { name: "KPIT" },
  { name: "MAZDOCK" },
  { name: "SUZLON" }
];

export const db = {
  getAll: () => stocks,
  get: (name) => stocks.find(s => s.name === name),
  update: (name, data) => {
    stocks = stocks.map(s =>
      s.name === name ? { ...s, ...data, updated: new Date().toLocaleString() } : s
    );
  }
};