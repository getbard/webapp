type Props = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
}

function Button({ children, onClick }: Props): React.ReactElement {
  return (
    <button
      className="bg-primary hover:bg-secondary hover:text-primary px-4 p-1 text-snow rounded font-serif"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
