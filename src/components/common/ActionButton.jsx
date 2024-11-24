export default function ActionButton({ children, onClick, className = "" }) {
  return (
    <button
      className={`rounded-full bg-gold px-6 py-3 font-bold text-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
