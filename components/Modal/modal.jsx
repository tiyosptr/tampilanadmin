"use client"
import React from "react";

const Modal = ({ show, onClose, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <div className="modal-main">
        <div className="modal-header">
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
