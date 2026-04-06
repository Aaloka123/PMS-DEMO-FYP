import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, Search, ShoppingCart, Pill } from "lucide-react";
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [sort, setSort] = useState("default");

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoice());

  function generateInvoice() {
    return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const formatCurrency = (amt: number) => `Rs ${amt.toFixed(2)}`;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // 🔹 Persist Cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Keyboard shortcut (focus search)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        document.getElementById("search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  let filtered = medicines.filter(
    (m) =>
      (activeCategory === "All" || m.category === activeCategory) &&
      m.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);

  const addToCart = (med: Medicine) => {
    if (med.stock <= 0) return;

    const exists = cart.find((i) => i.id === med.id);

    setCart((prev) =>
      exists
        ? prev.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...med, qty: 1 }],
    );

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === med.id ? { ...m, stock: Math.max(0, m.stock - 1) } : m,
      ),
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
        m.id === id ? { ...m, stock: Math.max(0, m.stock - delta) } : m,
      ),
    );
  };

  const removeItem = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: m.stock + item.qty } : m)),
    );

    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    if (!window.confirm("Are you sure you want to clear cart?")) return;

    setMedicines((prev) =>
      prev.map((m) => {
        const item = cart.find((i) => i.id === m.id);
        return item ? { ...m, stock: m.stock + item.qty } : m;
      }),
    );

    setCart([]);
    showMessage("Cart cleared");
  };

  const completeSale = () => {
    if (cart.length === 0) return;

    setCart([]);
    setDiscountEnabled(false);
    setInvoiceNumber(generateInvoice());
    showMessage("Sale completed ✅");
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountEnabled ? subtotal * 0.05 : 0;
  const tax = (subtotal - discount) * 0.13;
  const total = subtotal - discount + tax;

  const stockLabel = (stock: number) => {
    if (stock === 0) return "Out of stock";
    if (stock <= 10) return "Low stock";
    return "In stock";
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
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-3">
          <input
            id="search"
            placeholder="Search (press /)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full"
          />

          <select
            onChange={(e) => setSort(e.target.value)}
            className="border p-2"
          >
            <option value="default">Sort</option>
            <option value="low">Price Low</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Products */}
          <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((med) => (
              <div key={med.id} className="bg-white p-3 rounded shadow">
                <h3>{med.name}</h3>
                <p className="text-sm">{med.category}</p>
                <p className="text-xs">{stockLabel(med.stock)}</p>

                <div className="flex justify-between mt-2">
                  <span>{formatCurrency(med.price)}</span>
                  <button
                    onClick={() => addToCart(med)}
                    disabled={med.stock === 0}
                    className="bg-blue-600 text-white px-2 rounded"
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
                <div key={item.id} className="flex justify-between">
                  {item.name}
                  <div className="flex gap-1">
                    <Minus onClick={() => updateQty(item.id, -1)} />
                    {item.qty}
                    <Plus onClick={() => updateQty(item.id, 1)} />
                    <Trash2 onClick={() => removeItem(item.id)} />
                  </div>
                </div>
              ))
            )}

            <div className="mt-3 text-sm">
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Tax: {formatCurrency(tax)}</p>
              <p>Total: {formatCurrency(total)}</p>

              <button
                onClick={completeSale}
                disabled={cart.length === 0}
                className="bg-green-600 text-white w-full mt-2 p-1 rounded"
              >
                Complete Sale
              </button>

              <button
                onClick={clearCart}
                className="bg-gray-300 w-full mt-2 p-1 rounded"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sales;
