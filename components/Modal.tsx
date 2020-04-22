import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import styled from '@emotion/styled';

import useOnClickOutside from '../hooks/useOnClickOutside';

import Portal from './Portal';

const ModalBackground = styled.div`
  background: rgba(224,224,224,0.5);
`;

function Modal({
  children,
  open,
  onModalClose,
}: {
  children: React.ReactChild | React.ReactChild[];
  open: boolean;
  onModalClose?: () => void;
}): React.ReactElement {
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (): void => {
    setIsOpen(false);
    if (onModalClose) {
      onModalClose();
    }
  }

  useOnClickOutside(modalRef, handleClose);

  return (
    <>
    {
      isOpen && (
        <Portal selector="body">
          <ModalBackground className="z-50 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center px-5 sm:px-0">
            <div
              className="p-10 bg-white border border-primary rounded-sm relative"
              ref={modalRef}
            >
              <FiX
                className="absolute top-0 right-0 m-1 hover:cursor-pointer hover:text-primary"
                onClick={handleClose}
              />

              {children}
            </div>
          </ModalBackground>
        </Portal>
      )
    }
    </>
  );
}

export default Modal;
