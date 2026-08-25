import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Pill, Shield, X, LogOut, Circle, Bell, Clock } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Inventory", path: "/admin/inventory" },
  { name: "Sales", path: "/admin/sales" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Add Medicine", path: "/admin/add-medicine" },
];

const AdminHeader: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const adminUser =
    localStorage.getItem("pharmaUser") ||
    localStorage.getItem("rememberEmail") ||
    "Admin";

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const clockLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    isActive(path)
      ? "bg-white/15 text-white font-semibold ring-1 ring-white/20"
      : "text-blue-100/95 hover:bg-white/10 hover:text-white";

  const currentPage =
    navItems.find((item) => isActive(item.path))?.name ?? "Admin";

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    if (!window.confirm("Sign out of the admin panel?")) return;

    localStorage.removeItem("pharmaUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    closeMenu();
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 text-white backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? "shadow-xl shadow-blue-950/30" : "shadow-lg shadow-blue-950/20"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          to="/admin"
          className="group flex shrink-0 items-center gap-2.5"
          onClick={closeMenu}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 transition group-hover:bg-white/15">
            <Pill className="h-5 w-5 text-cyan-300" aria-hidden />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight">PharmaCare</h1>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-blue-200/80 sm:block">
              {currentPage}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 ${navLinkClass(item.path)}`}
            >
              {item.name}
            </Link>
          ))}

          <span
            className="mx-1 hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-blue-100 xl:inline-flex"
            title={clockLabel}
          >
            <Clock size={13} className="text-cyan-300" aria-hidden />
            {clockLabel}
          </span>

          <button
            type="button"
            aria-label="Notifications (demo)"
            title="No new notifications"
            className="relative hidden rounded-lg p-2 text-blue-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 lg:inline-flex"
          >
            <Bell size={18} aria-hidden />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-blue-900" />
          </button>

          <span
            className="mx-2 hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-blue-100 lg:inline-flex"
            title={adminUser}
          >
            <Circle size={8} className="fill-green-400 text-green-400" aria-hidden />
            <span className="max-w-[120px] truncate">{adminUser}</span>
          </span>

          <Link
            to="/"
            className="ml-1 flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-1.5 text-sm transition hover:bg-slate-950/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
          >
            <Shield size={14} className="text-cyan-300" aria-hidden />
            Site
          </Link>

          <Link
            to="/login"
            onClick={handleLogout}
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-900 shadow-md shadow-blue-950/30 transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
          >
            <LogOut size={14} aria-hidden />
            Logout
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="admin-mobile-nav"
          aria-label="Toggle admin menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav
          id="admin-mobile-nav"
          className="space-y-1 border-t border-white/10 bg-slate-900/95 px-4 pb-4 pt-2 text-sm backdrop-blur-md md:hidden"
          aria-label="Admin mobile navigation"
        >
          <p className="mb-2 truncate px-3 text-xs text-blue-200/90">
            Signed in as <span className="font-medium text-white">{adminUser}</span>
          </p>
          <p className="mb-2 px-3 text-[11px] text-blue-200/70">
            {clockLabel} · Admin panel
          </p>

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={`block rounded-lg px-3 py-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 ${navLinkClass(item.path)}`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/"
            onClick={closeMenu}
            className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5"
          >
            <Shield size={16} className="text-cyan-300" aria-hidden />
            Back to site
          </Link>

          <Link
            to="/login"
            onClick={handleLogout}
            className="mt-2 block rounded-lg bg-white px-3 py-2.5 text-center font-semibold text-blue-900"
          >
            Logout
          </Link>
        </nav>
      )}
    </header>
  );
};

export default AdminHeader;
