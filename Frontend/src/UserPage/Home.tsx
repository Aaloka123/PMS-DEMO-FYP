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
  ArrowRight,
} from "lucide-react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

interface KPI {
  title: string;
  value: string;
  accent: string;
  iconBg: string;
  icon: React.ReactNode;
  growth?: string;
}

interface Activity {
  color: string;
  text: string;
  time: string;
}

const KPICard: React.FC<KPI> = ({
  title,
  value,
  accent,
  iconBg,
  icon,
  growth,
}) => (
  <div
    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-800/80 dark:hover:border-slate-600"
  >
    <div
      className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-110 ${iconBg}`}
      aria-hidden
    />

    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h2 className={`mt-2 text-3xl font-bold tracking-tight ${accent}`}>
          {value}
        </h2>
        {growth && (
          <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            ↑ {growth} vs yesterday
          </p>
        )}
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-inner ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const ActivityItem = ({ color, text, time }: Activity) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-700/50">
    <div className="flex min-w-0 items-center gap-3">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-800 ${color}`} />
      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
        {text}
      </p>
    </div>
    <span className="shrink-0 text-xs tabular-nums text-slate-400">{time}</span>
  </div>
);

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

    const t = setTimeout(() => {
      setData({
        totalMedicines: 245,
        lowStock: 18,
        sales: 12450,
        expired: 3,
      });
      setLoading(false);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const kpis: KPI[] = [
    {
      title: "Total medicines",
      value: loading ? "…" : String(data.totalMedicines),
      accent: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
      icon: <Package className="h-6 w-6" strokeWidth={2} />,
      growth: "5%",
    },
    {
      title: "Low stock",
      value: loading ? "…" : String(data.lowStock),
      accent: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-600",
      icon: <AlertTriangle className="h-6 w-6" strokeWidth={2} />,
    },
    {
      title: "Today's sales",
      value: loading ? "…" : `Rs ${data.sales.toLocaleString()}`,
      accent: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-700",
      icon: <DollarSign className="h-6 w-6" strokeWidth={2} />,
      growth: "12%",
    },
    {
      title: "Expired items",
      value: loading ? "…" : String(data.expired),
      accent: "text-red-600 dark:text-red-400",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-700",
      icon: <Trash2 className="h-6 w-6" strokeWidth={2} />,
    },
  ];

  const activities: Activity[] = [
    {
      color: "bg-emerald-500",
      text: "Paracetamol sold (10 units)",
      time: "2 min ago",
    },
    {
      color: "bg-amber-400",
      text: "Stock low for Amoxicillin",
      time: "1 hr ago",
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

  const quickLinks = [
    { to: "/medicines", label: "Catalog", icon: Package },
    { to: "/inventory", label: "Stock", icon: BarChart3 },
    { to: "/sales", label: "Sales", icon: ShoppingCart },
    { to: "/add-medicine", label: "Add item", icon: Plus },
  ] as const;

  return (
    <div
      className={`font-sans min-h-screen flex flex-col transition-colors duration-300 ${
        dark ? "dark bg-slate-950" : "bg-slate-100"
      }`}
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow space-y-8 px-4 py-6 sm:px-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setDark(!dark)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
            aria-pressed={dark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-500" />
            )}
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 px-6 py-10 text-white shadow-2xl shadow-blue-950/30 sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-widest text-cyan-200/90">
                Dashboard
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                PharmaCare
              </h1>
              <p className="text-lg text-blue-100/95">
                {greeting}, Aaloka — here is how your pharmacy looks today.
              </p>
              <p className="text-sm tabular-nums text-blue-200/80">
                {todayDate} · <span className="text-white">{currentTime}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {quickLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
                >
                  <Icon className="h-4 w-4 text-cyan-200" aria-hidden />
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 opacity-70 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {data.lowStock > 10 && (
          <div
            className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium">
              Several medicines are below reorder level. Review inventory to avoid
              stockouts.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KPICard key={i} {...kpi} />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Daily sales progress
            </h2>
            <span className="text-sm font-medium tabular-nums text-slate-500 dark:text-slate-400">
              Target Rs 20,000
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-[width] duration-700 ease-out"
              style={{ width: `${salesProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
              {salesProgress.toFixed(0)}%
            </span>{" "}
            of today&apos;s sales target
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Recent activity
          </h2>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-900/50">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <input
              type="search"
              placeholder="Filter activity…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search activity"
            />
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700/80">
            {filteredActivities.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No matching activity
              </p>
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
