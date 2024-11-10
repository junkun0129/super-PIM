import React, { useEffect, useState } from "react";
import AppTab from "../../components/AppTab/AppTab";
import PclManagePage from "./PclManagePage";
import CategoryManage from "./CategoryManage";
import AttrManage from "./AttrManage";
import LabelManage from "./LabelManage";
import { useSearchParams } from "react-router-dom";
import { queryParamKey } from "../../routes";

const SettingPage = () => {
  const [activeTab, setactiveTab] = useState("0");
  const [query, setQuery] = useSearchParams();
  useEffect(() => {
    const tabKey = query.get(queryParamKey.tab);
    if (tabKey) {
      setactiveTab(tabKey);
    }
  }, [query]);
  return (
    <div>
      <AppTab
        activeId={activeTab}
        onChange={(e) => {
          setQuery({ [queryParamKey.tab]: e });
        }}
        data={[
          { key: "0", label: "商品分類", content: <PclManagePage /> },
          { key: "1", label: "属性", content: <AttrManage /> },
          { key: "2", label: "カテゴリ", content: <CategoryManage /> },
          { key: "3", label: "ラベル", content: <LabelManage /> },
        ]}
      />
    </div>
  );
};

export default SettingPage;
