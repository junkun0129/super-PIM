import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";
import AppSideBar from "../AppSideBar/AppSideBar";
import { AppSideBarProps } from "../AppSideBar/type";
import { AppRoutes } from "../../routes";

const AppLayout = () => {
  const [isCollapsed, setisCollapsed] = useState<boolean>(false);
  return (
    <div className="w-full h-[100vh]">
      <AppHeader isCollapesed={isCollapsed} setIsCollapesed={setisCollapsed} />
      <div className="flex" style={{ height: "calc(100vh - 50px)" }}>
        <AppSideBar isCollapsed={isCollapsed} />
        <div
          className="p-4 w-full bg-gray-100"
          style={{ height: "calc(100vh - 50px)" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
