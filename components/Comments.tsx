import { useState } from 'react';
import styled from '@emotion/styled';
import { Picker } from 'emoji-mart';

import Editor from './Editor';
import Button from './Button';

const EditorContainer = styled.div`
  min-height: 6rem;
`;

function Comments({ comments }: { comments: Comment[] } ): React.ReactElement {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="mt-10">
      COMMENTS

      <div className="border border-gray-300 rounded-sm">
        <EditorContainer className="p-2 border-b border-gray-300">
          <Editor placeholder="What did you think of the article?" small />
        </EditorContainer>

        <div className="flex justify-between p-2 bg-gray-100">
          <div className="text-2xl hover:cursor-pointer relative">
            {showEmojiPicker && (
              <Picker
                style={{ position: 'absolute', bottom: '2.5rem' }}
                color="#004346"
                emoji="point_up"
                title=""
              />
            )}
            <span onClick={(): void => setShowEmojiPicker(!showEmojiPicker)}>
              {showEmojiPicker ? '😀' : '🙂'}
            </span>
          </div>

          <Button>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Comments;
