export default function Avatar({ name, size = 40 }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}
