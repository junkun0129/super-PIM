import React, { FocusEventHandler, useState } from "react";
import searchIcon from "../../assets/search.png";
type Props = {
  placeHolder: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSearchClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string
  ) => void;
};
const AppSearchBar = ({ placeHolder, onBlur, onSearchClick }: Props) => {
  const [input, setinput] = useState("");
  return (
    <div className="flex items-center   ">
      <input
        className="border border-slate-500 p-1 outline-none focus:shadow-lg"
        onBlur={onBlur}
        onChange={(e) => setinput(e.target.value)}
        value={input}
        placeholder={placeHolder}
      />
      <button
        onClick={(e) => onSearchClick(e, input)}
        style={{
          backgroundImage: `url(${searchIcon})`,
          backgroundSize: "60%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-[34px] h-[34px] bg-slate-500 cursor-pointer focus:shadow-lg"
      ></button>
    </div>
  );
};

export default AppSearchBar;
