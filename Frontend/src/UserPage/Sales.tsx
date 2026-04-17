import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Pill,
  Printer,
  Undo2,
} from "lucide-react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Medicine {
  qty: number;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [lastAction, setLastAction] = useState<any>(null);

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoice());

  function generateInvoice() {
    return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const formatCurrency = (amt: number) => `Rs ${amt.toFixed(2)}`;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("salesHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("salesHistory", JSON.stringify(history));
  }, [history]);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (med: Medicine) => {
    if (med.stock <= 0) return;

    setLastAction({ type: "add", med });

    setCart((prev) => {
      const exists = prev.find((i) => i.id === med.id);
      return exists
        ? prev.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...med, qty: 1 }];
    });

    setMedicines((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, stock: m.stock - 1 } : m)),
    );
  };

  const updateQty = (id: number, delta: number) => {
    setLastAction({ type: "update", id, delta });

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

  const undoAction = () => {
    if (!lastAction) return;

    if (lastAction.type === "add") {
      updateQty(lastAction.med.id, -1);
    }

    if (lastAction.type === "update") {
      updateQty(lastAction.id, -lastAction.delta);
    }

    setLastAction(null);
    showMessage("Undo successful");
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const completeSale = () => {
    if (cart.length === 0) return;

    const sale = {
      invoiceNumber,
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };

    setHistory((prev) => [...prev, sale]);
    setCart([]);
    setInvoiceNumber(generateInvoice());

    showMessage("Sale saved ✅");
  };

  const printInvoice = () => {
    window.print();
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
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={() => setSearch("")}
            className="bg-gray-200 px-2 rounded"
          >
            Clear
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Products */}
          <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <p>No medicines found</p>
            ) : (
              filtered.map((med) => (
                <div key={med.id} className="bg-white p-3 rounded shadow">
                  <h3>{med.name}</h3>
                  <p>{med.category}</p>
                  <p>Stock: {med.stock}</p>

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
              ))
            )}
          </div>

          {/* Cart */}
          <div className="bg-white p-3 rounded shadow">
            <h2 className="flex gap-2">
              <ShoppingCart /> Cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 mt-4">Cart empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="mt-2">
                  {item.name} ({item.qty})
                  <div className="flex gap-2">
                    <Minus onClick={() => updateQty(item.id, -1)} />
                    <Plus onClick={() => updateQty(item.id, 1)} />
                    <Trash2 onClick={() => updateQty(item.id, -item.qty)} />
                  </div>
                </div>
              ))
            )}

            <div className="mt-3 text-sm">
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Tax: {formatCurrency(tax)}</p>
              <p className="font-bold">Total: {formatCurrency(total)}</p>

              <button
                onClick={completeSale}
                className="bg-green-600 text-white w-full mt-2 p-1 rounded"
              >
                Complete Sale
              </button>

              <button
                onClick={printInvoice}
                className="bg-blue-500 text-white w-full mt-2 p-1 rounded flex items-center justify-center gap-1"
              >
                <Printer size={16} /> Print
              </button>

              <button
                onClick={undoAction}
                className="bg-yellow-400 w-full mt-2 p-1 rounded flex items-center justify-center gap-1"
              >
                <Undo2 size={16} /> Undo
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
