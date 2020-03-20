type Props = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
  className?: string;
  thin?: boolean;
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  className,
  thin,
  disabled: isDisabled,
}: Props): React.ReactElement {
  const yPadding = thin ? 'py-1' : 'py-2';
  const disabled = isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary';
  const classes = `bg-primary px-4 ${yPadding} ${disabled} text-white rounded ${className}`
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
