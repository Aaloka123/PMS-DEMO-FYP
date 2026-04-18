import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Trash2,
  Plus,
  BarChart3,
  ShoppingCart,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

/* ---------- Types ---------- */

interface KPI {
  title: string;
  value: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
  growth?: string;
}

interface Activity {
  color: string;
  text: string;
  time: string;
}

/* ---------- Components ---------- */

const KPICard: React.FC<KPI> = ({ title, value, color, bg, icon, growth }) => (
  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
    <div className="absolute -top-3 -right-3 opacity-10 text-6xl">{icon}</div>

    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>

    <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>

    {growth && (
      <p className="text-xs text-green-500 mt-1">↑ {growth} from yesterday</p>
    )}

    <div className={`${bg} w-10 h-1 rounded-full mt-3`} />
  </div>
);

const ActivityItem = ({ color, text, time }: Activity) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <p className="text-sm dark:text-gray-200">{text}</p>
    </div>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

/* ---------- Main ---------- */

const Home: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const [data, setData] = useState({
    totalMedicines: 0,
    lowStock: 0,
    sales: 0,
    expired: 0,
  });

  /* ---------- Effects ---------- */

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    }, 1000);

    setTimeout(() => {
      setData({
        totalMedicines: 245,
        lowStock: 18,
        sales: 12450,
        expired: 3,
      });
      setLoading(false);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  /* ---------- Logic ---------- */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  }, []);

  const todayDate = new Date().toLocaleDateString();

  const kpis: KPI[] = [
    {
      title: "Total Medicines",
      value: loading ? "..." : String(data.totalMedicines),
      color: "text-blue-600",
      bg: "bg-blue-500",
      icon: <Package />,
      growth: "5%",
    },
    {
      title: "Low Stock",
      value: loading ? "..." : String(data.lowStock),
      color: "text-yellow-600",
      bg: "bg-yellow-500",
      icon: <AlertTriangle />,
    },
    {
      title: "Today's Sales",
      value: loading ? "..." : `Rs ${data.sales.toLocaleString()}`,
      color: "text-green-600",
      bg: "bg-green-500",
      icon: <DollarSign />,
      growth: "12%",
    },
    {
      title: "Expired Items",
      value: loading ? "..." : String(data.expired),
      color: "text-red-600",
      bg: "bg-red-500",
      icon: <Trash2 />,
    },
  ];

  const activities: Activity[] = [
    {
      color: "bg-green-500",
      text: "Paracetamol sold (10 units)",
      time: "2 mins ago",
    },
    {
      color: "bg-yellow-500",
      text: "Stock low for Amoxicillin",
      time: "1 hour ago",
    },
    {
      color: "bg-blue-500",
      text: "New medicine added: Vitamin C",
      time: "Today",
    },
    { color: "bg-red-500", text: "2 items expired", time: "Today" },
  ];

  const filteredActivities = activities.filter((a) =>
    a.text.toLowerCase().includes(search.toLowerCase()),
  );

  const salesProgress = Math.min((data.sales / 20000) * 100, 100);

  /* ---------- UI ---------- */

  return (
    <div
      className={`min-h-screen flex flex-col ${dark ? "dark bg-gray-900" : "bg-slate-100"}`}
    >
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-8">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex justify-between">
          <div>
            <h1 className="text-4xl font-bold">PharmaCare Dashboard 💊</h1>
            <p>{greeting}, Aaloka 👋</p>
            <p className="text-sm opacity-80">
              {todayDate} | {currentTime}
            </p>
          </div>
        </div>

        {/* Alert */}
        {data.lowStock > 10 && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl">
            ⚠️ Warning: Many medicines are low in stock!
          </div>
        )}

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <KPICard key={i} {...kpi} />
          ))}
        </div>

        {/* Sales Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Daily Sales Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${salesProgress}%` }}
            />
          </div>
          <p className="text-sm mt-2">{salesProgress.toFixed(0)}% of target</p>
        </div>

        {/* Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          {/* Search */}
          <div className="flex items-center gap-2 mb-4">
            <Search />
            <input
              type="text"
              placeholder="Search activity..."
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <p className="text-gray-400">No results found</p>
            ) : (
              filteredActivities.map((a, i) => <ActivityItem key={i} {...a} />)
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
