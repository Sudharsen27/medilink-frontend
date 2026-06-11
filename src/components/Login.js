import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Activity,
} from "lucide-react";
import { loginUser } from "../api/auth";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);
      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-health-200/40 dark:bg-health-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-health-600 shadow-glow mb-4">
              <Activity className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              MediLink
            </h1>
            <p className="text-slate-500 text-sm mt-1">Your healthcare partner</p>
          </div>

          <Card glass padding="lg" className="max-w-md mx-auto lg:mx-0">
            <div className="text-center mb-8">
              <div className="hidden lg:inline-flex items-center justify-center w-12 h-12 rounded-xl bg-health-600 shadow-glow mb-4">
                <Activity className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                Welcome back
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Sign in to continue to your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@medilink.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
                disabled={loading}
                autoComplete="email"
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
                disabled={loading}
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />

              {error && (
                <div
                  role="alert"
                  className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                icon={LogIn}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-slate-400 bg-white/80 dark:bg-slate-900/80">
                  or
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-health-600 dark:text-health-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                Create account
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </p>
          </Card>
        </motion.div>

        {/* Hero — telemedicine lifestyle photo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div
              className="absolute inset-0 bg-gradient-to-tr from-health-500/20 to-blue-500/20 rounded-card-xl blur-2xl"
              aria-hidden="true"
            />
            <img
              src="/Images/login-hero.png"
              alt="Patient using MediLink telemedicine at home"
              className="relative rounded-card-xl shadow-glass-lg w-full object-cover max-h-[560px] border border-white/40 dark:border-slate-700/50"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
