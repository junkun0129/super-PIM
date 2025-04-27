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
} from "../../api/product.api";
import { CategoryTree, getCategoryListApi } from "../../api/category.api";
const SeriesDetailPage = () => {
  const { getSeriesDetailApi, getSeriesSkuListApi, updateSeriesApi } =
    seriesApis;
  const {
    getAllCategoriesApi,
    getProductCategoriesApi,
    updateProductCategoryApi,
  } = categoryApis;
  const { getPclsApi } = pclApis;
  const { updateProductAttrsApi } = attrApis;
  const { updateProductPclApi } = productApis;
  const [isCategoryOpen, setisCategoryOpen] = useState(false);

  const { setMessage } = useMessageContext();
  const [series, setseries] = useState<ProductDetail>({
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
    categories: [
      {
        ctg_cd: "",
      },
    ],
  });
  const [attrList, setattrList] = useState<ProductAttr[]>([]);

  let { series_cd } = useParams();
  const navigate = useNavigate();
  const [categorylist, setcategorylist] = useState<CategoryTree[]>([]);
  const [selectedCategoryKeys, setselectedCategoryKeys] = useState<string[]>(
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTabKey, setactiveTabKey] = useState("0");
  const [dropDownOptions, setdropDownOptions] = useState<
    {
      cd: string;
      label: string;
    }[]
  >([]);
  const [dropdownOpen, setdropdownOpen] = useState(false);

  useEffect(() => {
    getSeries();
  }, []);

  useEffect(() => {
    const tabKey = searchParams.get(queryParamKey.tab);
    if (!tabKey) return;
    setactiveTabKey(tabKey);
  }, [searchParams]);

  const getSeries = async () => {
    const res = await getProductDetailApi({ pr_cd: series_cd });
    if (res.result !== "success") return;

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formValue = getObjectFromRowFormData(event);

    const res = await updateProductCategoryApi({
      body: {
        product_cd: series_cd,
        category_cd: selectedKeys[selectedKeys.length - 1] as string,
        media: "0",
      },
    });

    const res1 = await updateSeriesApi({
      series_cd,
      body: {
        name: formValue["name"] as string,
        description: formValue["description"] as string,
      },
    });

    getSeries();
    setMessage("シリーズの更新に成功しました");
  };

  const handleClick = async () => {
    const res = await getPclsApi();
    setdropDownOptions(
      res.data.map((item) => {
        return {
          label: item.pcl_name,
          cd: item.cd,
        };
      })
    );
    setdropdownOpen(true);
  };

  const handleChangePcl = async (cd) => {
    const res = await updateProductPclApi({
      product_cd: series.cd,
      pcl_cd: cd,
    });
    if (res.result === "success") {
      setdropdownOpen(false);
      getSeries();
    }
  };

  return (
    <div className="w-full h-full">
      <div className="mb-3 text-2xl font-bold">シリーズ詳細画面</div>
      <div className="flex h-[95%]">
        <div className="rounded-md bg-white shadow-md  relative  h-full flex flex-col px-6 relative">
          <div className="w-full flex">
            <div className="w-full h-[150px] bg-slate-500 mt-5"></div>
          </div>
          {series && (
            <form
              className="w-full flex flex-col py-3 overflow-auto"
              onSubmit={handleSubmit}
            >
              <div>
                <div className="font-bold  mb-1 mt-4">シリーズ名</div>
                <input
                  className="border border-slate-500 p-1 px-2"
                  name="name"
                  defaultValue={series.pr_name}
                />
              </div>

              <div>
                <div className="font-bold  mb-1 mt-4">説明</div>
                <textarea
                  className="border border-slate-500 p-1 px-2 w-full"
                  name="description"
                  defaultValue={series.pr_description}
                />
              </div>
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
                    {!!series.categories.length
                      ? "カテゴリあり"
                      : "カテゴリなし"}
                  </div>
                </AppCategoryCascader>
              </div>
              <div className="absolute right-5 bottom-5 mt-10">
                <AppButton
                  text="保存"
                  type="primary"
                  isForm={true}
                  onClick={() => {}}
                ></AppButton>
              </div>
            </form>
          )}
        </div>
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
