import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";
import SmartSlotSuggestions from "./SmartSlotSuggestions";

export default function SmartBooking({ doctorId, onConfirm }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    fetch(apiUrl(`/api/smart-appointments/smart-slots?doctorId=${doctorId}`), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(console.error);
  }, [doctorId]);

  if (!slots.length) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Recommended Slots</h3>
      <SmartSlotSuggestions
        slots={slots}
        onPick={(hour) => onConfirm(`${hour}:00`)}
      />
    </div>
  );
}
