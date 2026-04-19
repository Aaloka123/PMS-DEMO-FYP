import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuth, getAuth } from "../utils/auth";

const MAX_ATTEMPTS = 3;
const OTP_MAX_ATTEMPTS = 3;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"login" | "otp">("login");

  const [email, setEmail] = useState(
    localStorage.getItem("rememberEmail") || "",
  );
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [role, setRole] = useState<"admin" | "user">("user");

  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // 🔐 Auto login
  useEffect(() => {
    const { token, role } = getAuth();
    if (token && role) {
      navigate(role === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  // Clear alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Focus OTP
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // 🔑 LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts > MAX_ATTEMPTS) {
      setError("Too many login attempts. Please try later.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberEmail", email);
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setOtp("");
      setOtpAttempts(0);
      setSuccess("OTP sent successfully.");
    }, 1000);
  };

  // 🔐 OTP VERIFY
  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }

    const newOtpAttempts = otpAttempts + 1;
    setOtpAttempts(newOtpAttempts);

    if (newOtpAttempts > OTP_MAX_ATTEMPTS) {
      setError("Too many OTP attempts. Restart login.");
      setStep("login");
      setPassword("");
      setOtp("");
      return;
    }

    if (otp !== "123456") {
      setError("Incorrect OTP.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      setAuth("secure-demo-token", role);

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/");
      }, 800);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === "login" ? "Login" : "OTP Verification"}
        </h2>

        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* ROLE */}
            <div className="flex gap-2">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as "user" | "admin")}
                  className={`flex-1 py-2 rounded ${
                    role === r ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button className="w-full bg-indigo-600 text-white py-2 rounded flex justify-center items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={18} />}
              Login
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOTPVerify} className="space-y-4">
            <input
              ref={otpInputRef}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full border p-2 rounded text-center tracking-widest"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={18} />}
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
