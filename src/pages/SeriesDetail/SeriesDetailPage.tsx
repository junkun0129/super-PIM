import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppTabProps } from "../../components/AppTab/type";
import AppTab from "../../components/AppTab/AppTab";
import seriesApis from "../../api_dev/series.api";
import categoryApis from "../../api_dev/category.api";
import { CategoryNode } from "../../data/categories/type";
import AppCategoryCascader, {
  findCategoryPath,
} from "../../components/AppCategoryCascader/AppCategoryCascader";
import { getObjectFromRowFormData } from "../../util";
import { useMessageContext } from "../../providers/MessageContextProvider";
import SkuListPage from "../SkuListPage/SkuListPage";
import AppAttrList from "../../components/AppAttrList/AppAttrList";
import AppAssetList from "../../components/AppAssetList/AppAssetList";
import { AppRoutes, queryParamKey } from "../../routes";
import AppButton from "../../components/AppButton/AppButton";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import pclApis from "../../api_dev/pcl.api";
import attrApis from "../../api_dev/attrs.api";
import productApis from "../../api_dev/product.api";
import {
  getProductDetailApi,
  ProductAttr,
  ProductDetail,
  updateProductCategoryApi,
  updateProductNameDescApi,
  updateProductPclApi,
} from "../../api/product.api";
import { CategoryTree, getCategoryListApi } from "../../api/category.api";
import { GetPclEntriesApi } from "../../api/pcl.api";
import AppImageUploader from "../../components/AppImageUploader/AppImageUploader";
import { uploadAssetApi } from "../../api/asset.api";
import { ASSET_TABS, layout } from "../../constant";
const initialSeries = {
  pr_cd: "",
  pcl: {
    pcl_name: "",
  },
  pr_name: "",
  pr_hinban: "",
  pr_is_discontinued: "",
  pr_acpt_status: "",
  pr_labels: "",
  pr_created_at: "",
  pr_updated_at: "",
  pr_is_series: "",
  pr_description: "",
  pcl_cd: "",
  categories: [
    {
      ctg_cd: "",
    },
  ],
};
const SeriesDetailPage = () => {
  const [isCategoryOpen, setisCategoryOpen] = useState(false);

  const { setMessage } = useMessageContext();
  const [series, setseries] = useState<ProductDetail>(initialSeries);
  const [attrList, setattrList] = useState<ProductAttr[]>([]);

  let { series_cd } = useParams();
  const navigate = useNavigate();
  const [categorylist, setcategorylist] = useState<CategoryTree[]>([]);
  const [selectedCategoryKeys, setselectedCategoryKeys] = useState<string[]>(
    []
  );
  const [categoryDisplay, setcategoryDisplay] = useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTabKey, setactiveTabKey] = useState("0");
  const [dropDownOptions, setdropDownOptions] = useState<
    {
      cd: string;
      label: string;
    }[]
  >([]);
  const [imgFile, setimgFile] = useState<File | null>(null);
  const [dropdownOpen, setdropdownOpen] = useState(false);

  const [imgUrl, setimgUrl] = useState<string>("");
  useEffect(() => {
    getSeries();
    return () => {
      setcategorylist([]);
      setselectedCategoryKeys([]);
      setdropDownOptions([]);
      setseries(initialSeries);
      setattrList([]);
      setimgUrl("");
    };
  }, []);

  useEffect(() => {
    const tabKey = searchParams.get(queryParamKey.tab);
    if (!tabKey) return;
    setactiveTabKey(tabKey);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedCategoryKeys.length || !categorylist.length) return;

    let newCategoryDisplay = "";

    const getName = (keys: string[], tree: CategoryTree[]) => {
      const [targetKey, ...restKeys] = keys;
      const targetNode = tree.find((item) => item.ctg_cd === targetKey);

      if (!targetNode) return; // 安全ガード

      newCategoryDisplay += targetNode.ctg_name;

      if (restKeys.length > 0) {
        newCategoryDisplay += " > ";
        getName(restKeys, targetNode.children || []);
      }
    };

    getName([...selectedCategoryKeys], categorylist); // コピー渡す
    console.log(newCategoryDisplay);
    setcategoryDisplay(newCategoryDisplay);
  }, [selectedCategoryKeys, categorylist]);

  const getSeries = async () => {
    const res = await getProductDetailApi({ pr_cd: series_cd });
    if (res.result !== "success") return;

    if (res.data.asset) {
      setimgUrl(res.data.asset.ast_img);
    }
    setseries(res.data.product);
    setattrList(res.data.attrvalues);
  };

  const tabdata: AppTabProps = useMemo(() => {
    return {
      data: [
        { key: "0", label: "SKU", content: <SkuListPage /> },
        {
          key: "1",
          label: "項目",
          content: <AppAttrList updateDetail={getSeries} attrList={attrList} />,
        },
        {
          key: "2",
          label: "アセット",
          content: series && <AppAssetList product_cd={series_cd} />,
        },
      ],
    };
  }, [series]);

  const handleBackClick = () => {
    const media_cd = searchParams.get(queryParamKey.mediaSelected);
    const url = `${AppRoutes.serisListPage}?${queryParamKey.mediaSelected}=${media_cd}`;
    navigate(url);
  };

  const handleTabKey = (e: string) => {
    searchParams.set(queryParamKey.tab, e);
    setSearchParams(searchParams);
  };

  const handleCategorybuttonClick = async () => {
    const res = await getCategoryListApi();
    if (res.result !== "success") return;

    const newList = res.data;
    setcategorylist(res.data);

    setisCategoryOpen(true);
    if (!series.categories.length) return;
    const keys = findCategoryPath(newList, series.categories[0].ctg_cd);
    setselectedCategoryKeys(keys);
  };

  const handleSubmit = async () => {
    const { pr_cd, pcl_cd, pr_description, pr_name } = series;
    const ctg_cd = selectedCategoryKeys.length
      ? selectedCategoryKeys[selectedCategoryKeys.length - 1]
      : "";
    const updateNameDescPromise = updateProductNameDescApi({
      body: {
        pr_cd,
        pr_name,
        pr_description,
      },
    });
    const updatePclPromise = updateProductPclApi({
      body: {
        pr_cd,
        pcl_cd,
      },
    });
    const updateCategoryPromise = updateProductCategoryApi({
      body: {
        pr_cd,
        ctg_cd,
      },
    });

    let promises = [
      updateNameDescPromise,
      updatePclPromise,
      updateCategoryPromise,
    ];

    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile);
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const assetPromise = uploadAssetApi({
        body: formData,
        pr_cd: series_cd,
        type: ASSET_TABS.IMAGE,
        im: "1",
      });
      promises.push(assetPromise);
    }

    const reses = await Promise.all(promises);

    let newMessages: string[] = [];
    reses.map((item) => {
      newMessages.push(
        `${item.result === "success" ? "成功" : "失敗"}：${item.message}`
      );
    });
    setMessage(newMessages);
    getSeries();
  };

  const handleClick = async () => {
    const res = await GetPclEntriesApi();
    if (res.result !== "success") return;
    setdropDownOptions(
      res.data.map((item) => ({
        cd: item.pcl_cd,
        label: item.pcl_name,
      }))
    );
    setdropdownOpen(true);
  };

  const handleChangePcl = async (cd: string) => {
    const newPcl = dropDownOptions.find((item) => item.cd === cd);
    setseries((pre) => ({
      ...pre,
      pr_cd: newPcl.cd,
      pcl: { pcl_name: newPcl.label },
    }));
    setdropdownOpen(false);
  };

  const handleImgUpload = (file: File) => {
    setimgFile(file);
  };

  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: `calc(100vh - ${layout.header}px)` }}
    >
      {/* 左側部分 */}
      <div className="flex h-[90%]">
        <div className="rounded-md bg-white shadow-md flex flex-col">
          <div className="relative  h- flex flex-col px-6 overflow-y-auto overflow-x-hidden">
            <div className="w-full h-full flex flex-col py-3">
              {/* 商品画像 */}
              <div className="w-full h-[150px] flex justify-center mt-3">
                <AppImageUploader
                  onFileSelect={handleImgUpload}
                  imagePath={`http://localhost:3000/${imgUrl}?d=${Math.random()}`}
                  acceptExtensions={[".jpg", ".png", ".pdf"]}
                />
              </div>

              {/* タイトル */}
              <div>
                <div className="font-bold  mb-1 mt-4">シリーズ名</div>
                <input
                  className="border border-slate-500 p-1 px-2"
                  name="name"
                  value={series.pr_name}
                  onChange={(e) => {
                    setseries((pre) => ({
                      ...pre,
                      pr_name: e.target.value,
                    }));
                  }}
                />
              </div>

              {/* 説明 */}
              <div>
                <div className="font-bold  mb-1 mt-4">説明</div>
                <textarea
                  className="border border-slate-500 p-1 px-2 w-full"
                  name="description"
                  value={series.pr_description}
                  onChange={(e) => {
                    setseries((pre) => ({
                      ...pre,
                      pr_description: e.target.value,
                    }));
                  }}
                />
              </div>

              {/* 商品分類 */}
              <div>
                <div className="font-bold mb-1 mt-4">商品分類</div>
                <AppDropDownList
                  open={dropdownOpen}
                  onSelect={handleChangePcl}
                  options={dropDownOptions}
                >
                  <button
                    className="border border-slate-500 p-1 px-2 w-full text-left"
                    onClick={handleClick}
                  >
                    {series.pcl.pcl_name}
                  </button>
                </AppDropDownList>
              </div>

              {/* カテゴリ */}
              <div>
                <div className="font-bold mb-1 mt-4">カテゴリ</div>
                <AppCategoryCascader
                  selectedKeys={selectedCategoryKeys}
                  options={categorylist}
                  open={isCategoryOpen}
                  onSelect={(entries) => {
                    setselectedCategoryKeys(entries.map((item) => item.key));
                    setseries((pre) => ({
                      ...pre,
                      categories: [{ ctg_cd: entries[entries.length - 1].key }],
                    }));
                    setisCategoryOpen(false);
                  }}
                  onClose={() => {
                    setisCategoryOpen(false);
                  }}
                >
                  <div
                    onClick={handleCategorybuttonClick}
                    className="border border-slate-500 p-1 px-2"
                  >
                    {categoryDisplay !== "" ? categoryDisplay : "カテゴリなし"}
                  </div>
                </AppCategoryCascader>
              </div>
            </div>
          </div>
          {/* 保存ボタン */}
          <div className="w-full flex justify-end px-3 py-3">
            <AppButton
              text="保存"
              type="primary"
              isForm={true}
              onClick={() => handleSubmit()}
            ></AppButton>
          </div>
        </div>
        {/* 右側部分 */}
        <div className="-pt-5 ml-5 w-full rounded-md shadow-lg bg-white">
          <AppTab
            activeId={activeTabKey}
            onChange={handleTabKey}
            data={tabdata.data}
          />
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailPage;
