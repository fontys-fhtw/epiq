export default function ActionButton({ label, onClick, className = "" }) {
  return (
    <button
      className={`rounded-full bg-gold px-6 py-3 font-bold text-white ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
