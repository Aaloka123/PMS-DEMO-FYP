import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Mail,
  Phone,
  ArrowUp,
  Pill,
  ChevronRight,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const systemVersion = "1.1.1";

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Medicines", path: "/medicines" },
    { name: "Inventory", path: "/inventory" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
  ];

  const systemStatus = "Live";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white shadow-[0_-8px_30px_rgba(15,23,42,0.35)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, cyan 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Pill className="h-5 w-5 text-cyan-300" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">PharmaCare</h2>
              <p className="text-[10px] uppercase tracking-widest text-cyan-200/70 font-medium">
                Pharmacy suite
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-100/90 mt-5 leading-relaxed max-w-sm">
            A modern Pharmacy Management System built to manage medicines,
            inventory, billing, and analytics efficiently.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 rounded-lg bg-slate-950/50 px-3 py-2 text-xs text-blue-100/90 ring-1 ring-white/10 tabular-nums">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {time.toLocaleDateString()} · {time.toLocaleTimeString()}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-cyan-200/90 mb-4 flex items-center gap-2">
            <span className="h-px flex-1 max-w-[2rem] bg-cyan-400/50" />
            Quick Links
          </h3>
          <ul className="space-y-1.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-blue-100/90 hover:bg-white/10 hover:text-white transition-colors duration-200"
                >
                  <ChevronRight
                    size={14}
                    className="text-cyan-400/60 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
                  />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-cyan-200/90 mb-4 flex items-center gap-2">
            <span className="h-px flex-1 max-w-[2rem] bg-cyan-400/50" />
            Contact & System
          </h3>
          <ul className="space-y-2.5 text-sm text-blue-100/90">
            <li>
              <a
                href="mailto:support@pharmacare.com"
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Mail size={15} className="text-cyan-300" />
                </span>
                support@pharmacare.com
              </a>
            </li>
            <li>
              <span className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Phone size={15} className="text-cyan-300" />
                </span>
                +977-9800000000
              </span>
            </li>
            <li>
              <span className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Facebook size={15} className="text-cyan-300" />
                </span>
                PharmaCare Official
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-3 pt-2 text-xs text-blue-200/80">
              <span className="rounded-md bg-slate-950/50 px-2.5 py-1 ring-1 ring-white/10">
                v{systemVersion}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-emerald-300 ring-1 ring-emerald-400/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {systemStatus}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        title="Back to top"
        className="absolute right-4 sm:right-6 bottom-24 sm:bottom-[5.5rem] flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/90 text-slate-900 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 hover:-translate-y-0.5 transition-all duration-200"
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>

      <div className="relative border-t border-white/10 bg-slate-950/40 text-center text-sm py-5 px-4 text-blue-200/80">
        <p>
          © {currentYear} PharmaCare · Developed by Aaloka Poudel · All rights
          reserved.
        </p>
        <p className="text-xs mt-1.5 text-blue-300/60">
          Powered by React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
