import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Mail,
  Phone,
  ArrowUp,
  Pill,
  ChevronRight,
  Package,
  BarChart3,
  Receipt,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const systemVersion = "1.1.1";

  const [time, setTime] = useState(new Date());
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Medicines", path: "/medicines" },
    { name: "Inventory", path: "/inventory" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
  ];

  const features = [
    { label: "Inventory", icon: Package },
    { label: "Billing", icon: Receipt },
    { label: "Analytics", icon: BarChart3 },
  ];

  const systemStatus = "Live";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-14 overflow-hidden border-t border-cyan-500/20 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white shadow-[0_-12px_40px_rgba(15,23,42,0.4)]">
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/3 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, cyan 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/25 shadow-inner">
                <Pill className="h-6 w-6 text-cyan-300" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">PharmaCare</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/80 font-medium">
                  Pharmacy suite
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-100/85 mt-5 leading-relaxed max-w-md">
              A modern Pharmacy Management System built to manage medicines,
              inventory, billing, and analytics efficiently.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {features.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-blue-100/90 ring-1 ring-white/10 hover:bg-white/10 hover:ring-cyan-400/30 transition-colors"
                >
                  <Icon size={13} className="text-cyan-400" />
                  {label}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2.5 mt-5 rounded-xl bg-slate-950/60 px-4 py-2.5 text-xs text-blue-100/90 ring-1 ring-white/10 backdrop-blur-sm tabular-nums">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="text-blue-300/70">Local time</span>
              <span className="text-white/90">
                {time.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-cyan-300/80">·</span>
              <span className="font-medium text-cyan-100">
                {time.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 md:pl-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-cyan-200/90 mb-4 pb-2 border-b border-white/10">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-1.5 rounded-lg px-2 py-2 text-blue-100/85 hover:bg-cyan-500/10 hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight
                      size={13}
                      className="shrink-0 text-cyan-500/50 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-cyan-200/90 mb-4 pb-2 border-b border-white/10">
              Contact & System
            </h3>
            <ul className="space-y-2 text-sm text-blue-100/90">
              <li>
                <a
                  href="mailto:support@pharmacare.com"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.03] hover:bg-white/10 hover:ring-1 hover:ring-cyan-400/20 transition-all"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-white/10">
                    <Mail size={16} className="text-cyan-300" />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider text-blue-300/60">
                      Email
                    </span>
                    support@pharmacare.com
                  </span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.03] hover:bg-white/10 transition-all cursor-default">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-white/10">
                    <Phone size={16} className="text-cyan-300" />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider text-blue-300/60">
                      Phone
                    </span>
                    +977-9800000000
                  </span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.03] hover:bg-white/10 transition-all cursor-default">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-white/10">
                    <Facebook size={16} className="text-cyan-300" />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider text-blue-300/60">
                      Social
                    </span>
                    PharmaCare Official
                  </span>
                </span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-2 mt-5 p-3 rounded-xl bg-slate-950/50 ring-1 ring-white/10">
              <span className="text-[10px] uppercase tracking-wider text-blue-300/50 w-full sm:w-auto sm:mr-1">
                System
              </span>
              <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-mono text-blue-100 ring-1 ring-white/10">
                v{systemVersion}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/25">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {systemStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        title="Back to top"
        aria-label="Back to top"
        className={`fixed right-5 bottom-6 z-40 flex items-center gap-2 rounded-full bg-cyan-500 pl-3 pr-4 py-2.5 text-slate-900 text-sm font-semibold shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 hover:shadow-cyan-400/40 hover:-translate-y-1 transition-all duration-300 ${
          showTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={18} strokeWidth={2.5} />
        <span className="hidden sm:inline">Top</span>
      </button>

      <div className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-200/75">
          <p className="text-center sm:text-left">
            © {currentYear}{" "}
            <span className="text-white/90 font-medium">PharmaCare</span>
            <span className="hidden sm:inline text-blue-400/50 mx-2">|</span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Developed by Aaloka Poudel
            </span>
          </p>
          <p className="text-xs text-blue-300/50 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-cyan-400/60" />
            React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
