import React, { useState } from "react";
import { Users, Trash2, Edit, Search } from "lucide-react";
import Header from "../AdminComponents/Header";
import Footer from "../AdminComponents/Footer";

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Niki Bhasima", email: "niki@example.com", role: "Admin" },
    {
      id: 2,
      name: "Aaloka Poudel",
      email: "aaloka@example.com",
      role: "Staff",
    },
    { id: 3, name: "Suman Karki", email: "suman@example.com", role: "Staff" },
  ]);

  const [search, setSearch] = useState("");

  // Delete Function
  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Filter Users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-md">
                <Users size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Manage Users
                </h1>
                <p className="text-gray-500 text-sm">
                  View, edit and manage system users
                </p>
              </div>
            </div>

            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
              + Add User
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-sm">
            <Search size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search user by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      <td className="p-4 text-gray-600">{user.email}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:scale-105 transition-all duration-200">
                            <Edit size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-105 transition-all duration-200"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManageUsers;
