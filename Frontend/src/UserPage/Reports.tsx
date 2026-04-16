import React, { useState, useMemo } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { Download } from "lucide-react";

/* ---------- Types ---------- */

interface Sale {
  id: number;
  date: string;
  medicine: string;
  qty: number;
  amount: number;
  status: string;
}

/* ---------- Main ---------- */

const Reports: React.FC = () => {
  const [sortKey, setSortKey] = useState<keyof Sale>("date");
  const [asc, setAsc] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [view, setView] = useState<"table" | "summary">("table");

  const sales: Sale[] = [
    {
      id: 1,
      date: "2026-02-06",
      medicine: "Paracetamol",
      qty: 10,
      amount: 500,
      status: "Completed",
    },
    {
      id: 2,
      date: "2026-02-06",
      medicine: "Amoxicillin",
      qty: 5,
      amount: 750,
      status: "Completed",
    },
    {
      id: 3,
      date: "2026-02-05",
      medicine: "Vitamin C",
      qty: 20,
      amount: 1000,
      status: "Pending",
    },
    {
      id: 4,
      date: "2026-02-04",
      medicine: "Ibuprofen",
      qty: 8,
      amount: 600,
      status: "Completed",
    },
  ];

  /* ---------- Sorting ---------- */

  const sortedSales = useMemo(() => {
    return [...sales].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA - valB : valB - valA;
      }
      return asc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [sortKey, asc]);

  /* ---------- Selection (FIXED) ---------- */

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selected.length === sortedSales.length) {
      setSelected([]);
    } else {
      setSelected(sortedSales.map((s) => s.id));
    }
  };

  /* ---------- Stats ---------- */

  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);

  const medicineMap: Record<string, number> = {};
  sales.forEach((s) => {
    medicineMap[s.medicine] = (medicineMap[s.medicine] || 0) + s.qty;
  });

  const topMedicines = Object.entries(medicineMap).sort((a, b) => b[1] - a[1]);

  /* ---------- Export ---------- */

  const handleExport = () => {
    const data =
      selected.length > 0
        ? sales.filter((s) => selected.includes(s.id))
        : sales;

    const csv =
      "Date,Medicine,Qty,Amount,Status\n" +
      data
        .map((s) => `${s.date},${s.medicine},${s.qty},${s.amount},${s.status}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "report.csv";
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        {/* Top */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports</h1>

          <div className="flex gap-3">
            <button
              onClick={() => setView(view === "table" ? "summary" : "table")}
              className="px-4 py-2 border rounded"
            >
              Toggle View
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* Summary */}
        {view === "summary" ? (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p>Total Revenue</p>
              <h2 className="text-xl font-bold">Rs {totalRevenue}</h2>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Top Medicines</p>
              {topMedicines.slice(0, 3).map(([name, qty]) => (
                <div key={name}>
                  {name} - {qty}
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p>Orders</p>
              <h2>{sales.length}</h2>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={toggleAll} />
                  </th>

                  {["date", "medicine", "qty", "amount", "status"].map(
                    (key) => (
                      <th
                        key={key}
                        className="cursor-pointer"
                        onClick={() => {
                          setSortKey(key as keyof Sale);
                          setAsc(!asc);
                        }}
                      >
                        {key.toUpperCase()}{" "}
                        {sortKey === key && (asc ? "↑" : "↓")}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {sortedSales.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    <td>{s.date}</td>
                    <td>{s.medicine}</td>
                    <td>{s.qty}</td>
                    <td>Rs {s.amount}</td>
                    <td>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
