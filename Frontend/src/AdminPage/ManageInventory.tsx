import React, { useState, useMemo } from "react";
import Header from "../AdminComponents/Header";
import Footer from "../AdminComponents/Footer";
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  ArrowUpDown,
} from "lucide-react";

/* ---------- Stock Card ---------- */

const StockCard = ({
  title,
  value,
  gradient,
  icon,
}: {
  title: string;
  value: string;
  gradient: string;
  icon: React.ReactNode;
}) => (
  <div className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-gray-200">
    <div
      className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl transition-all duration-500 group-hover:opacity-40`}
    />
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-bold mt-1">{value}</h2>
    <div
      className={`mt-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}
    >
      {icon}
    </div>
  </div>
);

/* ---------- Main Component ---------- */

const ManagerInventory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "In Stock" | "Low Stock" | "Critical">("All");

  const medicines = [
    { name: "Paracetamol", stock: 120, price: "Rs 50" },
    { name: "Amoxicillin", stock: 25, price: "Rs 150" },
    { name: "Vitamin C", stock: 200, price: "Rs 30" },
    { name: "Insulin", stock: 5, price: "Rs 500" },
  ];

  const getStatus = (stock: number) => {
    if (stock <= 5) return "Critical";
    if (stock <= 30) return "Low Stock";
    return "In Stock";
  };

  const filtered = useMemo(() => {
    return medicines
      .filter((med) => {
        const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
        const status = getStatus(med.stock);
        const matchesStatus = statusFilter === "All" || status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (sortAsc ? a.stock - b.stock : b.stock - a.stock));
  }, [search, sortAsc, statusFilter]);

  /* 🔥 Dynamic Summary */
  const total = medicines.length;
  const lowStock = medicines.filter((m) => m.stock <= 30 && m.stock > 5).length;
  const critical = medicines.filter((m) => m.stock <= 5).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full p-6 space-y-12">
        {/* Stock Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StockCard
            title="Total Medicines"
            value={total.toString()}
            gradient="from-blue-500 to-cyan-600"
            icon={<Package size={28} />}
          />
          <StockCard
            title="Low Stock Items"
            value={lowStock.toString()}
            gradient="from-yellow-500 to-orange-500"
            icon={<AlertTriangle size={28} />}
          />
          <StockCard
            title="Critical Stock"
            value={critical.toString()}
            gradient="from-red-500 to-rose-600"
            icon={<AlertTriangle size={28} />}
          />
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <div className="flex justify-between mb-6 gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold tracking-wide">
              Medicine Inventory
            </h2>

            <div className="flex gap-4 items-center flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-2 border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicine..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none bg-transparent text-sm"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | "In Stock" | "Low Stock" | "Critical",
                  )
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Filter by stock status"
              >
                <option value="All">All status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>

              {/* Sort */}
              <button
                type="button"
                onClick={() => setSortAsc(!sortAsc)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
              >
                <ArrowUpDown size={16} />
                Sort Stock
              </button>

              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition shadow-md">
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 bg-gray-50">
                  <th className="p-4 text-left">Medicine</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((med, i) => {
                    const status = getStatus(med.stock);

                    return (
                      <tr
                        key={i}
                        className={`even:bg-gray-50 transition-all duration-300 hover:bg-green-50 ${
                          status === "Critical" ? "animate-pulse bg-red-50" : ""
                        }`}
                      >
                        <td className="p-4 font-medium">{med.name}</td>
                        <td className="p-4 text-center font-semibold">
                          {med.stock}
                        </td>
                        <td className="p-4 text-right font-semibold">
                          {med.price}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              status === "In Stock"
                                ? "bg-green-100 text-green-700"
                                : status === "Low Stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManagerInventory;
