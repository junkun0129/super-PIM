import React, { useEffect, useMemo, useState } from "react";
import { getObjectFromRowFormData, getSeriesImg } from "../../util";
import AppAcordion, {
  AppAcordionProps,
} from "../../components/AppAcordion/AppAcordion";
import { ASSET_EXT_MAP, ASSET_TAB_TO_TEXT, ASSET_TABS } from "../../constant";

import { useParams } from "react-router-dom";
import AppAsetBox from "../../components/AppAssetBox/AppAsetBox";
import {
  CreateAssetBoxApi,
  deleteAssetApi,
  deleteAssetBoxApi,
  downloadAssetApi,
  GetMainAssetBoxKeyApi,
  getProductAssetsApi,
  ProductAsset,
  setMainAssetBoxApi,
  uploadAssetApi,
} from "../../api/asset.api";
import AppImageUploader from "../AppImageUploader/AppImageUploader";
import AppDropDownList from "../AppDropDownList/AppDropDownList";
import AppModal from "../AppModal/AppModal";
import AppInput from "../AppInput/AppInput";
import AppButton from "../AppButton/AppButton";
import { useMessageContext } from "../../providers/MessageContextProvider";
type Props = {
  pr_cd: string;
};
const AppAssetList = ({ pr_cd }: Props) => {
  const [tabs, settabs] = useState({
    [ASSET_TABS.IMAGE]: {
      ismounted: false,
      assets: [],
    },
    [ASSET_TABS.VIDEO]: {
      ismounted: false,
      assets: [],
    },
    [ASSET_TABS.PDF]: {
      ismounted: false,
      assets: [],
    },
    [ASSET_TABS.OFFICE]: {
      ismounted: false,
      assets: [],
    },
    [ASSET_TABS.AUDIO]: {
      ismounted: false,
      assets: [],
    },
    [ASSET_TABS.OTHER]: {
      ismounted: false,
      assets: [],
    },
  });
  const [mainCd, setmainCd] = useState("");
  const items: AppAcordionProps["items"] = useMemo(() => {
    return Object.entries(ASSET_TABS).map(([typeName, tabCd]) => ({
      key: tabCd,
      label: typeName,
      children: (
        <ProductAssetAccordionNode
          pr_cd={pr_cd}
          type={tabCd}
          isMounted={tabs[tabCd].ismounted}
          onFirstMounted={(newAssets: ProductAsset[]) => {
            let newTabs = structuredClone(tabs);
            newTabs[tabCd].assets = newAssets;
            newTabs[tabCd].ismounted = true;
            settabs(newTabs);
          }}
          assets={tabs[tabCd].assets}
          main_cd={mainCd}
        />
      ),
    }));
  }, [tabs, mainCd]);
  useEffect(() => {
    getMainAssetCd();
  }, []);
  const getMainAssetCd = async () => {
    const res = await GetMainAssetBoxKeyApi();
    if (res.result !== "success") return;
    setmainCd(res.data);
  };
  return (
    <div className=" overflow-auto">
      <AppAcordion items={items} />
    </div>
  );
};

export default AppAssetList;

//各アコードディオンの中のノード
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
  const [createModalOpen, setcreateModalOpen] = useState(false);
  const context = useMessageContext();
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

  const handleCreateAssetBox = async (e: React.FormEvent<HTMLFormElement>) => {
    const formValueObject = getObjectFromRowFormData(e);
    if (!("asb_name" in formValueObject)) return;
    const asb_name = formValueObject["asb_name"] as string;
    const res = await CreateAssetBoxApi({
      body: {
        asb_name,
        asb_type: type,
      },
    });
    setcreateModalOpen(false);
    getAssets(pr_cd, type);
    context.setMessage(res.message);
  };

  return (
    <div className="flex">
      <AppModal
        open={createModalOpen}
        onClose={() => setcreateModalOpen(false)}
        title={"アセットボックスの作成"}
      >
        <form onSubmit={handleCreateAssetBox}>
          <AppInput type={"text"} name={"asb_name"} label="アセット名" />
          <AppButton
            text={"キャンセル"}
            onClick={() => setcreateModalOpen(false)}
            type={"normal"}
          />
          <AppButton
            text={"作成"}
            isForm={true}
            type={"primary"}
            onClick={() => {}}
          />
        </form>
      </AppModal>
      <button className="w-[70px] h-[150px] flex justify-center items-center">
        ＋
      </button>
      {assets.map((item) => {
        return (
          <ProductAssetNode asset={item} pr_cd={pr_cd} main_cd={main_cd} />
        );
      })}
    </div>
  );
};

//各アセットボックス
type ProductAssetNodeProps = {
  asset: ProductAsset;
  pr_cd: string;
  main_cd: string;
};

const ASSET_ACTION_OPTION = {
  SET_MAIN: "0",
  DELETE_ASSET_BOX: "1",
  DELETE_ASSET: "2",
  UPLOAD_ASSET: "3",
  DOWNLOAD_ASSET: "4",
};
const ProductAssetNode = ({ asset, pr_cd, main_cd }: ProductAssetNodeProps) => {
  const [open, setopen] = useState(false);
  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadAssetApi({
      body: formData,
      pr_cd,
      type: asset.asb_type,
      im: "0",
    });
  };
  const options = [
    //アセットボックスをメイン画像に設定する（メイン画像ではないときのみ）
    ...(asset.asb_cd !== main_cd
      ? [{ cd: ASSET_ACTION_OPTION.SET_MAIN, label: "メイン画像の設定" }]
      : []),
    //アセットボックスを削除する
    {
      cd: ASSET_ACTION_OPTION.DELETE_ASSET_BOX,
      label: "アセットボックスの削除",
    },
    //画像を削除する（画像があるときのみ）
    ...("asset" in asset
      ? [{ cd: ASSET_ACTION_OPTION.DELETE_ASSET, label: "画像の削除" }]
      : []),
    //画像をアップロードする
    {
      cd: ASSET_ACTION_OPTION.UPLOAD_ASSET,
      label: (
        <AppImageUploader
          onFileSelect={handleUploadFile}
          acceptExtensions={ASSET_EXT_MAP[asset.asb_type]}
          imagePath={`${import.meta.env.VITE_BASE_URL}/${
            asset.asb_cd
          }/${pr_cd}${asset.asset?.ast_ext}`}
        />
      ),
    },
    //アセットをダウンロードする（画像があるときのみ）
    ...("asset" in asset
      ? [
          {
            cd: ASSET_ACTION_OPTION.DOWNLOAD_ASSET,
            label: "アセットのダウンロード",
          },
        ]
      : []),
  ];
  const handleSelect = async (actionKey: string) => {
    switch (actionKey) {
      case ASSET_ACTION_OPTION.SET_MAIN:
        await setMainAssetBoxApi({
          body: {
            asb_cd: asset.asb_cd,
          },
        });

        break;
      case ASSET_ACTION_OPTION.DELETE_ASSET_BOX:
        await deleteAssetBoxApi({
          body: {
            asb_cd: asset.asb_cd,
          },
        });
        break;
      case ASSET_ACTION_OPTION.DELETE_ASSET:
        await deleteAssetApi({
          body: {
            asb_cd: asset.asb_cd,
            pr_cd,
          },
        });
        break;
      case ASSET_ACTION_OPTION.DOWNLOAD_ASSET:
        await downloadAssetApi({
          body: {
            asb_cd: asset.asb_cd,
            pr_cd,
            ext: "asset" in asset ? asset.asset.ast_ext : "",
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-[70px] h-[150px] ">
      <AppDropDownList
        onSelect={handleSelect}
        options={options}
        open={open}
        onClose={() => setopen(false)}
      >
        <button
          onClick={() => setopen(true)}
          className="absolute right-0 top-0"
        >
          ∴
        </button>
      </AppDropDownList>
      <AppImageUploader
        onFileSelect={handleUploadFile}
        acceptExtensions={ASSET_EXT_MAP[asset.asb_type]}
        imagePath={`${import.meta.env.VITE_BASE_URL}/${asset.asb_cd}/${pr_cd}${
          asset.asset?.ast_ext
        }`}
      />
      <div>{asset.asb_name}</div>
    </div>
  );
};
