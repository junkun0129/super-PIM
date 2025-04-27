import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes";
import { layout } from "../../constant";
type Props = {
  isCollapesed: boolean;
  setIsCollapesed: (isCollapsed: boolean) => void;
};
const AppHeader = ({ isCollapesed, setIsCollapesed }: Props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(AppRoutes.seriesCreatePage);
  };
  const width = isCollapesed ? layout.sidebar.collapsed : layout.sidebar.expand;

  return (
    <div className="w-full h-[50px] bg-slate-600  relative">
      <button
        className={`absolute left-[${width}px] text-white text-lg p-1 px-2 rounded-md hover:bg-slate-700 top-2 h-[70%] `}
        onClick={() => {
          setIsCollapesed(!isCollapesed);
        }}
      >
        {isCollapesed ? ">>" : "<<"}
      </button>
    </div>
  );
};

export default AppHeader;
