import React, { useEffect, useMemo, useRef, useState } from "react";
import { getObjectFromRowFormData, getSeriesImg } from "../../util";
import AppAcordion, {
  AppAcordionProps,
} from "../../components/AppAcordion/AppAcordion";
import { ASSET_EXT_MAP, ASSET_TABS } from "../../constant";

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
const boxSize = 200;
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
    <div className="w-full h-full overflow-auto">
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
    <div className="flex flex-wrap pb-3">
      <AppModal
        open={createModalOpen}
        onClose={() => setcreateModalOpen(false)}
        title={"アセットボックスの作成"}
      >
        <form onSubmit={handleCreateAssetBox} className="mt-8">
          <AppInput type={"text"} name={"asb_name"} label="アセット名" />
          <div className="flex justify-end mt-7">
            <AppButton
              text={"キャンセル"}
              onClick={() => setcreateModalOpen(false)}
              type={"normal"}
              className="mr-2"
            />
            <AppButton
              text={"作成"}
              isForm={true}
              type={"primary"}
              onClick={() => {}}
            />
          </div>
        </form>
      </AppModal>
      <button
        onClick={() => setcreateModalOpen(true)}
        className={`w-[${boxSize}px] h-[${boxSize}px] flex justify-center items-center mt-3 ml-3 text-4xl border border-black hover:shadow-lg`}
      >
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
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadAssetApi({
      body: formData,
      pr_cd,
      type: asset.asb_type,
      im: asset.asb_cd === main_cd ? "1" : "0",
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
        >
          画像のアップロードする
        </AppImageUploader>
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
        // await downloadAssetApi({
        //   body: {
        //     asb_cd: asset.asb_cd,
        //     pr_cd,
        //     ext: "asset" in asset ? asset.asset.ast_ext : "",
        //   },
        // });
        if (!downloadRef.current) return;
        downloadRef.current.href = `${
          import.meta.env.VITE_BASE_URL
        }/assets/download?pr_cd=${pr_cd}&asb_cd=${asset.asb_cd}&ext=${
          asset.asset?.ast_ext
        }`;
        downloadRef.current.download = `${pr_cd}${asset.asset?.ast_ext}`;
        downloadRef.current.click();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`relative w-[${boxSize}px] h-[${boxSize}px] mt-3 ml-3 border border-black hover:shadow-lg`}
    >
      <a ref={downloadRef} style={{ display: "none" }}></a>
      <div className="w-full h-[70%]">
        <AppImageUploader
          onFileSelect={handleUploadFile}
          acceptExtensions={ASSET_EXT_MAP[asset.asb_type]}
          imagePath={`${import.meta.env.VITE_BASE_URL}/${
            asset.asb_cd
          }/${pr_cd}${asset.asset?.ast_ext}`}
        />
      </div>
      <div className="mt-2 ml-2 ">
        <div className="text-sm">名前： {asset.asb_name}</div>

        <div className="text-sm mt-1">
          拡張子：{"asset" in asset ? asset.asset.ast_ext : ""}
        </div>
      </div>
      <AppDropDownList
        className="absolute right-0 top-0"
        onSelect={handleSelect}
        options={options}
      >
        <button
          className="w-[30px] h-[30px] flex justify-center items-center hover:bg-slate-300 z-50"
          onClick={() => setopen(true)}
        >
          ：
        </button>
      </AppDropDownList>
    </div>
  );
};
