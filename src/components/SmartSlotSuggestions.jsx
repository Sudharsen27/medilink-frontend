export default function SmartSlotSuggestions({ slots, onPick }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((s, i) => (
        <button
          key={i}
          onClick={() => onPick(s.hour)}
          className="border p-3 rounded hover:bg-blue-50"
        >
          ⏰ {s.hour}:00  
          <div className="text-xs text-green-600">
            Confidence {s.score}%
          </div>
        </button>
      ))}
    </div>
  );
}
