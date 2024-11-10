import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes";

const AppHeader = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(AppRoutes.seriesCreatePage);
  };
  return (
    <div className="w-full bg-green-50">
      <button onClick={handleClick}>series作成</button>
    </div>
  );
};

export default AppHeader;
