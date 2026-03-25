import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"login" | "otp">("login");

  const [email, setEmail] = useState(
    localStorage.getItem("rememberEmail") || "",
  );
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [role, setRole] = useState<"admin" | "user">("user"); // NEW

  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  const MAX_ATTEMPTS = 3;

  // 🔐 Auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token && savedRole) {
      navigate(savedRole === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  // Auto clear alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Cooldowns
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus OTP
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (cooldown > 0) return;

    if (!validateEmail(email) || password.length < 6) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setCooldown(10);
        setAttempts(0);
        setError("Too many failed attempts. Try again in 10 seconds.");
      } else {
        setError(
          `Invalid credentials. Attempts left: ${MAX_ATTEMPTS - newAttempts}`,
        );
      }
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setResendCooldown(10);
      setOtp("");
      setSuccess("OTP sent (Use 123456)");
    }, 1200);
  };

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    if (otp !== "123456") {
      setError("Invalid OTP.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("role", role);

      setSuccess("Login successful 🚀");

      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/");
      }, 1200);
    }, 1200);
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;

    setResendCooldown(10);
    setSuccess("OTP resent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          {step === "login" ? "Secure Login" : "Verify OTP"}
        </h2>

        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-2 rounded-lg ${
                  role === "user" ? "bg-indigo-600 text-white" : "bg-gray-200"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 rounded-lg ${
                  role === "admin" ? "bg-indigo-600 text-white" : "bg-gray-200"
                }`}
              >
                Admin
              </button>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              disabled={cooldown > 0}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                disabled={cooldown > 0}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Login
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOTPVerify} className="space-y-5">
            <input
              ref={otpInputRef}
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter OTP"
            />

            <p
              className="text-sm text-indigo-600 cursor-pointer"
              onClick={handleResendOTP}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP"}
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
