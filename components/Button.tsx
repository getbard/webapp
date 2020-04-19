import { FiLoader } from 'react-icons/fi';

type Props = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
  className?: string;
  thin?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  loading?: boolean;
  text?: boolean;
  trackEvent?: string;
}

function Button({
  children,
  onClick,
  className,
  thin,
  disabled: isDisabled,
  secondary,
  loading,
  text = false,
  trackEvent,
}: Props): React.ReactElement {
  const yPadding = thin ? 'py-1' : 'py-2';
  const textColor = (text || secondary) ? 'text-primary' : 'text-white';
  const hoverText = text ? 'hover:underline' : 'hover:text-white';
  const bgColor = secondary ? 'bg-white' : 'bg-primary';
  const bgHoverColor = secondary ? 'hover:bg-primary' : 'hover:bg-secondary';
  const borderHoverColor = secondary ? 'hover:border-primary' : 'hover:border-secondary';
  const disabled = (isDisabled && 'opacity-50 cursor-not-allowed') || loading;

  const classes = `focus:outline-none inline-flex justify-center items-center ${!text && 'border'} border-primary ${!disabled && borderHoverColor} transition duration-150 ease-in-out ${!text && bgColor} px-4 ${yPadding} ${disabled} ${textColor} ${hoverText} ${(!disabled && !text) && bgHoverColor} rounded ${className}`

  const handleClick = (): void => {
    if (trackEvent) {
      window.analytics.track(trackEvent);
    }

    if (onClick) {
      onClick();
    }
  }

  return (
    <button
      className={classes}
      onClick={handleClick}
      type="submit"
    >
      {loading && <FiLoader className="inline-block icon-spin text-xs mr-1" />}
      {children}
    </button>
  );
}

export default Button;
