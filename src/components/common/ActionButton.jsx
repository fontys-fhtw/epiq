export default function ActionButton({
  children,
  onClick = () => {},
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-full bg-gold px-6 py-3 font-bold text-black ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
