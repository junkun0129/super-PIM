import React, { useEffect, useMemo, useState } from "react";
import { getSeriesImg } from "../../util";
import AppAcordion, {
  AppAcordionProps,
} from "../../components/AppAcordion/AppAcordion";
import { ASSET_TAB_TO_TEXT, ASSET_TABS } from "../../constant";
import asseApis, { Asset } from "../../api_dev/assets.api";
import { useParams } from "react-router-dom";
import AppAsetBox from "../../components/AppAssetBox/AppAsetBox";
type Props = {
  product_cd: string;
};
const AppAssetList = ({ product_cd }: Props) => {
  const { createAssetBox, getAllAssetBoxesApi, getProductAssetsApi } = asseApis;
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
  const [assets, setassets] = useState<Asset[]>([]);
  useEffect(() => {
    updateAssets();
  }, []);

  useEffect(() => {
    updateItems(assets);
  }, [assets]);

  const updateAssets = async () => {
    const res = await getAllAssetBoxesApi();
    if (res.result !== "success") return;
    const { data: boxData } = res;
    const assetRes = await getProductAssetsApi({ product_cd });
    if (assetRes.result !== "success") return;
    const { data: assetData } = assetRes;
    let newAssets: Asset[] = boxData.map((item) => {
      return {
        asset: null,
        box: item,
      };
    });

    newAssets = newAssets.map((asset) => {
      const filtered = assetData.filter(
        (roAsser) => roAsser.no === asset.box.no
      );

      if (filtered.length) {
        return { asset: filtered[0], box: asset.box };
      }
      return asset;
    });

    setassets(newAssets);
  };

  const updateItems = (newAsset: Asset[]) => {
    const newItems = baseItems.map((item) => {
      const assets = newAsset.filter((as) => as.box.type === item.key);
      return {
        ...item,
        children: (
          <div className="flex">
            {assets.map((asset) => (
              <AppAsetBox acordionKey={item.key} asset={asset} />
            ))}
          </div>
        ),
      };
    });
    setitems(newItems);
  };
  return (
    <div>
      <AppAcordion items={items} />
    </div>
  );
};

export default AppAssetList;
