import React from "react";
import searchIcon from "../../assets/search.png";

const AppSearchBar = () => {
  return (
    <div className="flex items-center">
      <input
        className="border border-slate-500 p-1 outline-none  focus:border-slate-500"
        placeholder="Search..."
      />
      <div
        style={{
          backgroundImage: `url(${searchIcon})`,
          backgroundSize: "60%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-[34px] h-[34px] bg-slate-500 cursor-pointer"
      ></div>
    </div>
  );
};

export default AppSearchBar;
