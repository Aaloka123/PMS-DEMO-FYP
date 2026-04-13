import React, { useMemo, useState, useEffect } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import { Package, Search } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  supplier: string;
  lastUpdated: string;
}

const STORAGE_KEY = "inventory_data";

const Inventory: React.FC = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const [visibleCols, setVisibleCols] = useState({
    category: true,
    supplier: true,
    stock: true,
  });

  /* Load data */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setInventory(JSON.parse(saved));
    } else {
      const defaultData = [
        {
          id: 1,
          name: "Paracetamol",
          category: "Tablet",
          stock: 120,
          minStock: 50,
          supplier: "ABC Pharma",
          lastUpdated: "2026-01-10",
        },
      ];
      setInventory(defaultData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }, []);

  /* Save data */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const filtered = useMemo(() => {
    return inventory.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [inventory, search]);

  /* Select all */
  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((i) => i.id));
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteSelected = () => {
    setInventory((prev) => prev.filter((i) => !selected.includes(i.id)));
    setSelected([]);
  };

  const getStatus = (item: InventoryItem) =>
    item.stock > item.minStock ? "Healthy" : "Low";

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"} min-h-screen flex flex-col`}
    >
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package /> Inventory
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border px-3 py-1 rounded"
            >
              🌙
            </button>

            <button
              onClick={() => navigate("/add-medicine")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded shadow flex items-center gap-2">
          <Search size={18} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-black"
          />
        </div>

        {/* Column Toggle */}
        <div className="flex gap-3 text-sm">
          {Object.keys(visibleCols).map((col) => (
            <label key={col}>
              <input
                type="checkbox"
                checked={(visibleCols as any)[col]}
                onChange={() =>
                  setVisibleCols((prev) => ({
                    ...prev,
                    [col]: !prev[col as keyof typeof prev],
                  }))
                }
              />{" "}
              {col}
            </label>
          ))}
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="sticky top-0 bg-yellow-100 p-3 rounded flex justify-between">
            <span>{selected.length} selected</span>
            <button onClick={deleteSelected} className="text-red-600">
              Delete
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white sticky top-0">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-2 text-left">Name</th>
                {visibleCols.category && <th>Category</th>}
                {visibleCols.stock && <th>Stock</th>}
                {visibleCols.supplier && <th>Supplier</th>}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleOne(item.id)}
                    />
                  </td>

                  <td className="px-4 py-2">{item.name}</td>

                  {visibleCols.category && (
                    <td className="text-center">{item.category}</td>
                  )}

                  {visibleCols.stock && (
                    <td className="text-center font-bold">{item.stock}</td>
                  )}

                  {visibleCols.supplier && (
                    <td className="text-center">{item.supplier}</td>
                  )}

                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        getStatus(item) === "Healthy"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {getStatus(item)}
                    </span>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => navigate(`/edit/${item.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center p-10">
              <p>No inventory found</p>
              <button
                onClick={() => navigate("/add-medicine")}
                className="mt-2 text-blue-600 underline"
              >
                Add your first medicine
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Inventory;
