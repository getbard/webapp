type ProfileSectionSelectorProps = {
  photoSelector: string;
  setPhotoSelector: (name: string) => void;
  name: string;
}

export function ProfileSectionSelector({
  photoSelector,
  setPhotoSelector,
  name,
}: ProfileSectionSelectorProps): React.ReactElement {
  const active = photoSelector === name.toLowerCase();
  const classes = `${active && 'border-b-2 border-primary'} ${active && 'text-primary'} text-gray-500 pb-2 inline hover:cursor-pointer hover:text-primary transition duration-150 ease-in-out`;
  
  return (
    <div
      className={classes}
      onClick={(): void => {
        window.analytics.track(`EDITOR HEADER PHOTO SELECTOR TAB: ${name} clicked`);
        setPhotoSelector(name.toLowerCase());
      }}
    >
      {name}
    </div>
  );
}

export default ProfileSectionSelector;
