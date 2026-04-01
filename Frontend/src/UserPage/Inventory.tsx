import React, { useMemo, useState } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  Truck,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  supplier: string;
  lastUpdated: string;
}

interface KpiProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "purple";
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();

  const [inventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Paracetamol",
      category: "Tablet",
      stock: 120,
      minStock: 50,
      supplier: "ABC Pharma",
      lastUpdated: "2026-01-10",
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Capsule",
      stock: 25,
      minStock: 40,
      supplier: "LifeCare",
      lastUpdated: "2026-01-08",
    },
    {
      id: 3,
      name: "Cough Syrup",
      category: "Syrup",
      stock: 10,
      minStock: 30,
      supplier: "MedPlus",
      lastUpdated: "2026-01-07",
    },
  ]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter ? item.category === categoryFilter : true),
    );
  }, [inventory, search, categoryFilter]);

  const healthy = inventory.filter((i) => i.stock > i.minStock).length;
  const low = inventory.length - healthy;
  const suppliers = new Set(inventory.map((i) => i.supplier)).size;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package /> Inventory Management
            </h1>
            <p className="opacity-90">
              Real-time stock, supplier & update tracking
            </p>
          </div>

          <button
            onClick={() => navigate("/add-medicine")}
            className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100"
          >
            + Add Stock
          </button>
        </div>

        {/* Alert Banner */}
        {low > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl flex items-center gap-2">
            <AlertTriangle size={18} />
            {low} item(s) need immediate restocking.
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Kpi
            title="Total Products"
            value={inventory.length}
            icon={<Package />}
            color="blue"
          />
          <Kpi
            title="Healthy Stock"
            value={healthy}
            icon={<CheckCircle />}
            color="green"
          />
          <Kpi
            title="Low Stock"
            value={low}
            icon={<AlertTriangle />}
            color="red"
          />
          <Kpi
            title="Suppliers"
            value={suppliers}
            icon={<Truck />}
            color="purple"
          />
        </div>

        {/* Search & Filter */}
        <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-2 flex-1">
            <Search size={18} className="text-blue-500" />
            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-3 py-1"
            >
              <option value="">All Categories</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Medicine</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => {
                const percent = Math.min(
                  100,
                  Math.round((item.stock / item.minStock) * 100),
                );

                return (
                  <tr
                    key={item.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-slate-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 text-center">{item.category}</td>
                    <td className="px-4 py-3 text-center font-bold">
                      {item.stock}
                    </td>

                    {/* ✅ UPDATED STOCK LEVEL */}
                    <td className="px-4 py-3">
                      <div
                        className="w-full bg-gray-200 rounded-full h-2"
                        title={`Minimum required: ${item.minStock}`}
                      >
                        <div
                          className={`h-2 rounded-full ${
                            percent > 70
                              ? "bg-green-500"
                              : percent > 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p
                        className={`text-xs mt-1 font-medium ${
                          percent > 70
                            ? "text-green-600"
                            : percent > 40
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {percent}% -{" "}
                        {percent > 70
                          ? "Good"
                          : percent > 40
                            ? "Moderate"
                            : "Critical"}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-center">{item.supplier}</td>
                    <td className="px-4 py-3 text-center">
                      {item.lastUpdated}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.stock > item.minStock ? (
                        <span className="flex items-center justify-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                          <CheckCircle size={12} /> Healthy
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                          <AlertTriangle size={12} /> Reorder
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 font-medium hover:underline">
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No inventory found.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Kpi: React.FC<KpiProps> = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "border-blue-600 text-blue-600 bg-blue-100",
    green: "border-green-600 text-green-600 bg-green-100",
    red: "border-red-600 text-red-600 bg-red-100",
    purple: "border-purple-600 text-purple-600 bg-purple-100",
  };

  return (
    <div
      className={`bg-white shadow rounded-xl p-5 border-l-4 ${colorMap[color]}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <div className={`p-2 rounded-full ${colorMap[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

export default Inventory;
