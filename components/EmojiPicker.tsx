import { useState, useRef } from 'react';
import emojis from 'emoji-mart/data/apple.json';
import { NimblePicker, BaseEmoji } from 'emoji-mart';

import useOnClickOutside from '../hooks/useOnClickOutside';

function EmojiPicker({
  handleEmojiSelection,
}: {
  handleEmojiSelection: (emoji: BaseEmoji) => void;
}): React.ReactElement {
  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useOnClickOutside(emojiRef, () => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  });

  return (
    <div
      ref={emojiRef}
      className="text-2xl hover:cursor-pointer relative"
    >
      {showEmojiPicker && (
        <NimblePicker
          set="apple"
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          data={emojis}
          style={{ position: 'absolute', bottom: '2.5rem' }}
          color="#004346"
          emoji="point_up"
          title=""
          onSelect={(emoji: BaseEmoji): void => {
            handleEmojiSelection(emoji);
            setShowEmojiPicker(false);
          }}
        />
      )}
      <span
        className="px-1"
        onMouseDown={(e): void => {
          e.preventDefault();
          setShowEmojiPicker(!showEmojiPicker);
        }}
      >
        {showEmojiPicker ? '😀' : '🙂'}
      </span>
    </div>
  );
}

export default EmojiPicker;
