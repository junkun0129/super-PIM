import React, { useEffect, useMemo, useState } from "react";
import { getSeriesImg } from "../../util";
import AppAcordion, {
  AppAcordionProps,
} from "../../components/AppAcordion/AppAcordion";
import { ASSET_TAB_TO_TEXT, ASSET_TABS } from "../../constant";

import { useParams } from "react-router-dom";
import AppAsetBox from "../../components/AppAssetBox/AppAsetBox";
type Props = {
  product_cd: string;
};
const AppAssetList = ({ product_cd }: Props) => {
  const baseItems: AppAcordionProps["items"] = [
    {
      key: ASSET_TABS.IMAGE,
      label: ASSET_TAB_TO_TEXT.IMAGE,
      children: <div>画像の子供</div>,
    },
    {
      key: ASSET_TABS.PDF,
      label: ASSET_TAB_TO_TEXT.PDF,
      children: <div>PDFの子供</div>,
    },
    {
      key: ASSET_TABS.VIDEO,
      label: ASSET_TAB_TO_TEXT.VIDEO,
      children: <div>動画の子供</div>,
    },
    {
      key: ASSET_TABS.AUDIO,
      label: ASSET_TAB_TO_TEXT.AUDIO,
      children: <div>音声の子供</div>,
    },
    {
      key: ASSET_TABS.OFFICE,
      label: ASSET_TAB_TO_TEXT.OFFICE,
      children: <div>オフィスの子供</div>,
    },
    {
      key: ASSET_TABS.OTHER,
      label: ASSET_TAB_TO_TEXT.OTHER,
      children: <div>aza-の子供</div>,
    },
  ];

  const [items, setitems] = useState<AppAcordionProps["items"]>(baseItems);
  const [assets, setassets] = useState([]);
  useEffect(() => {
    updateAssets();
  }, []);

  useEffect(() => {
    updateItems();
  }, [assets]);

  const updateAssets = async () => {};

  const updateItems = () => {};
  return (
    <div className=" overflow-auto">
      <AppAcordion items={items} />
    </div>
  );
};

export default AppAssetList;
