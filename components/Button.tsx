type Props = {
  children: React.ReactChildren;
  onClick: () => void;
}

function Button({ children, onClick }: Props) {
  return (
    <button
      className="bg-primary hover:bg-secondary px-4 py-3 text-snow rounded font-serif"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
