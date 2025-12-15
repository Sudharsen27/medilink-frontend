// import React, { useState } from "react";
// import { registerUser } from "../api/auth";

// function Register({ onSuccess }) {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   // ✅ Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, email, password, confirmPassword } = form;

//     // Basic validations
//     if (!name || !email || !password || !confirmPassword) {
//       return setError("All fields are required.");
//     }
//     if (password.length < 6) {
//       return setError("Password must be at least 6 characters.");
//     }
//     if (password !== confirmPassword) {
//       return setError("Passwords do not match.");
//     }

//     try {
//       setLoading(true);
//       await registerUser({ name, email, password });
//       alert("Registered successfully!");
//       onSuccess(); // Redirect or show login
//     } catch (err) {
//       const message =
//         err.response?.data?.error || "Registration failed. Please try again.";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
//       >
//         <h2 className="text-3xl font-bold text-center text-green-700">
//           Create an Account
//         </h2>

//         {["name", "email", "password", "confirmPassword"].map((field) => (
//           <input
//             key={field}
//             name={field}
//             type={field.includes("password") ? "password" : field}
//             placeholder={
//               field === "name"
//                 ? "Full Name"
//                 : field === "email"
//                 ? "Email Address"
//                 : field === "password"
//                 ? "Password"
//                 : "Confirm Password"
//             }
//             value={form[field]}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//         ))}

//         {error && <div className="text-red-600 text-sm text-center">{error}</div>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300 disabled:opacity-50"
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p className="text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <button
//             type="button"
//             onClick={onSuccess}
//             className="text-green-600 hover:underline"
//           >
//             Login here
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Register;


// import React, { useState } from "react";
// import { registerUser } from "../api/auth";

// function Register({ onSuccess }) {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // -----------------------------------------
//   // Handle input change
//   // -----------------------------------------
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   // -----------------------------------------
//   // Handle register submit
//   // -----------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, password, confirmPassword } = form;

//     // Frontend validations
//     if (!name || !email || !password || !confirmPassword) {
//       return setError("All fields are required.");
//     }
//     if (password.length < 6) {
//       return setError("Password must be at least 6 characters.");
//     }
//     if (password !== confirmPassword) {
//       return setError("Passwords do not match.");
//     }

//     try {
//       setLoading(true);

//       const res = await registerUser({ name, email, password });

//       // Backend returns { success, message, token, user }
//       if (!res.success) {
//         return setError(res.message || "Registration failed.");
//       }

//       alert("Registered successfully!");
//       onSuccess(); // Redirect to login

//     } catch (err) {
//       console.error("REGISTER ERROR:", err);

//       const message =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         "Registration failed. Please try again.";

//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
//       >
//         <h2 className="text-3xl font-bold text-center text-green-700">
//           Create an Account
//         </h2>

//         {["name", "email", "password", "confirmPassword"].map((field) => (
//           <input
//             key={field}
//             name={field}
//             type={field.includes("password") ? "password" : field}
//             placeholder={
//               field === "name"
//                 ? "Full Name"
//                 : field === "email"
//                 ? "Email Address"
//                 : field === "password"
//                 ? "Password"
//                 : "Confirm Password"
//             }
//             value={form[field]}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//         ))}

//         {/* Error message */}
//         {error && <div className="text-red-600 text-sm text-center">{error}</div>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300 disabled:opacity-50"
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p className="text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <button
//             type="button"
//             onClick={onSuccess}
//             className="text-green-600 hover:underline"
//           >
//             Login here
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Register;


import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

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

  // -----------------------------------------
  // Handle input change
  // -----------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // -----------------------------------------
  // Handle register submit
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;

    // Frontend validations
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

      // Backend returns:
      // { success: true/false, message, token, user }
      if (!res.success) {
        return setError(res.message || "Registration failed.");
      }

      alert("Registered successfully!");

      // Redirect to login page
      navigate("/login");

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // JSX
  // -----------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-green-700">
          Create an Account
        </h2>

        {["name", "email", "password", "confirmPassword"].map((field) => (
          <input
            key={field}
            name={field}
            type={field.includes("password") ? "password" : field}
            placeholder={
              field === "name"
                ? "Full Name"
                : field === "email"
                ? "Email Address"
                : field === "password"
                ? "Password"
                : "Confirm Password"
            }
            value={form[field]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        ))}

        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
