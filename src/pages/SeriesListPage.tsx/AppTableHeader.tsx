import React, { useState } from "react";
import AppButton from "../../components/AppButton/AppButton";
import AppModal from "../../components/AppModal/AppModal";
import SeriesCreateModal from "./SeriesCreateModal";
import AppSearchBar from "../../components/AppSearchBar/AppSearchBar";
import CategoryCascaderButton from "./CategoryCascaderButton";
type AppTableHeaderProps = {
  updateList: () => void;
  selectedCategoryKeys: string[];
  keyword: string;
  setSelectedCategoryKeys: (keys: string[]) => void;
  setKeyword: (e: string) => void;
};
const AppTableHeader = ({
  updateList,
  keyword,
  selectedCategoryKeys,
  setSelectedCategoryKeys,
  setKeyword,
}: AppTableHeaderProps) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-[50px] rounded-sm my-2 mb-6 bg-white shadow-md flex items-center p-3 justify-between">
      <div className="flex items-center">
        <AppSearchBar
          onBlur={(e) => setKeyword(e.target.value)}
          placeHolder="キーワード検索"
        />
        <AppButton
          text="属性フィルター"
          type="normal"
          className="mx-2"
          onClick={() => console.log("object")}
        />
        <CategoryCascaderButton
          selectedKeys={selectedCategoryKeys}
          setSelectedKeys={setSelectedCategoryKeys}
        />
      </div>

      <div className="flex items-center">
        <AppButton
          text="削除"
          type="normal"
          onClick={() => console.log("object")}
        />
        <AppButton
          text="ステータス変更"
          type="normal"
          onClick={() => console.log("object")}
        />
      </div>

      <AppButton
        text="＋新シリーズ作成"
        type="primary"
        onClick={() => setisModalOpen(true)}
      />
      <SeriesCreateModal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        updateList={updateList}
      />
    </div>
  );
};

export default AppTableHeader;
