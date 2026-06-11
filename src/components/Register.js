import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";
import { registerUser } from "../api/auth";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await registerUser({ name, email, password });
      if (!res.success) {
        return setError(res.message || "Registration failed.");
      }
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card glass padding="lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Join MediLink to manage your healthcare
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              icon={User}
              required
              disabled={loading}
              autoComplete="name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@medilink.com"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
              required
              disabled={loading}
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              icon={Lock}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              required
              disabled={loading}
              autoComplete="new-password"
            />

            {error && (
              <div
                role="alert"
                className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={UserPlus}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-health-600 dark:text-health-400 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Sign in
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default Register;
