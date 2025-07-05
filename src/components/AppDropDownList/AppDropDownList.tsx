import React, { ReactNode, useEffect, useRef, useState } from "react";
export type AppDropDownListProps = {
  children: ReactNode;
  open?: boolean;
  onSelect?: (e: string) => void;
  options?: { cd: string; label: ReactNode }[];
  onClose?: () => void;
  className?: string;
};
const AppDropDownList = ({
  children,
  open: openProps,
  onSelect,
  options,
  onClose,
  className,
}: AppDropDownListProps) => {
  const ref = useRef(null);
  const [open, setopen] = useState(openProps ?? false);

  useEffect(() => {
    if (!openProps) return;
    setopen(openProps);
  }, [openProps]);

  const handleClose = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      if (!openProps) {
        setopen(false);
      }
      onClose();
    }
  };
  useEffect(() => {
    if (open) {
      window.addEventListener("mousedown", handleClose);
    } else {
      window.removeEventListener("mousedown", handleClose);
    }
  }, [open]);

  // Clone the child to inject the onClick handler
  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const existingOnClick = child.props.onClick;
      return React.cloneElement(child, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          handleChildClick();
          if (existingOnClick) {
            existingOnClick(e);
          }
        },
      } as any);
    }
    return child;
  });

  const handleChildClick = () => {
    if (!openProps) {
      setopen(true);
    }
  };
  return (
    <div className={"" + className}>
      {clonedChildren}
      {open && (
        <div
          ref={ref}
          className="absolute border z-50  bg-white shadow-md flex flex-col"
        >
          {options.map((option, i) => (
            <button
              className="p-3 hover:bg-slate-100 flex"
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(option.cd);
                if (!openProps) {
                  setopen(false);
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppDropDownList;
