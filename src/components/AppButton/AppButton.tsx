import React, { ReactNode } from "react";
type AppButtonProps = {
  text: ReactNode;
  onClick: () => void;
  type: "normal" | "primary";
  isForm?: boolean;
};
const AppButton = ({ text, onClick, type, isForm = false }: AppButtonProps) => {
  let className =
    "px-2 py-1 text-sm rounded-sm border border-slate-500 hover:-translate-y-[2px] active:translate-y-0 hover:shadow-md";

  if (type === "normal") {
    className +=
      " text-slate-500 hover:text-slate-400 hover:border-slate-400 bg-white";
  } else if (type === "primary") {
    className += " bg-slate-500 text-white hover:bg-slate-400";
  }
  return (
    <button
      className={className}
      onClick={onClick}
      type={isForm ? "submit" : "button"}
    >
      {text}
    </button>
  );
};

export default AppButton;
