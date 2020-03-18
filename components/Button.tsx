type Props = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
  className?: string;
  thin?: boolean;
}

function Button({ children, onClick, className, thin }: Props): React.ReactElement {
  const classes = `bg-primary hover:bg-secondary px-4 ${thin ? 'py-1' : 'py-2'} text-white rounded ${className}`
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
