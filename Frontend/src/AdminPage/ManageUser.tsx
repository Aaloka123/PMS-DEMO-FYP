import React, { useMemo, useState } from "react";
import { Users, Trash2, Edit, Search, UserPlus } from "lucide-react";
import AdminLayout from "../AdminComponents/AdminLayout";
import AdminPageHeader from "../AdminComponents/AdminPageHeader";

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
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Staff">(
    "All",
  );

  const handleDelete = (id: number) => {
    const target = users.find((user) => user.id === id);
    if (!target) return;
    if (!window.confirm(`Remove ${target.name} from the system?`)) return;
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter((u) => u.role === "Admin").length;
  const staffCount = users.filter((u) => u.role === "Staff").length;

  return (
    <AdminLayout>
        <div className="space-y-8">
          <AdminPageHeader
            title="Manage Users"
            description={`${users.length} total · ${adminCount} admin · ${staffCount} staff`}
            icon={Users}
            iconClassName="bg-blue-100 text-blue-600"
            action={
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                <UserPlus size={18} aria-hidden />
                Add User
              </button>
            }
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search
                size={18}
                className="absolute top-3 left-3 text-gray-400"
                aria-hidden
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "All" | "Admin" | "Staff")
              }
              className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Filter by role"
            >
              <option value="All">All roles</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>

            <p className="text-sm text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
              {(search || roleFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("All");
                  }}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
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
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                            {user.name.charAt(0)}
                          </span>
                          {user.name}
                        </div>
                      </td>

                      <td className="p-4 text-gray-600">
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {user.email}
                        </a>
                      </td>

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
                          <button
                            type="button"
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          >
                            <Edit size={16} aria-hidden />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          >
                            <Trash2 size={16} aria-hidden />
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
    </AdminLayout>
  );
};

export default ManageUsers;
