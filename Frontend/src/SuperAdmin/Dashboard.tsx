import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Users,
  Pill,
  Store,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Pause,
  Play,
} from "lucide-react";

/* -------------------- Types -------------------- */
interface CardData {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  growth: number;
}

type Status = "idle" | "loading" | "success" | "error";

/* -------------------- Mock API -------------------- */
const dashboardAPI = {
  fetchStats: (): Promise<CardData[]> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            id: "admins",
            title: "Total Admins",
            value: 12,
            icon: <Users size={28} />,
            color: "from-blue-500 to-blue-600",
            growth: 5,
          },
          {
            id: "pharmacies",
            title: "Pharmacies",
            value: 8,
            icon: <Store size={28} />,
            color: "from-green-500 to-green-600",
            growth: -2,
          },
          {
            id: "medicines",
            title: "Medicines",
            value: 320,
            icon: <Pill size={28} />,
            color: "from-purple-500 to-purple-600",
            growth: 10,
          },
          {
            id: "sales",
            title: "Total Sales",
            value: 150000,
            icon: <BarChart3 size={28} />,
            color: "from-orange-500 to-orange-600",
            growth: 12,
          },
        ]);
      }, 800);
    }),
};

/* -------------------- Utils -------------------- */
const formatCurrency = (value: number) => `Rs ${value.toLocaleString("en-NP")}`;

/* -------------------- Custom Hook -------------------- */
const useDashboard = () => {
  const [data, setData] = useState<CardData[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setStatus("loading");
      const result = await dashboardAPI.fetchStats();

      setData(result);
      setLastUpdated(new Date());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  return { data, status, lastUpdated, fetchData };
};

/* -------------------- Animated Counter -------------------- */
const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
};

/* -------------------- Skeleton -------------------- */
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-300 h-32 rounded-2xl"></div>
);

/* -------------------- Card -------------------- */
const StatCard = React.memo(({ card }: { card: CardData }) => {
  const isPositive = card.growth >= 0;

  return (
    <div
      className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm">{card.title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {card.title === "Total Sales" ? (
              formatCurrency(card.value)
            ) : (
              <Counter value={card.value} />
            )}
          </h2>

          <div className="flex items-center gap-1 mt-2 text-sm">
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {card.growth}%
          </div>
        </div>

        <div className="bg-white/20 p-3 rounded-full">{card.icon}</div>
      </div>
    </div>
  );
});

/* -------------------- Dashboard -------------------- */
const Dashboard: React.FC = () => {
  const { data, status, lastUpdated, fetchData } = useDashboard();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paused, setPaused] = useState(false);

  const today = useMemo(() => new Date().toLocaleDateString(), []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!paused) fetchData();
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, paused]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Super Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">Today: {today}</p>
        </div>

        <div className="flex gap-3">
          {/* Refresh */}
          <button
            type="button"
            onClick={fetchData}
            disabled={status === "loading"}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <RefreshCw size={16} className={status === "loading" ? "animate-spin" : ""} aria-hidden />
            Refresh
          </button>

          {/* Pause/Resume */}
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-white transition hover:bg-slate-900"
          >
            {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      {/* Status */}
      {status === "error" && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          Failed to load data
          <button type="button" onClick={fetchData} className="underline">
            Retry
          </button>
        </div>
      )}

      {paused && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          Auto-refresh is paused
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {status === "loading"
          ? Array(4)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          : data.map((card) => <StatCard key={card.id} card={card} />)}
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <span className="font-medium text-slate-500">Super Admin · v7.1</span>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
