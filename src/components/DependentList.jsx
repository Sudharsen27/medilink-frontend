// import Avatar from "./Avatar";


// export default function DependentList({ dependents }) {
//   if (!dependents.length) {
//     return <p className="text-gray-500">No family members added.</p>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {dependents.map((d) => (
//         <div key={d.id} className="border rounded p-4 flex gap-3 items-center">
//           <Avatar name={d.name} />
//           <div>
//             <p className="font-semibold">{d.name}</p>
//             <p className="text-sm text-gray-600">
//               {d.relationship} • Age {d.age}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import { Trash2 } from "lucide-react";

export default function DependentList({ dependents = [] }) {
  if (dependents.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-6">
        No family members added yet.
      </p>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
    >
      <AnimatePresence>
        {dependents.map((dep) => (
          <motion.div
            key={dep.id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
          >
            {/* Top row */}
            <div className="flex items-center gap-4 mb-3">
              <Avatar name={dep.name} size={48} />
              <div>
                <h4 className="font-semibold text-lg text-gray-800">
                  {dep.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {dep.relationship || "Family Member"}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                Age: {dep.age || "—"}
              </span>

              <button
                title="Remove"
                className="text-red-500 hover:text-red-700 transition"
                onClick={() => handleDelete(dep.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Accent glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-0 hover:opacity-20 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

/* --------------------------------
   Delete Handler (optional)
--------------------------------- */
async function handleDelete(id) {
  if (!window.confirm("Remove this family member?")) return;

  try {
    await fetch(`/api/dependents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    window.location.reload(); // simple refresh
  } catch (err) {
    alert("Failed to remove member");
  }
}

/* --------------------------------
   Animations
--------------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};
