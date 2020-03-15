type Props = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
  className?: string;
}

function Button({ children, onClick, className }: Props): React.ReactElement {
  const classes = `bg-primary hover:bg-secondary px-4 py-2 text-white rounded ${className}`
  return (
    <button
      className={classes}
      onClick={onClick}
      type="submit"
    >
      {children}
    </button>
  );
}

export default Button;
