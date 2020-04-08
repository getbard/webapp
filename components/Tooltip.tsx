import Portal from './Portal';

function Tooltip({
  children,
  showTooltip,
  selector,
  mt = 10,
}: {
  children: React.ReactNode;
  showTooltip: boolean;
  selector: string;
  mt?: number;
}): React.ReactElement {
  const opacity = showTooltip ? '100' : '0';
  const tooltipClasses = `opacity-${opacity} text-center bg-black text-white rounded-sm px-2 py-2 absolute z-10 -mt-${mt} right-0 whitespace-no-wrap transition duration-300 ease-in-out`;

  return (
    <Portal selector={selector}>
      <span className={tooltipClasses}>
        {children}
      </span>
    </Portal>
  );
}

export default Tooltip;
