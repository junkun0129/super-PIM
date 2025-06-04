import React, { useEffect, useState } from "react";
import AppTab from "../../components/AppTab/AppTab";
import { AppTabProps } from "../../components/AppTab/type";
import SeriesListPage from "../SeriesListPage.tsx/SeriesListPage";
import SkuListPage from "../SkuListPage/SkuListPage";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { useSearchParams } from "react-router-dom";
import { queryParamKey } from "../../routes";

const MainPage = () => {
  const [active, setactive] = useState("0");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tabKey = searchParams.get("tab");
    if (!tabKey) return;
    setactive(tabKey);
  }, [searchParams]);

  const data: AppTabProps["data"] = [
    {
      key: "0",
      label: "シリーズ",
      content: <SeriesListPage />,
    },
    {
      key: "1",
      label: "SKU",
      content: <SkuListPage />,
    },
  ];

  const handleTabChange = (e: string) => {
    searchParams.set(queryParamKey.tab, e);

    setSearchParams(searchParams);
  };
  return (
    <div className="w-full">
      <AppTab data={data} activeId={active} onChange={handleTabChange} />
    </div>
  );
};

export default MainPage;
