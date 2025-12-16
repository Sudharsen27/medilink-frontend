// import { useEffect, useState } from "react";
// import CaregiverSwitch from "../components/caregivers/CaregiverSwitch";
// import DependentForm from "../components/caregivers/DependentForm";
// import DependentList from "../components/caregivers/DependentList";

// export default function Caregivers() {
//   const [dependents, setDependents] = useState([]);

//   const load = async () => {
//     const res = await fetch("/api/dependents", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     setDependents(await res.json());
//   };

//   useEffect(() => { load(); }, []);

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Caregiver Mode</h1>
//       <CaregiverSwitch dependents={dependents} />
//       <DependentForm onSuccess={load} />
//       <DependentList dependents={dependents} />
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import CaregiverSwitch from "../components/caregivers/CaregiverSwitch";
// import DependentForm from "../components/caregivers/DependentForm";
// import DependentList from "../components/caregivers/DependentList";

// export default function Caregivers() {
//   const [dependents, setDependents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadDependents = async () => {
//     try {
//       const res = await fetch("/api/dependents", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await res.json();
//       setDependents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load dependents", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDependents();
//   }, []);

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Caregiver Mode</h1>

//       {loading ? (
//         <p className="text-gray-500">Loading family members...</p>
//       ) : (
//         <>
//           {/* Switch between self / dependents */}
//           <CaregiverSwitch dependents={dependents} />

//           {/* Add dependent */}
//           <DependentForm onSuccess={loadDependents} />

//           {/* List dependents */}
//           <DependentList dependents={dependents} />
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import CaregiverSwitch from "../components/CaregiverSwitch";
import DependentForm from "../components/DependentForm";
import DependentList from "../components/DependentList";

export default function Caregivers() {
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDependents = async () => {
    try {
      const res = await fetch("/api/dependents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setDependents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load dependents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDependents();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Caregiver Mode</h1>

      {loading ? (
        <p className="text-gray-500">Loading family members...</p>
      ) : (
        <>
          {/* Switch between self / dependents */}
          <CaregiverSwitch dependents={dependents} />

          {/* Add dependent */}
          <DependentForm onSuccess={loadDependents} />

          {/* List dependents */}
          <DependentList dependents={dependents} />
        </>
      )}
    </div>
  );
}
