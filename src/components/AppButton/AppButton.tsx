import React, { ReactNode } from "react";
type AppButtonProps = {
  text: ReactNode;
  onClick: () => void;
  type: "normal" | "primary";
  isForm?: boolean;
  className?: string;
  disabled?: boolean;
  badgeNum?: number;
};
const AppButton = ({
  text,
  onClick,
  type,
  isForm = false,
  className: classNameProps,
  disabled = false,
  badgeNum = 0,
}: AppButtonProps) => {
  let className =
    "relative px-2 py-1 text-sm rounded-sm border h-[40px] border-slate-500 hover:-translate-y-[2px] active:translate-y-0 hover:shadow-md ";

  if (classNameProps) {
    className += classNameProps;
  }

  if (type === "normal") {
    className +=
      " text-slate-500 hover:text-slate-400 hover:border-slate-400 bg-white";
  } else if (type === "primary") {
    className += " bg-slate-500 text-white hover:bg-slate-400";
  }
  return (
    <button
      disabled={disabled}
      className={!disabled ? className : className + " bg-slate-300"}
      onClick={onClick}
      type={isForm ? "submit" : "button"}
    >
      {text}
      {badgeNum > 0 && (
        <div className="bg-red-600 text-sm absolute w-[25px] h-[25px] flex items-center justify-center text-white rounded-full -top-3 -right-2">
          {badgeNum}
        </div>
      )}
    </button>
  );
};

export default AppButton;
