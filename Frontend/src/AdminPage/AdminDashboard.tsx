import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  BarChart3,
  ShieldCheck,
  Activity,
  Database,
  Server,
  Cloud,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Header from "../AdminComponents/Header";
import Footer from "../AdminComponents/Footer";

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-10 text-white shadow-2xl transition-all duration-500 hover:scale-[1.01] border border-gray-800">
            <div className="absolute right-10 top-10 opacity-10">
              <ShieldCheck size={120} />
            </div>

            <h1 className="text-4xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-green-400 animate-pulse" />
              Admin Control Panel
            </h1>
            <p className="opacity-80 mt-3 max-w-xl">
              Monitor, manage and control your entire pharmacy system with
              real-time insights and analytics.
            </p>
          </div>

          {/* Quick Stats */}
          <SectionHeader title="Quick Overview" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <QuickStat
              label="Pending Approvals"
              value="5"
              Icon={AlertCircle}
              color="yellow"
            />
            <QuickStat
              label="Active Staff"
              value="12"
              Icon={Users}
              color="blue"
            />
            <QuickStat
              label="System Alerts"
              value="3"
              Icon={AlertCircle}
              color="red"
            />
          </div>

          {/* KPI Cards */}
          <SectionHeader title="Key Performance Indicators" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminCard
              title="Total Users"
              value="52"
              Icon={Users}
              gradient="from-blue-500 to-blue-700"
            />
            <AdminCard
              title="Medicines"
              value="245"
              Icon={Package}
              gradient="from-green-500 to-green-700"
            />
            <AdminCard
              title="Daily Sales"
              value="Rs 12,450"
              Icon={BarChart3}
              gradient="from-purple-500 to-purple-700"
            />
            <AdminCard
              title="System Logs"
              value="128"
              Icon={Activity}
              gradient="from-red-500 to-red-700"
            />
          </div>

          {/* Quick Navigation */}
          <SectionHeader title="Quick Navigation" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCell
              title="Add Medicine"
              desc="Create new medicine entry"
              Icon={Package}
              link="/admin/add-medicine"
              gradient="from-green-500 to-emerald-600"
            />
            <DashboardCell
              title="View Reports"
              desc="Check sales & analytics"
              Icon={BarChart3}
              link="/admin/reports"
              gradient="from-purple-500 to-indigo-600"
            />
            <DashboardCell
              title="Manage Inventory"
              desc="Stock control system"
              Icon={Database}
              link="/admin/inventory"
              gradient="from-blue-500 to-cyan-600"
            />
            <DashboardCell
              title="System Monitoring"
              desc="Server & logs overview"
              Icon={Server}
              link="/admin/monitoring"
              gradient="from-red-500 to-rose-600"
            />
          </div>

          {/* System Health */}
          <SectionHeader title="System Health" />

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <HealthItem
                Icon={Database}
                label="Database"
                status="Healthy"
                color="green"
              />
              <HealthItem
                Icon={Server}
                label="API Server"
                status="Running"
                color="green"
              />
              <HealthItem
                Icon={Cloud}
                label="Cloud Backup"
                status="Synced Today"
                color="blue"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ---------- Section Header ---------- */

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
);

/* ---------- QuickStat ---------- */

const QuickStat = ({ label, value, Icon, color }: any) => {
  const colorMap: any = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`flex items-center justify-between rounded-2xl p-5 shadow bg-white border border-gray-200 transition duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {value}
          <TrendingUp size={16} className="text-green-500" />
        </h2>
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
    </div>
  );
};

/* ---------- AdminCard ---------- */

const AdminCard = ({ title, value, Icon, gradient }: any) => (
  <div className="relative bg-white rounded-3xl p-6 shadow-lg overflow-hidden transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200">
    <div
      className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 rounded-bl-full`}
    />
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-bold mt-1">{value}</h2>

    <div
      className={`mt-4 w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${gradient} transition-transform duration-300 hover:rotate-12`}
    >
      <Icon size={20} />
    </div>
  </div>
);

/* ---------- DashboardCell ---------- */

const DashboardCell = ({ title, desc, Icon, link, gradient }: any) => (
  <Link
    to={link}
    className="group relative bg-white rounded-3xl p-6 shadow-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl border border-gray-200"
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition duration-500`}
    />
    <div className="relative z-10 flex flex-col gap-3">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-white transition group-hover:rotate-12 group-hover:scale-110`}
      >
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </Link>
);

/* ---------- HealthItem ---------- */

const HealthItem = ({ Icon, label, status, color }: any) => {
  const colorMap: any = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="border rounded-2xl p-5 flex justify-between items-center hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon size={18} />
        </div>
        <p className="font-medium">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${colorMap[color]}`} />
        <span className="text-sm font-semibold text-gray-600">{status}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
