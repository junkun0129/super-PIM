import React from "react";
import { useNavigate } from "react-router-dom";
import { AppSideBarProps } from "./type";

const AppSideBar = ({ props }: { props: AppSideBarProps }) => {
  const navigate = useNavigate();
  const handleClick = (url: string) => {
    navigate(url);
  };
  return (
    <div className="h-full bg-blue-50">
      {props.map((node, i) => {
        return (
          <div key={i} onClick={() => handleClick(node.url)}>
            {node.label}
          </div>
        );
      })}
    </div>
  );
};

export default AppSideBar;
