import React, { useEffect, useMemo, useState } from "react";
import { getSeriesImg } from "../../util";
import AppAcordion, {
  AppAcordionProps,
} from "../../components/AppAcordion/AppAcordion";
import { ASSET_EXT_MAP, ASSET_TAB_TO_TEXT, ASSET_TABS } from "../../constant";

import { useParams } from "react-router-dom";
import AppAsetBox from "../../components/AppAssetBox/AppAsetBox";
import { getProductAssetsApi, ProductAsset } from "../../api/asset.api";
import AppImageUploader from "../AppImageUploader/AppImageUploader";
import AppDropDownList from "../AppDropDownList/AppDropDownList";
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
      children: <div></div>,
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

type ProductAssetAccordionNodeProps = {
  pr_cd: string;
  type: string;
  isMounted: boolean;
  onFirstMounted: (assets: ProductAsset[]) => void;
  assets: ProductAsset[];
  main_cd: string;
};

const ProductAssetAccordionNode = ({
  isMounted,
  onFirstMounted,
  pr_cd,
  type,
  assets,
  main_cd,
}: ProductAssetAccordionNodeProps) => {
  useEffect(() => {
    if (isMounted) return;
    getAssets(pr_cd, type);
  }, []);

  const getAssets = async (pr_cd: string, type: string) => {
    const res = await getProductAssetsApi({ type, pr_cd });
    if (res.result !== "success") return;

    let populatedAssets = res.data.assetboxes.map((item) => {
      if (item.asb_cd in res.data.assets) {
        return { ...item, asset: res.data.assets[item.asb_cd] };
      }
      return item;
    });

    onFirstMounted(populatedAssets);
  };
  return (
    <div>
      <div>＋</div>
      {assets.map((item) => {
        return (
          <ProductAssetNode asset={item} pr_cd={pr_cd} main_cd={main_cd} />
        );
      })}
    </div>
  );
};

type ProductAssetNodeProps = {
  asset: ProductAsset;
  pr_cd: string;
  main_cd: string;
};
const ProductAssetNode = ({ asset, pr_cd, main_cd }: ProductAssetNodeProps) => {
  const options = [
    ...(asset.asb_cd === main_cd
      ? [{ cd: "kd", label: "メイン画像を削除" }]
      : []),
    { cd: "s", label: "アセットボックスの削除" },
    ...(["asset"] in asset ? [{ cd: "diek", label: "画像の削除" }] : []),
    { cd: "ss", label: "画像のアップロード" },
    ...(["asset"] in asset
      ? [{ cd: "ddk", label: "アセットのダウンロード" }]
      : []),
  ];
  return (
    <div className="relative">
      <AppDropDownList options={options}>
        <button className="absolute">∴</button>
      </AppDropDownList>
      <AppImageUploader
        onFileSelect={function (file: File): void {
          throw new Error("Function not implemented.");
        }}
        acceptExtensions={ASSET_EXT_MAP[asset.asb_type]}
        imagePath={`${import.meta.env.VITE_BASE_URL}/${asset.asb_cd}/${pr_cd}${
          asset.asset?.ast_ext
        }`}
      />
      <div>{asset.asb_name}</div>
    </div>
  );
};
