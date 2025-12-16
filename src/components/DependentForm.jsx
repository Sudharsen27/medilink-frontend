// import { useState } from "react";

// export default function DependentForm({ onSuccess }) {
//   const [form, setForm] = useState({ name: "", age: "", relationship: "" });

//   const submit = async () => {
//     if (!form.name) return;

//     await fetch("/api/dependents", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify(form),
//     });

//     setForm({ name: "", age: "", relationship: "" });
//     onSuccess();
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow mb-6">
//       <h3 className="font-semibold mb-2">Add Family Member</h3>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//         <input placeholder="Name" className="border p-2 rounded"
//           value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
//         <input placeholder="Age" type="number" className="border p-2 rounded"
//           value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
//         <input placeholder="Relationship" className="border p-2 rounded"
//           value={form.relationship}
//           onChange={e => setForm({ ...form, relationship: e.target.value })} />
//       </div>

//       <button
//         onClick={submit}
//         className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Add Member
//       </button>
//     </div>
//   );
// }

// import { useState } from "react";
// import { UserPlus, User, Calendar, Heart, Check, Loader2 } from "lucide-react";

// export default function DependentForm({ onSuccess }) {
//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     relationship: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [focusedField, setFocusedField] = useState(null);

//   const submit = async () => {
//     if (!form.name) return;

//     try {
//       setIsSubmitting(true);

//       const res = await fetch("/api/dependents", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to add dependent");
//       }

//       setForm({ name: "", age: "", relationship: "" });
//       setShowSuccess(true);

//       setTimeout(() => {
//         setShowSuccess(false);
//         onSuccess?.();
//       }, 2000);
//     } catch (err) {
//       console.error("Error adding dependent:", err);
//       alert("Failed to add family member");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative max-w-4xl mx-auto mb-8">
//       {/* Card */}
//       <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//         {/* Decorative background */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
//         <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" />
//         <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

//         <div className="relative z-10 p-8">
//           {/* Header */}
//           <div className="flex items-center gap-3 mb-8">
//             <div className="p-3 bg-gradient-to-br from-green-500 rounded-xl shadow-lg">
//               <UserPlus className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-gray-800">
//                 Add Family Member
//               </h3>
//               <p className="text-sm text-gray-500">
//                 Manage care for your loved ones
//               </p>
//             </div>
//           </div>

//           {/* Inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             {/* Name */}
//             <InputField
//               icon={User}
//               placeholder="Full Name"
//               value={form.name}
//               onChange={(v) => setForm({ ...form, name: v })}
//               focused={focusedField === "name"}
//               onFocus={() => setFocusedField("name")}
//               onBlur={() => setFocusedField(null)}
//               ring="blue"
//             />

//             {/* Age */}
//             <InputField
//               icon={Calendar}
//               placeholder="Age"
//               type="number"
//               value={form.age}
//               onChange={(v) => setForm({ ...form, age: v })}
//               focused={focusedField === "age"}
//               onFocus={() => setFocusedField("age")}
//               onBlur={() => setFocusedField(null)}
//               ring="purple"
//             />

//             {/* Relationship */}
//             <InputField
//               icon={Heart}
//               placeholder="Relationship"
//               value={form.relationship}
//               onChange={(v) => setForm({ ...form, relationship: v })}
//               focused={focusedField === "relationship"}
//               onFocus={() => setFocusedField("relationship")}
//               onBlur={() => setFocusedField(null)}
//               ring="pink"
//             />
//           </div>

//           {/* Submit */}
//           <button
//             onClick={submit}
//             disabled={isSubmitting || !form.name}
//             className={`relative px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
//               !form.name
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-xl active:scale-95"
//             }`}
//           >
//             <span className="flex items-center gap-2 justify-center">
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Adding…
//                 </>
//               ) : showSuccess ? (
//                 <>
//                   <Check className="w-5 h-5" />
//                   Added!
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5" />
//                   Add Family Member
//                 </>
//               )}
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Toast */}
//       <div
//         className={`fixed top-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl flex gap-3 transition-all duration-500 ${
//           showSuccess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
//         }`}
//       >
//         <Check className="w-5 h-5" />
//         <div>
//           <p className="font-semibold">Success</p>
//           <p className="text-sm">Family member added</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------
//    Reusable Input Component
// ---------------------------------- */
// function InputField({
//   icon: Icon,
//   placeholder,
//   value,
//   onChange,
//   type = "text",
//   focused,
//   onFocus,
//   onBlur,
//   ring,
// }) {
//   return (
//     <div className="relative group">
//       <div
//         className={`absolute inset-0 rounded-xl blur transition-opacity duration-300 ${
//           focused ? "opacity-20" : "opacity-0"
//         } bg-${ring}-400`}
//       />
//       <div className="relative">
//         <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <input
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={onFocus}
//           onBlur={onBlur}
//           className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl outline-none transition-all
//             border-gray-200 focus:border-${ring}-500 focus:ring-4 focus:ring-${ring}-100`}
//         />
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { UserPlus, User, Calendar, Heart, Check, Loader2 } from "lucide-react";

/* ---------------------------------
   Tailwind-safe color map
---------------------------------- */
const COLOR = {
  blue: {
    glow: "bg-blue-400",
    border: "focus:border-blue-500",
    ring: "focus:ring-blue-100",
  },
  purple: {
    glow: "bg-purple-400",
    border: "focus:border-purple-500",
    ring: "focus:ring-purple-100",
  },
  pink: {
    glow: "bg-pink-400",
    border: "focus:border-pink-500",
    ring: "focus:ring-pink-100",
  },
};

export default function DependentForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", age: "", relationship: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focus, setFocus] = useState(null);

  const submit = async () => {
    if (!form.name) return;

    try {
      setLoading(true);

      const res = await fetch("/api/dependents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setForm({ name: "", age: "", relationship: "" });
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 1800);
    } catch {
      alert("Failed to add family member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
      {/* Card */}
      <div className="relative rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
        {/* Ambient gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-40" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-300 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 blur-3xl opacity-20 animate-pulse" />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Add Family Member
              </h3>
              <p className="text-sm text-gray-500">
                Manage care for your loved ones
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <InputField
              icon={User}
              placeholder="Full Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              focused={focus === "name"}
              onFocus={() => setFocus("name")}
              onBlur={() => setFocus(null)}
              color="blue"
            />

            <InputField
              icon={Calendar}
              placeholder="Age"
              type="number"
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
              focused={focus === "age"}
              onFocus={() => setFocus("age")}
              onBlur={() => setFocus(null)}
              color="purple"
            />

            <InputField
              icon={Heart}
              placeholder="Relationship"
              value={form.relationship}
              onChange={(v) => setForm({ ...form, relationship: v })}
              focused={focus === "relationship"}
              onFocus={() => setFocus("relationship")}
              onBlur={() => setFocus(null)}
              color="pink"
            />
          </div>

          {/* Button */}
          <button
            onClick={submit}
            disabled={loading || !form.name}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300
              ${
                !form.name
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-xl active:scale-95"
              }`}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding…
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  Added!
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Add Family Member
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Toast */}
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl
        bg-gradient-to-r from-green-500 to-emerald-600 text-white transition-all duration-500
        ${success ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <Check className="w-5 h-5" />
        <div>
          <p className="font-semibold">Success</p>
          <p className="text-sm">Family member added</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------
   Reusable Input (Safe)
---------------------------------- */
function InputField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
  focused,
  onFocus,
  onBlur,
  color,
}) {
  const c = COLOR[color];

  return (
    <div className="relative">
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-xl blur transition-opacity duration-300
          ${focused ? "opacity-20" : "opacity-0"} ${c.glow}`}
      />

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl outline-none transition-all
            border-gray-200 ${c.border} focus:ring-4 ${c.ring}`}
        />
      </div>
    </div>
  );
}
