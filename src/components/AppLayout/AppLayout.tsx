import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";
import AppSideBar from "../AppSideBar/AppSideBar";
import { AppSideBarProps } from "../AppSideBar/type";
import { AppRoutes } from "../../routes";

const appSideBarProps: AppSideBarProps = [
  { label: "商品管理", url: AppRoutes.serisListPage },
  { label: "商品商品", url: "app/sku" },
  { label: "商品分類", url: AppRoutes.pclMainPage },
  { label: "設定", url: AppRoutes.settingPage },
];
const AppLayout = () => {
  return (
    <div className="w-full h-[100vh]">
      <AppHeader />
      <div className="flex h-full">
        <AppSideBar props={appSideBarProps} />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
