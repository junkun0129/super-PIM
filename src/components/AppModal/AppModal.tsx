import React, { ReactNode, useEffect, useState } from "react";
type Props = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};
const AppModal = ({ children, open, onClose }: Props) => {
  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        right: "0",
        bottom: "0",
        left: "0",
        top: "0",
        backgroundColor: "black",
      }}
      className="flex justify-center items-center z-0"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div onClick={(e) => e.stopPropagation()} className=" z-10 bg-white">
        {children}
      </div>
    </div>
  );
};

export default AppModal;
