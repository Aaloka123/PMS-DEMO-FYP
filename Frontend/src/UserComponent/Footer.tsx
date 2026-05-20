import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Shield,
  Clock,
  Zap,
  ExternalLink,
  Heart,
} from "lucide-react";

const Footer: React.FC = () => {
  const location = useLocation();
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

  const highlights = [
    { label: "Secure data", value: "256-bit", icon: Shield },
    { label: "Uptime", value: "99.9%", icon: Zap },
    { label: "Support", value: "24/7", icon: Clock },
  ];

  const systemStatus = "Live";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <footer className="relative mt-14 overflow-hidden border-t border-cyan-500/25 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-[0_-16px_48px_rgba(15,23,42,0.45)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-cyan-600 via-cyan-300 to-blue-400 opacity-90" />

      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%), radial-gradient(circle at 20% 80%, cyan 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-10">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-200 ring-1 ring-cyan-400/20 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Trusted pharmacy suite
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/25 via-white/10 to-blue-600/20 ring-1 ring-white/30 shadow-lg shadow-cyan-500/10">
                <Pill className="h-6 w-6 text-cyan-300" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  PharmaCare
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/80 font-medium">
                  Pharmacy suite
                </p>
              </div>
            </div>

            <p className="text-sm text-blue-100/80 mt-5 leading-relaxed max-w-md">
              A modern Pharmacy Management System built to manage medicines,
              inventory, billing, and analytics efficiently.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-6">
              {highlights.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/5 px-2.5 py-3 text-center ring-1 ring-white/10 hover:bg-white/8 hover:ring-cyan-400/25 transition-colors"
                >
                  <Icon
                    size={16}
                    className="mx-auto text-cyan-400 mb-1.5"
                    aria-hidden
                  />
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[9px] uppercase tracking-wide text-blue-300/70 mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {features.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-blue-100/90 ring-1 ring-white/10 hover:bg-cyan-500/10 hover:ring-cyan-400/40 hover:scale-[1.02] transition-all"
                >
                  <Icon size={13} className="text-cyan-400" />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-slate-950/60 px-4 py-2.5 text-xs text-blue-100/90 ring-1 ring-white/10 backdrop-blur-sm tabular-nums">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                <span className="text-blue-300/70">Local</span>
                <span className="text-white/90">
                  {time.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-cyan-300/60">·</span>
                <span className="font-semibold text-cyan-100">
                  {time.toLocaleTimeString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-blue-300/50 mr-1">
                  Follow
                </span>
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Mail, label: "Email", href: "mailto:support@pharmacare.com" },
                ].map(({ icon: Icon, label, href }) =>
                  href ? (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cyan-300 ring-1 ring-white/15 hover:bg-cyan-500/20 hover:text-white hover:ring-cyan-400/40 hover:-translate-y-0.5 transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  ) : (
                    <button
                      key={label}
                      type="button"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cyan-300 ring-1 ring-white/15 hover:bg-cyan-500/20 hover:text-white hover:ring-cyan-400/40 hover:-translate-y-0.5 transition-all"
                    >
                      <Icon size={16} />
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-3 md:pl-2 lg:pl-6">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-cyan-200/90 mb-4 flex items-center gap-2">
              <span className="h-7 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-1.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-cyan-500/20 text-white ring-1 ring-cyan-400/30 font-medium"
                        : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ChevronRight
                      size={13}
                      className={`shrink-0 transition-transform ${
                        isActive(link.path)
                          ? "text-cyan-300"
                          : "text-cyan-500/50 group-hover:text-cyan-300 group-hover:translate-x-0.5"
                      }`}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-cyan-200/90 mb-4 flex items-center gap-2">
              <span className="h-7 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
              Contact & System
            </h3>
            <ul className="space-y-2 text-sm text-blue-100/90">
              <li>
                <a
                  href="mailto:support@pharmacare.com"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/3 hover:bg-white/10 hover:ring-1 hover:ring-cyan-400/25 transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 ring-1 ring-white/15 group-hover:scale-105 transition-transform">
                    <Mail size={17} className="text-cyan-300" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-wider text-blue-300/60">
                      Email
                    </span>
                    <span className="truncate block group-hover:text-white transition-colors">
                      support@pharmacare.com
                    </span>
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </a>
              </li>
              <li>
                <a
                  href="tel:+9779800000000"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/3 hover:bg-white/10 hover:ring-1 hover:ring-cyan-400/25 transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 ring-1 ring-white/15 group-hover:scale-105 transition-transform">
                    <Phone size={17} className="text-cyan-300" />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider text-blue-300/60">
                      Phone
                    </span>
                    <span className="group-hover:text-white transition-colors">
                      +977-9800000000
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/3 ring-1 ring-white/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 ring-1 ring-white/15">
                    <Facebook size={17} className="text-cyan-300" />
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

            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-950/80 to-blue-950/50 ring-1 ring-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-blue-300/50">
                    System
                  </p>
                  <p className="text-xs text-blue-200/70 mt-0.5">
                    All services operational
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-mono text-cyan-100 ring-1 ring-white/10">
                    v{systemVersion}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
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
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-white/5 to-blue-500/10 px-5 py-4 ring-1 ring-cyan-400/20">
          <p className="text-sm text-blue-100/90 text-center sm:text-left">
            Questions about inventory or billing?{" "}
            <span className="text-white font-medium">We&apos;re here to help.</span>
          </p>
          <a
            href="mailto:support@pharmacare.com"
            className="inline-flex items-center gap-2 shrink-0 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-cyan-500/25 hover:bg-cyan-400 hover:shadow-cyan-400/30 hover:-translate-y-0.5 transition-all"
          >
            <Mail size={16} />
            Contact support
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        title="Back to top"
        aria-label="Back to top"
        className={`fixed right-5 bottom-6 z-40 flex items-center gap-2 rounded-full bg-cyan-500 pl-3 pr-4 py-2.5 text-slate-900 text-sm font-semibold shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300/50 hover:bg-cyan-400 hover:shadow-cyan-400/40 hover:-translate-y-1 transition-all duration-300 ${
          showTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={18} strokeWidth={2.5} />
        <span className="hidden sm:inline">Top</span>
      </button>

      <div className="relative border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-200/75">
            <p className="text-center md:text-left order-2 md:order-1">
              © {currentYear}{" "}
              <span className="text-white/90 font-medium">PharmaCare</span>
              <span className="hidden md:inline text-blue-400/40 mx-2">·</span>
              <span className="block md:inline mt-1 md:mt-0">
                Developed by Aaloka Poudel
              </span>
            </p>

            <nav
              className="flex flex-wrap items-center justify-center gap-4 text-xs order-1 md:order-2"
              aria-label="Footer legal"
            >
              <Link
                to="/"
                className="hover:text-cyan-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/reports"
                className="hover:text-cyan-300 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/reports"
                className="hover:text-cyan-300 transition-colors"
              >
                Help
              </Link>
            </nav>

            <p className="text-xs text-blue-300/50 flex items-center gap-1.5 order-3">
              <Heart size={12} className="text-rose-400/80 fill-rose-400/30" />
              React & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
