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
  Loader2,
} from "lucide-react";

interface MedicineForm {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  expiry: string;
  description: string;
}

interface Errors {
  name?: string;
  price?: string;
  stock?: string;
  expiry?: string;
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
    description: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Generate better ID
  useEffect(() => {
    const id = "MED-" + crypto.randomUUID().slice(0, 8);
    setForm((prev) => ({ ...prev, id }));
    nameRef.current?.focus();
  }, []);

  // Validation logic
  const validate = (data: MedicineForm) => {
    const newErrors: Errors = {};

    if (!data.name) newErrors.name = "Name is required";
    if (!data.price || Number(data.price) <= 0)
      newErrors.price = "Enter valid price";
    if (Number(data.stock) < 0) newErrors.stock = "Stock cannot be negative";
    if (!data.expiry || new Date(data.expiry) < new Date())
      newErrors.expiry = "Invalid expiry date";

    return newErrors;
  };

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors(validate(form));
    }, 300);

    return () => clearTimeout(timer);
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let value = e.target.value.replace(/\s+/g, " ").trimStart();

    if (e.target.name === "price" || e.target.name === "stock") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    if (e.target.name === "name") {
      value = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/medicines"), 1200);
    }, 1000);
  };

  // Warn before leaving
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!success) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [success]);

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
            Saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2 space-y-4 bg-white p-4 rounded-xl shadow">
            <div>
              <input
                ref={nameRef}
                name="name"
                placeholder="Medicine Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.price && (
                <p className="text-red-500 text-xs">{errors.price}</p>
              )}
            </div>

            <div>
              <input
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs">{errors.stock}</p>
              )}
            </div>

            <div>
              <input
                type="date"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs">{errors.expiry}</p>
              )}
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
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

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded disabled:bg-gray-400 flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Saving..." : "Save"}
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
