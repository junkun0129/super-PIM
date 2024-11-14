import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes, queryParamKey } from "../../routes";
import mediaApis from "../../api_dev/media.api";
import { getObjectFromRowFormData } from "../../util";
import { MediaTable } from "../../data/medias/medias";
import SeriesListPage from "../../pages/SeriesListPage.tsx/SeriesListPage";

const AppSideBar = () => {
  const navigate = useNavigate();
  const [isshowCreateInput, setisshowCreateInput] = useState(false);
  const [sidebarItems, setsidebarItems] = useState([]);
  const [mediaList, setmediaList] = useState<MediaTable[]>([]);

  const { createMediaApi, getAllMediaApi } = mediaApis;

  const baseSidebarItems = [
    {
      key: "0",
      label: "商品管理",
      onClick: () => navigate(AppRoutes.serisListPage),
    },
    {
      key: "1",
      label: "設定",
      onClick: () => navigate(AppRoutes.settingPage),
    },
  ];

  const addItem = {
    key: "2",
    label: "＋",
    onClick: () => setisshowCreateInput(true),
  };

  useEffect(() => {
    // 初回マウント時にメディアリストを取得
    updateMediaList();
  }, []);

  const updateMediaList = async () => {
    try {
      const res = await getAllMediaApi();

      if (res.result === "success") {
        setmediaList(res.data);
        // mediaListが更新されたタイミングでsidebarItemsも更新
        const newMediaItems = res.data.map((item) => ({
          key: "media-" + item.cd,
          label: item.name,
          onClick: () => {
            navigate(
              `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${item.cd}&${queryParamKey.tab}=0`
            );
          },
        }));
        setsidebarItems([...baseSidebarItems, ...newMediaItems, addItem]);
      } else {
        console.error("Failed to fetch media list");
      }
    } catch (error) {
      console.error("Error fetching media list:", error);
    }
  };

  const MediaCreateInput = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const values = getObjectFromRowFormData(e);
      try {
        const res = await createMediaApi({
          body: { name: values["media"] as string },
        });
        if (res.result === "success") {
          setisshowCreateInput(false);

          updateMediaList();
        } else {
          console.error("Failed to create media");
        }
      } catch (error) {
        console.error("Error creating media:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex">
        <input autoFocus name="media" placeholder="Media Name" />
        <button type="submit">決定</button>
      </form>
    );
  };

  return (
    <div className="h-full bg-blue-50">
      {sidebarItems.map((node) => (
        <div key={node.key} onClick={node.onClick}>
          {node.label}
        </div>
      ))}
      {isshowCreateInput && <MediaCreateInput />}
    </div>
  );
};

export default AppSideBar;
