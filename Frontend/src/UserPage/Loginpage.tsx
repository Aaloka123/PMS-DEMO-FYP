import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Pill,
  ArrowLeft,
} from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("pharmaUser");
    if (savedUser) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!info) return;
    const timer = setTimeout(() => setInfo(""), 4000);
    return () => clearTimeout(timer);
  }, [info]);

  const resetErrors = () => {
    setError("");
    setInfo("");
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setInfo("");
  };

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (email === "admin@pharma.com" && password === "admin123") {
          if (remember) {
            localStorage.setItem("pharmaUser", email);
          }
          navigate("/");
        } else {
          setError("Invalid email or password.");
        }
      } else {
        alert("Account created successfully! Please login.");
        setIsLogin(true);
        resetForm();
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="font-sans min-h-screen bg-slate-100 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950 px-10 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.35), transparent 45%), radial-gradient(circle at 80% 60%, rgba(59,130,246,0.35), transparent 40%)",
          }}
          aria-hidden
        />

        <div className="relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-100/90 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-14 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Pill className="h-9 w-9 text-cyan-300" strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">PharmaCare</h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-blue-100/90">
            Secure pharmacy operations: inventory, dispensing workflows, and
            clear reporting in one place.
          </p>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2">
          {[
            { label: "Uptime", value: "99.9%" },
            { label: "Roles", value: "Admin & staff" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200/90">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-white shadow-lg shadow-blue-900/30">
              <ShieldCheck className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                PharmaCare
              </p>
              <p className="text-lg font-bold text-slate-900">Welcome</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
              {isLogin ? "Sign in" : "Create account"}
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              {isLogin
                ? "Use your pharmacy credentials to continue."
                : "Register to start using PharmaCare."}
            </p>

            <div className="mt-8 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (loading) return;
                  setIsLogin(true);
                  resetForm();
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                  isLogin
                    ? "bg-white text-blue-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (loading) return;
                  setIsLogin(false);
                  resetForm();
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                  !isLogin
                    ? "bg-white text-blue-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {!isLogin && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={name}
                      disabled={loading}
                      onChange={(e) => {
                        setName(e.target.value);
                        resetErrors();
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="admin@pharma.com"
                    value={email}
                    disabled={loading}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      resetErrors();
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    value={password}
                    disabled={loading}
                    onKeyUp={handleCapsLock}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      resetErrors();
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {capsLock && (
                  <p className="mt-1.5 text-xs font-medium text-amber-600">
                    Caps Lock is on
                  </p>
                )}
              </div>

              {isLogin && (
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      disabled={loading}
                      onChange={() => setRemember(!remember)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setInfo("Password reset is not available in this demo.")
                    }
                    className="font-medium text-blue-700 transition hover:text-blue-800 hover:underline disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {info && (
                <p
                  className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-center text-sm text-blue-800"
                  role="status"
                >
                  {info}
                </p>
              )}

              {error && (
                <p
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  loading
                    ? "cursor-not-allowed bg-slate-300 text-white shadow-none"
                    : "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-blue-700/25 hover:from-blue-800 hover:to-blue-700 active:scale-[0.99]"
                }`}
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Please wait…" : isLogin ? "Continue" : "Create account"}
              </button>

              <p className="text-center text-xs text-slate-400">
                Encrypted session · Demo: admin@pharma.com / admin123
              </p>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} PharmaCare
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
