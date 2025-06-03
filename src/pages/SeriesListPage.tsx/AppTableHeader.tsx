import React, { useState } from "react";
import AppButton from "../../components/AppButton/AppButton";
import AppModal from "../../components/AppModal/AppModal";

import AppSearchBar from "../../components/AppSearchBar/AppSearchBar";
import CategoryCascaderButton from "./CategoryCascaderButton";
import ProductCreateModal from "./ProductCreateModal";
import AttrFilterButton from "./AttrFilterButton";
type AppTableHeaderProps = {
  updateList: () => void;
  selectedCategoryKeys: string[];
  keyword: string;
  setSelectedCategoryKeys: (keys: string[]) => void;
  setKeyword: (e: string) => void;
  isSeries?: boolean;
  selectedCd?: string;
};

// 以上、以下、より大きい、よりちいさい、等しい、等しくない、を含む、を含まない
const AppTableHeader = ({
  updateList,
  keyword,
  selectedCategoryKeys,
  setSelectedCategoryKeys,
  setKeyword,
  isSeries = false,
  selectedCd,
}: AppTableHeaderProps) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-[50px] rounded-sm my-2 mb-6 bg-white shadow-md flex items-center p-3 justify-between">
      <div className="flex items-center">
        <AppSearchBar
          onSearchClick={(e) => setKeyword(e.target.value)}
          placeHolder="キーワード検索"
        />
        <AttrFilterButton selectedPclCd={""} />
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
      </div>

      <AppButton
        text="＋新シリーズ作成"
        type="primary"
        onClick={() => setisModalOpen(true)}
      />
      <ProductCreateModal
        open={isModalOpen}
        isSeries={true}
        onClose={() => setisModalOpen(false)}
        updateList={updateList}
      />
    </div>
  );
};

export default AppTableHeader;
