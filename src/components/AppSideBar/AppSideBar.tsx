import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes, queryParamKey } from "../../routes";
import mediaApis from "../../api_dev/media.api";
import { getObjectFromRowFormData } from "../../util";
import { MediaTable } from "../../data/medias/medias";
import SeriesListPage from "../../pages/SeriesListPage.tsx/SeriesListPage";
import { layout, master_media_cd } from "../../constant";
import boxImg from "../../assets/box.png";
import exportImg from "../../assets/export.png";
import importImg from "../../assets/import.png";
import settingImg from "../../assets/setting.png";

const AppSideBar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setisCollapsed] = useState(false);
  const baseSidebarItems = [
    {
      key: "4",
      label: "ダッシュボード",
      icon: <img width={25} height={25} src={boxImg} />,
      onClick: () => {
        const url = `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${master_media_cd}&${queryParamKey.tab}=0`;

        navigate(url);
      },
    },
    {
      key: "0",
      label: "商品管理",
      icon: <img width={25} height={25} src={boxImg} />,
      onClick: () => {
        const url = `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${master_media_cd}&${queryParamKey.tab}=0`;

        navigate(url);
      },
    },
    {
      key: "2",
      label: "インポート",
      icon: <img width={25} height={25} src={importImg} />,
      onClick: () => {
        const url = `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${master_media_cd}&${queryParamKey.tab}=0`;

        navigate(url);
      },
    },
    {
      key: "3",
      label: "エクスポート",
      icon: <img width={25} height={25} src={exportImg} />,
      onClick: () => {
        const url = `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${master_media_cd}&${queryParamKey.tab}=0`;

        navigate(url);
      },
    },
    {
      key: "1",
      label: "設定",
      icon: <img width={25} height={25} src={settingImg} />,
      onClick: () => navigate(AppRoutes.settingPage),
    },
    {
      key: "6",
      label: "",
      icon: <div className="text-white">{">>"}</div>,
      onClick: () => setisCollapsed((pre) => !pre),
    },
  ];
  const expand = layout.sidebar.expand.toString();
  const collapsed = layout.sidebar.collapsed.toString();
  const [sidebarItems, setsidebarItems] = useState(baseSidebarItems);
  return (
    <div
      style={{
        height: `calc(100vh - ${layout.header}px)`,
        width: isCollapsed ? `${collapsed}px` : `${expand}px`,
      }}
      className={`bg-slate-600 shadow-2xl flex flex-col`}
    >
      {sidebarItems.map((node) => (
        <button
          className="rounded-sm mb-2 mx-2 py-2 flex pl-2 items-center text-white text-opacity-100 hover:bg-slate-500  hover:text-opacity-100"
          key={node.key}
          onClick={node.onClick}
        >
          <div>{node.icon}</div>
          {!isCollapsed && (
            <div className="text-white ml-2 text-sm">{node.label}</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default AppSideBar;
