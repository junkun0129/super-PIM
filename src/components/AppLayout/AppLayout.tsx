import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";
import AppSideBar from "../AppSideBar/AppSideBar";
import { AppSideBarProps } from "../AppSideBar/type";
import { AppRoutes } from "../../routes";

const AppLayout = () => {
  return (
    <div className="w-full h-[100vh]">
      <AppHeader />
      <div className="flex h-full">
        <AppSideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
