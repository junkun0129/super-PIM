import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  content: React.ReactNode;
};

const AppPopup: React.FC<Props> = ({ open, onClose, children, content }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      window.addEventListener("mousedown", handleClose);
    } else {
      window.removeEventListener("mousedown", handleClose);
    }
  }, [open]);

  const handleClose = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div>
      {children}
      <div ref={ref} className="relative">
        {open && (
          <div className=" absolute bg-white p-2 rounded ml-2 shadow-lg">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPopup;
