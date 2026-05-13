import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Pill } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Medicines", path: "/medicines" },
    { name: "Inventory", path: "/inventory" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
  ];

  const navLinkClass = (path: string) =>
    location.pathname === path
      ? "text-white font-semibold bg-white/15 px-3 py-1.5 rounded-lg"
      : "text-blue-100/95 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors duration-200";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 text-white shadow-lg shadow-blue-950/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 transition group-hover:bg-white/15">
            <Pill className="h-5 w-5 text-cyan-300" aria-hidden />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight">PharmaCare</h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-200/80 font-medium hidden sm:block">
              Inventory suite
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex flex-1 justify-end gap-1 text-sm items-center">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
              {item.name}
            </Link>
          ))}

          <Link
            to="/admin"
            className="flex items-center gap-2 ml-2 bg-slate-950/50 px-4 py-2 rounded-lg border border-white/10 hover:bg-slate-950/70 transition-colors duration-200"
          >
            <Shield size={15} className="text-cyan-300" />
            Admin
          </Link>

          <Link
            to="/login"
            className="ml-1 bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-md shadow-blue-950/30 hover:bg-cyan-50 transition-colors duration-200"
          >
            Login
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 px-4 pb-4 pt-2 space-y-1 text-sm backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block rounded-lg px-3 py-2.5 ${
                location.pathname === item.path
                  ? "bg-white/15 text-white font-semibold"
                  : "text-blue-100 hover:bg-white/10"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 bg-slate-950/60 px-3 py-2.5 rounded-lg border border-white/10 text-white mt-2"
          >
            <Shield size={16} className="text-cyan-300" />
            Admin panel
          </Link>

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block text-center bg-white text-blue-900 px-3 py-2.5 rounded-lg font-semibold mt-2"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
