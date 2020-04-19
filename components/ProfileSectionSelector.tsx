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
  const classes = `${active && 'border-b-2 border-primary'} ${active && 'text-primary'} text-gray-500 pb-5 inline mr-8 text-2xl hover:cursor-pointer hover:text-primary transition duration-150 ease-in-out`;
  
  return (
    <div
      className={classes}
      onClick={(): void => {
        window.analytics.track(`PROFILE SECTION SELECTOR: ${name} clicked`);
        setSection(name.toLowerCase());
      }}
    >
      {name}
    </div>
  );
}

export default ProfileSectionSelector;
