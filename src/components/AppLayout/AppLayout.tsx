import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";
import AppSideBar from "../AppSideBar/AppSideBar";
import { AppSideBarProps } from "../AppSideBar/type";
import { AppRoutes } from "../../routes";
import { layout } from "../../constant";

const AppLayout = () => {
  return (
    <div className="w-full h-[100vh]">
      <AppHeader />
      <div
        className="flex overflow-hidden"
        style={{ height: `calc(100vh - 50px)` }}
      >
        <AppSideBar />
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
