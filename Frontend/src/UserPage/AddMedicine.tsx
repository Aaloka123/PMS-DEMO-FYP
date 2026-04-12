import React, { useState, useEffect, useRef } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  CheckCircle,
  AlertTriangle,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";

interface MedicineForm {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  expiry: string;
  supplier: string;
  batch: string;
  manufacturer: string;
  description: string;
}

const STORAGE_KEY = "medicine_draft";

const AddMedicine: React.FC = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<MedicineForm>({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    expiry: "",
    supplier: "",
    batch: "",
    manufacturer: "",
    description: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState("");

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const generatedId = "MED-" + Date.now();

    if (saved) {
      setForm(JSON.parse(saved));
    } else {
      setForm((prev) => ({ ...prev, id: generatedId }));
    }

    nameRef.current?.focus();
  }, []);

  // Save draft automatically
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    let value = e.target.value.replace(/\s+/g, " ").trimStart();

    // Numeric validation
    if (e.target.name === "price" || e.target.name === "stock") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    // Capitalize
    if (e.target.name === "name") {
      value = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    // Duplicate name check (mock example)
    if (e.target.name === "name") {
      const existing = ["Paracetamol", "Ibuprofen"];
      if (existing.includes(value)) {
        setDuplicateWarning("⚠ Medicine already exists!");
      } else {
        setDuplicateWarning("");
      }
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm((prev) => ({
      ...prev,
      name: "",
      category: "",
      price: "",
      stock: "",
      expiry: "",
      description: "",
    }));
  };

  const isValidExpiry = form.expiry && new Date(form.expiry) >= new Date();

  const isFormValid =
    form.name &&
    form.category &&
    Number(form.price) > 0 &&
    Number(form.stock) >= 0 &&
    isValidExpiry &&
    !duplicateWarning;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      localStorage.removeItem(STORAGE_KEY);

      setTimeout(() => navigate("/medicines"), 1200);
    }, 800);
  };

  // Ctrl + Enter submit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit(e as any);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [form]);

  const stockBadge =
    Number(form.stock) === 0
      ? "bg-red-100 text-red-600"
      : Number(form.stock) < 10
        ? "bg-yellow-100 text-yellow-600"
        : "bg-green-100 text-green-600";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
          <Pill /> Add Medicine
        </h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex items-center gap-2">
            <CheckCircle size={18} />
            Medicine saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2 space-y-4 bg-white p-4 rounded-xl shadow">
            <div>
              <label className="text-sm">Medicine Name</label>
              <input
                ref={nameRef}
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {duplicateWarning && (
                <p className="text-red-500 text-xs">{duplicateWarning}</p>
              )}
            </div>

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {!isValidExpiry && form.expiry && (
              <p className="text-red-500 text-xs">
                Expiry date cannot be in the past
              </p>
            )}

            <textarea
              name="description"
              maxLength={200}
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* PREVIEW */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Preview</h2>

            <p>
              <b>Name:</b> {form.name || "—"}
            </p>
            <p>
              <b>Price:</b> Rs {form.price || "—"}
            </p>

            <span className={`px-2 py-1 text-xs rounded ${stockBadge}`}>
              Stock: {form.stock || "—"}
            </span>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save (Ctrl+Enter)"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full mt-2 border py-2 rounded"
            >
              <RefreshCcw size={14} className="inline mr-1" />
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate("/medicines")}
              className="w-full mt-2 border py-2 rounded"
            >
              <ArrowLeft size={14} className="inline mr-1" />
              Cancel
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AddMedicine;
