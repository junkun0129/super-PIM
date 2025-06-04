import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes";
import { layout } from "../../constant";
import logo from "../../assets/superpimlogo.png";
import text from "../../assets/superpimtext.png";
import AppButton from "../AppButton/AppButton";
type Props={
  isCollapsed:boolean
}
const AppHeader = ({ isCollapsed }:Props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(AppRoutes.seriesCreatePage);
  };

  return (
    <div className="w-full h-[50px] bg-slate-600  relative flex justify-end">
      <div className="absolute flex left-4 top-[20%] items-center">
        <img src={logo} width={30} height={30} />
        {!isCollapsed&&
        <div className="font-bold text-white text-lg ml-2">SUPERPIM</div>}
      </div>
      <div className="text-white">
        <div>
          <AppButton
            text={""}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            type={"normal"}
          />
          <AppButton
            text={""}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            type={"normal"}
          />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
