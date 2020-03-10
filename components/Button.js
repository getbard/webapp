export default function Button({ children, onClick }) {
  return (
    <button className="bg-primary hover:bg-secondary px-4 py-3 text-snow rounded font-serif" onClick={onClick}>
      {children}
    </button>
  );
}
