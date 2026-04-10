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

/* -------------------- Utils -------------------- */
const formatCurrency = (value: number) => `Rs ${value.toLocaleString("en-NP")}`;

const STAT_CARDS: CardData[] = [
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
];

/* -------------------- Hook -------------------- */
const useDashboardData = () => {
  const [data, setData] = useState<CardData[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(() => {
    setStatus("loading");

    const timer = setTimeout(() => {
      setData(STAT_CARDS);
      setLastUpdated(new Date());
      setStatus("success");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { data, status, lastUpdated, fetchData };
};

/* -------------------- Card -------------------- */
const StatCard = React.memo(({ card }: { card: CardData }) => {
  const isPositive = card.growth >= 0;

  return (
    <div
      className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg 
      hover:shadow-2xl hover:ring-2 hover:ring-white/40 
      transform hover:-translate-y-1 hover:scale-105 
      transition-all duration-300`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90">{card.title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {card.title === "Total Sales"
              ? formatCurrency(card.value)
              : card.value}
          </h2>

          <div className="flex items-center gap-1 mt-2 text-sm">
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {isPositive ? "+" : ""}
              {card.growth}%
            </span>
          </div>

          <span className="text-xs bg-white/20 px-2 py-1 rounded mt-2 inline-block">
            Active
          </span>
        </div>

        <div className="bg-white/20 p-3 rounded-full">{card.icon}</div>
      </div>
    </div>
  );
});

/* -------------------- Main Dashboard -------------------- */
const Dashboard: React.FC = () => {
  const { data, status, lastUpdated, fetchData } = useDashboardData();

  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const today = useMemo(() => new Date().toLocaleDateString(), []);

  /* Auto refresh with pause support */
  useEffect(() => {
    fetchData();

    intervalRef.current = setInterval(() => {
      if (!paused) fetchData();
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, paused]);

  return (
    <div
      className="p-10 bg-gray-100 min-h-screen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back! Here is the overview of your pharmacy system.
        </p>

        <p className="text-sm text-gray-400 mt-1">Today: {today}</p>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          System Statistics
        </h2>

        <div className="flex items-center gap-4">
          {paused && (
            <span className="text-xs text-yellow-600">Auto-refresh paused</span>
          )}

          {status === "loading" && (
            <span className="text-sm text-blue-500 animate-pulse">
              Updating...
            </span>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((card) => (
          <StatCard key={card.id} card={card} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t mt-10 pt-4 flex justify-between text-sm text-gray-600">
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <span>Dashboard v5.0</span>
      </div>
    </div>
  );
};

export default Dashboard;
