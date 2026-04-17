import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart, Pill } from "lucide-react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const initialMedicines: Medicine[] = [
  { id: 1, name: "Paracetamol", price: 20, stock: 120, category: "Pain" },
  { id: 2, name: "Amoxicillin", price: 50, stock: 60, category: "Antibiotic" },
  { id: 3, name: "Vitamin C", price: 30, stock: 90, category: "Supplement" },
  { id: 4, name: "Ibuprofen", price: 40, stock: 45, category: "Pain" },
  { id: 5, name: "Cough Syrup", price: 70, stock: 10, category: "Cold" },
];

const Sales: React.FC = () => {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [cart, setCart] = useState<(Medicine & { qty: number })[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [sort, setSort] = useState("default");

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoice());
  const [dateTime, setDateTime] = useState(new Date());

  function generateInvoice() {
    return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const formatCurrency = (amt: number) => `Rs ${amt.toFixed(2)}`;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // 🧠 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 🧠 Persist cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ⌨️ Keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ⏱️ Live time
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🎯 Filter + Sort
  let filtered = medicines.filter(
    (m) =>
      (category === "All" || m.category === category) &&
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const categories = ["All", ...new Set(medicines.map((m) => m.category))];

  const addToCart = (med: Medicine) => {
    if (med.stock <= 0) return;

    const exists = cart.find((i) => i.id === med.id);

    setCart((prev) =>
      exists
        ? prev.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...med, qty: 1 }],
    );

    setMedicines((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, stock: m.stock - 1 } : m)),
    );

    showMessage(`${med.name} added`);
  };

  const updateQty = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id);
    const med = medicines.find((m) => m.id === id);
    if (!item || !med) return;

    if (delta > 0 && med.stock === 0) return;

    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, stock: delta > 0 ? m.stock - 1 : m.stock + 1 }
          : m,
      ),
    );
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountEnabled ? subtotal * 0.05 : 0;
  const tax = (subtotal - discount) * 0.13;
  const total = subtotal - discount + tax;

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-500";
    if (stock < 10) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {message && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded">
          {message}
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto p-6">
        <div className="bg-blue-600 text-white p-4 rounded mb-4">
          <h1 className="flex items-center gap-2 text-xl">
            <Pill /> Pharmacy POS
          </h1>
          <p>{invoiceNumber}</p>
          <p className="text-sm">{dateTime.toLocaleString()}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <input
            id="search"
            placeholder="Search (press /)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded flex-grow"
          />

          <select
            onChange={(e) => setSort(e.target.value)}
            className="border p-2"
          >
            <option value="default">Sort</option>
            <option value="low">Price Low</option>
            <option value="high">Price High</option>
          </select>

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Products */}
          <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((med) => (
              <div key={med.id} className="bg-white p-3 rounded shadow">
                <h3>{med.name}</h3>
                <p className="text-sm">{med.category}</p>
                <p className={`text-xs ${getStockColor(med.stock)}`}>
                  Stock: {med.stock}
                </p>

                <div className="flex justify-between mt-2">
                  <span>{formatCurrency(med.price)}</span>
                  <button
                    onClick={() => addToCart(med)}
                    disabled={med.stock === 0}
                    className="bg-blue-600 text-white px-2 rounded disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart */}
          <div className="bg-white p-3 rounded shadow">
            <h2 className="flex gap-2">
              <ShoppingCart /> Cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm mt-4">🛒 Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="mt-2">
                  <p>{item.name}</p>
                  <small>
                    {item.qty} × {formatCurrency(item.price)} ={" "}
                    {formatCurrency(item.qty * item.price)}
                  </small>

                  <div className="flex gap-2 mt-1">
                    <Minus onClick={() => updateQty(item.id, -1)} />
                    <Plus onClick={() => updateQty(item.id, 1)} />
                    <Trash2 onClick={() => updateQty(item.id, -item.qty)} />
                  </div>
                </div>
              ))
            )}

            <label className="flex items-center gap-2 mt-3 text-sm">
              <input
                type="checkbox"
                checked={discountEnabled}
                onChange={() => setDiscountEnabled(!discountEnabled)}
              />
              5% Discount
            </label>

            <div className="mt-3 text-sm">
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Discount: {formatCurrency(discount)}</p>
              <p>Tax: {formatCurrency(tax)}</p>
              <p className="font-bold">Total: {formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sales;
