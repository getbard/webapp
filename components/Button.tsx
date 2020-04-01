import { FiLoader } from 'react-icons/fi';

type Props = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
  className?: string;
  thin?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  loading?: boolean;
}

function Button({
  children,
  onClick,
  className,
  thin,
  disabled: isDisabled,
  secondary,
  loading,
}: Props): React.ReactElement {
  const yPadding = thin ? 'py-1' : 'py-2';
  const textColor = secondary ? 'text-primary' : 'text-white';
  const bgColor = secondary ? 'bg-white' : 'bg-primary';
  const bgHoverColor = secondary ? 'hover:bg-primary' : 'hover:bg-secondary';
  const borderHoverColor = secondary ? 'hover:border-primary' : 'hover:border-secondary';

  const disabled = isDisabled ? 'opacity-50 cursor-not-allowed' : bgHoverColor;
  const classes = `inline-flex items-center border border-primary ${borderHoverColor} transition duration-150 ease-in-out ${bgColor} px-4 ${yPadding} ${disabled} ${textColor} hover:text-white rounded ${className}`
  return (
    <button
      className={classes}
      onClick={onClick}
      type="submit"
    >
      {loading && <FiLoader className="inline-block icon-spin text-xs mr-1" />}
      {children}
    </button>
  );
}

export default Button;
