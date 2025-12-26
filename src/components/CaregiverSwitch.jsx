

import { useCaregiver } from "../context/CaregiverContext";
import Avatar from "./Avatar";

export default function CaregiverSwitch({ dependents = [] }) {
  const { activePerson, setActivePerson } = useCaregiver();

  return (
    <div className="mb-6">
      {/* Wrapper */}
      <div
        className="
          flex gap-3 overflow-x-auto pb-2
          sm:grid sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {/* Myself */}
        <button
          onClick={() =>
            setActivePerson({ type: "self", id: null, name: "Myself" })
          }
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg min-w-[140px]
            transition-all duration-200
            ${
              activePerson?.type === "self"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
        >
          <Avatar name="Myself" size={30} />
          <span className="font-medium truncate">Myself</span>
        </button>

        {/* Dependents */}
        {dependents.map((d) => (
          <button
            key={d.id}
            onClick={() =>
              setActivePerson({
                type: "dependent",
                id: d.id,
                name: d.name,
              })
            }
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg min-w-[140px]
              transition-all duration-200
              ${
                activePerson?.id === d.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            <Avatar name={d.name} size={30} />
            <span className="font-medium truncate">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
