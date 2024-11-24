export default function IconButton({ children, onClick, className }) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded p-1 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
