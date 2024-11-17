import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes, queryParamKey } from "../../routes";
import mediaApis from "../../api_dev/media.api";
import { getObjectFromRowFormData } from "../../util";
import { MediaTable } from "../../data/medias/medias";
import SeriesListPage from "../../pages/SeriesListPage.tsx/SeriesListPage";
import { master_media_cd } from "../../constant";

const AppSideBar = () => {
  const navigate = useNavigate();

  const baseSidebarItems = [
    {
      key: "0",
      label: "商品管理",
      onClick: () => {
        const url = `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${master_media_cd}&${queryParamKey.tab}=0`;

        navigate(url);
      },
    },
    {
      key: "1",
      label: "設定",
      onClick: () => navigate(AppRoutes.settingPage),
    },
  ];

  const [sidebarItems, setsidebarItems] = useState(baseSidebarItems);
  return (
    <div className="h-full w-[150px] bg-green-50 shadow-2xl flex flex-col justify-between">
      {sidebarItems.map((node) => (
        <button
          className=" rounded-md bg-white mx-2 py-2  hover:shadow-xl hover:transition-transform duration-300 "
          key={node.key}
          onClick={node.onClick}
        >
          {node.label}
        </button>
      ))}
    </div>
  );
};

export default AppSideBar;
