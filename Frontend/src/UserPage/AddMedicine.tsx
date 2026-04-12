import React, { useState, useEffect, useRef } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import { Pill, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

/* ---------------- CUSTOM HOOK ---------------- */
const useForm = (initialState: any) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<any>({});

  const validate = (data: any) => {
    const err: any = {};
    if (!data.name) err.name = "Required";
    if (!data.category) err.category = "Required";
    if (!data.price || Number(data.price) <= 0) err.price = "Invalid price";
    if (Number(data.stock) < 0) err.stock = "Invalid stock";
    if (!data.expiry || new Date(data.expiry) < new Date())
      err.expiry = "Invalid expiry";
    return err;
  };

  const handleChange = (e: any) => {
    let value = e.target.value;

    if (e.target.name === "price" || e.target.name === "stock") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleBlur = () => {
    setErrors(validate(form));
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    handleChange,
    handleBlur,
    validate,
  };
};

/* ---------------- COMPONENT ---------------- */
const AddMedicine: React.FC = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { form, setForm, errors, handleChange, handleBlur, validate } = useForm(
    {
      id: "",
      name: "",
      category: "",
      price: "",
      stock: "",
      expiry: "",
      description: "",
    },
  );

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const id = "MED-" + crypto.randomUUID().slice(0, 6);
    setForm((prev: any) => ({ ...prev, id }));
    nameRef.current?.focus();
  }, []);

  const isFormValid = Object.keys(validate(form)).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    // Fake analytics log
    console.log("📊 Medicine submitted:", form);

    setTimeout(() => {
      setLoading(false);
      setToast("✅ Medicine Added!");

      setTimeout(() => {
        navigate("/medicines");
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
          <Pill /> Add Medicine
        </h1>

        {/* Toast */}
        {toast && (
          <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow space-y-4">
            <input
              ref={nameRef}
              name="name"
              placeholder="Medicine Name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border p-2 rounded"
            />
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category}</p>
            )}

            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border p-2 rounded"
            />
            {errors.price && (
              <p className="text-red-500 text-xs">{errors.price}</p>
            )}

            <input
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border p-2 rounded"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock}</p>
            )}

            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border p-2 rounded"
            />
            {errors.expiry && (
              <p className="text-red-500 text-xs">{errors.expiry}</p>
            )}

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
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded flex justify-center items-center gap-2 disabled:bg-gray-400"
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
