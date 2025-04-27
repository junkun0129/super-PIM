import React, { FocusEventHandler } from "react";
import searchIcon from "../../assets/search.png";
type Props = {
  placeHolder: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};
const AppSearchBar = ({ placeHolder, onBlur }: Props) => {
  return (
    <div className="flex items-center   ">
      <input
        className="border border-slate-500 p-1 outline-none focus:shadow-lg"
        onBlur={onBlur}
        placeholder={placeHolder}
      />
      <div
        style={{
          backgroundImage: `url(${searchIcon})`,
          backgroundSize: "60%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-[34px] h-[34px] bg-slate-500 cursor-pointer focus:shadow-lg"
      ></div>
    </div>
  );
};

export default AppSearchBar;
