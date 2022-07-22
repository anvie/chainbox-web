
import { Component, FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children?: any;
  title: string;
}

const Modal: FC<ModalProps> = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <div className="flex items-center content-center justify-center">
          {title && <div className="text-xl font-semibold">{title}</div>}
          <div className="flex-grow"></div>
          <svg
            onClick={handleCloseClick}
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 cursor-pointer text-red-300 hover:text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <StyledModalBody>{children}</StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root") as HTMLElement
    );
  } else {
    return null;
  }
};

const StyledModalBody = styled.div`
  padding-top: 10px;
  z-index: 900;
`;


const StyledModal = styled.div`
  background: white;
  color: #333;
  z-index: 9999;
  width: 500px;
  height: auto;
  border-radius: 15px;
  padding: 15px;
`;
const StyledModalOverlay = styled.div`
  position: fixed;
  z-index: 900;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default Modal;
