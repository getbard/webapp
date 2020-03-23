type ProfileSectionSelectorProps = {
  section: string;
  setSection: (name: string) => void;
  name: string;
}

export function ProfileSectionSelector({
  section,
  setSection,
  name,
}: ProfileSectionSelectorProps): React.ReactElement {
  const active = section === name.toLowerCase();
  const classes = `${active && 'border-b border-gray-700'} ${!active && 'text-gray-500'} pb-5 inline mr-8 text-2xl hover:cursor-pointer hover:text-gray-800 transition duration-150 ease-in-out`;
  return (
    <div
      className={classes}
      onClick={(): void => setSection(name.toLowerCase())}
    >
      {name}
    </div>
  );
}

export default ProfileSectionSelector;
