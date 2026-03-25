import React, { useState } from "react";
import { Trash2, Plus, Mail, X } from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ManageAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      name: "Admin One",
      email: "admin1@gmail.com",
      role: "Super Admin",
    },
    { id: 2, name: "Admin Two", email: "admin2@gmail.com", role: "Admin" },
  ]);

  const [search, setSearch] = useState("");

  const removeAdmin = (id: number, role: string) => {
    if (role === "Super Admin") {
      alert("Super Admin cannot be deleted!");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?",
    );
    if (confirmDelete) {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  const addAdmin = () => {
    const name = prompt("Enter admin name:");
    const email = prompt("Enter admin email:");
    const role = prompt("Enter role (Admin/Super Admin):");

    if (name && email && role) {
      const newAdmin: Admin = {
        id: Date.now(),
        name,
        email,
        role,
      };
      setAdmins([...admins, newAdmin]);
    } else {
      alert("All fields are required!");
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase()),
  );

  const clearSearch = () => setSearch("");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Admins</h1>
        <hr className="mb-6 border-gray-300" />

        <p className="text-gray-600 mb-4">
          Total Admins: <span className="font-semibold">{admins.length}</span>
        </p>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search admin by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {filteredAdmins.length === 0 ? (
          <p className="text-center text-gray-500">No admins found.</p>
        ) : (
          filteredAdmins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between bg-white p-4 mb-4 border rounded-lg shadow-sm hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                  {admin.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    {admin.name}

                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {admin.role}
                    </span>
                  </h2>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail size={14} />
                    {admin.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeAdmin(admin.id, admin.role)}
                className={`p-2 rounded ${
                  admin.role === "Super Admin"
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-100"
                }`}
                disabled={admin.role === "Super Admin"}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={addAdmin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add Admin
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Pharmacy Management System • Super Admin Panel
        </p>
      </div>
    </div>
  );
};

export default ManageAdmins;
