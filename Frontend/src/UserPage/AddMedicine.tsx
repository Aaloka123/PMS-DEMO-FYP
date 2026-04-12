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

  useEffect(() => {
    const generatedId = "MED-" + Date.now(); // better unique ID
    setForm((prev) => ({ ...prev, id: generatedId }));

    nameRef.current?.focus(); // auto focus
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    let value = e.target.value;

    // Trim spaces
    value = value.replace(/\s+/g, " ").trimStart();

    // Only numbers for price & stock
    if (e.target.name === "price" || e.target.name === "stock") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    // Capitalize each word
    if (e.target.name === "name") {
      value = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleReset = () => {
    setForm((prev) => ({
      ...prev,
      name: "",
      category: "",
      price: "",
      stock: "",
      expiry: "",
      supplier: "",
      batch: "",
      manufacturer: "",
      description: "",
    }));
  };

  const isFormValid =
    form.name &&
    form.category &&
    Number(form.price) > 0 &&
    Number(form.stock) >= 0 &&
    form.expiry &&
    new Date(form.expiry) >= new Date();

  const isFormEmpty =
    !form.name && !form.category && !form.price && !form.stock && !form.expiry;

  const isLowStock = Number(form.stock) > 0 && Number(form.stock) < 10;

  const getExpiryStatus = () => {
    if (!form.expiry) return { text: "—", color: "" };

    const today = new Date();
    const expiryDate = new Date(form.expiry);
    const diff = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (diff < 0) return { text: "Expired", color: "text-red-600" };
    if (diff <= 30) return { text: "Expiring Soon", color: "text-yellow-600" };
    return { text: "Safe", color: "text-green-600" };
  };

  const formatPrice = (price: string) =>
    price
      ? `Rs ${Number(price).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`
      : "—";

  const descriptionLength = form.description.length;
  const expiryStatus = getExpiryStatus();

  const stockColor =
    Number(form.stock) === 0
      ? "text-red-600"
      : Number(form.stock) < 10
        ? "text-yellow-600"
        : "text-green-600";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => navigate("/medicines"), 1200);
    }, 800);
  };

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
          {/* LEFT FORM */}
          <div className="lg:col-span-2 space-y-4 bg-white p-4 rounded-xl shadow">
            <input
              ref={nameRef}
              name="name"
              placeholder="Medicine Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

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

            <textarea
              name="description"
              maxLength={200}
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <div className="text-xs text-gray-500">
              {descriptionLength}/200{" "}
              {descriptionLength > 180 && "⚠ Almost full"}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Preview</h2>

            <p>
              <b>ID:</b> {form.id}
            </p>
            <p>
              <b>Name:</b> {form.name || "—"}
            </p>
            <p>
              <b>Price:</b> {formatPrice(form.price)}
            </p>
            <p className={stockColor}>
              <b>Stock:</b> {form.stock || "—"}
            </p>
            <p className={expiryStatus.color}>
              <b>Status:</b> {expiryStatus.text}
            </p>

            {isLowStock && (
              <p className="text-yellow-600 flex items-center gap-1 mt-2">
                <AlertTriangle size={14} /> Low stock
              </p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isFormEmpty}
              className="w-full mt-2 border py-2 rounded disabled:opacity-50"
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
