import React, { useState } from "react";
import AppButton from "../../components/AppButton/AppButton";
import AppModal from "../../components/AppModal/AppModal";

import AppSearchBar from "../../components/AppSearchBar/AppSearchBar";
import CategoryCascaderButton from "./CategoryCascaderButton";
import ProductCreateModal from "./ProductCreateModal";
import AttrFilterButton from "./AttrFilterButton";
import { AttrFilter } from "../../api/product.api";
import ProductDeleteModal from "./ProductDeleteModal";
type AppTableHeaderProps = {
  updateList: () => void;
  selectedCategoryKeys: string[];
  keyword: string;
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  selectedFilters: AttrFilter[];
  setSelectedFilters: (filters: AttrFilter[]) => void;
  setSelectedCategoryKeys: (keys: string[]) => void;
  setKeyword: (e: string) => void;
  isSeries?: boolean;
  selectedCd?: string;
};

// 以上、以下、より大きい、よりちいさい、等しい、等しくない、を含む、を含まない
const AppTableHeader = ({
  updateList,
  keyword,
  setKeyword,
  selectedCategoryKeys,
  setSelectedCategoryKeys,
  selectedFilters,
  setSelectedFilters,
  isSeries = false,
  selectedCd,
  selectedKeys,
  setSelectedKeys,
}: AppTableHeaderProps) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-[50px] rounded-sm my-2 mb-6 bg-white shadow-md flex items-center p-3 justify-between">
      <div className="flex items-center">
        <AppSearchBar
          onSearchClick={(e) => setKeyword(e.target.value)}
          placeHolder="キーワード検索"
        />
        <AttrFilterButton
          selectedPclCd={""}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
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
          onClick={() => setisDeleteModalOpen(true)}
          disabled={!selectedKeys.length}
        />
      </div>
      <AppButton
        text="＋新シリーズ作成"
        type="primary"
        onClick={() => setisModalOpen(true)}
      />
      <ProductCreateModal
        open={isModalOpen}
        isSeries={isSeries}
        onClose={() => setisModalOpen(false)}
        updateList={updateList}
      />
      <ProductDeleteModal
        open={isDeleteModalOpen}
        updateList={() => {
          setSelectedKeys([]);
        }}
        onClose={() => setisDeleteModalOpen(false)}
        selectedKeys={selectedKeys}
      />
    </div>
  );
};

export default AppTableHeader;
