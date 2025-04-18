import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppTabProps } from "../../components/AppTab/type";
import AppTab from "../../components/AppTab/AppTab";
import seriesApis, { SeriesDetail } from "../../api_dev/series.api";
import categoryApis from "../../api_dev/category.api";
import { CategoryNode } from "../../data/categories/type";
import AppCategoryCascader from "../../components/AppCategoryCascader/AppCategoryCascader";
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
  const [categoryDataSource, setcategoryDataSource] = useState<CategoryNode[]>(
    []
  );
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  const { setMessage } = useMessageContext();
  const [series, setseries] = useState<SeriesDetail>({
    cd: "",
    name: "",
    description: "",
    is_discontinued: "",
    acpt_status: "",
    hinban: "",
    pcl_name: "",
    attrs: [],
    is_series: "",
  });
  const [category, setcategory] = useState<string>("");
  let { series_cd } = useParams();
  const navigate = useNavigate();
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
    getCategory();
  }, []);

  useEffect(() => {
    const tabKey = searchParams.get(queryParamKey.tab);
    if (!tabKey) return;
    setactiveTabKey(tabKey);
  }, [searchParams]);

  const getSeries = async () => {
    const newSeries = await getSeriesDetailApi(series_cd as string);
    setseries(newSeries);
  };

  const tabdata: AppTabProps = useMemo(() => {
    return {
      data: [
        { key: "0", label: "SKU", content: <SkuListPage /> },
        {
          key: "1",
          label: "項目",
          content: <AppAttrList updateDetail={getSeries} product={series} />,
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
    const res = await getAllCategoriesApi();
    if (res.result !== "success") return;

    setcategoryDataSource(res.data);
    setisCategoryOpen(true);
  };

  const getCategory = async () => {
    const res = await getProductCategoriesApi({
      body: {
        product_cd: series_cd,
        media: "0",
      },
    });
    if (res.result !== "success") return;
    let newCategory = "";
    res.data.map((item, i) => {
      if (i !== 0) {
        newCategory += " > ";
      }
      newCategory += item.name;
    });
    setcategory(newCategory);
    setselectedKeys(res.data.map((item) => item.cd));
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
    getCategory();
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
                  defaultValue={series.name}
                />
              </div>

              <div>
                <div className="font-bold  mb-1 mt-4">説明</div>
                <textarea
                  className="border border-slate-500 p-1 px-2 w-full"
                  name="description"
                  defaultValue={series.description}
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
                    {series.pcl_name}
                  </button>
                </AppDropDownList>
              </div>

              <div>
                <div className="font-bold mb-1 mt-4">カテゴリ</div>
                <AppCategoryCascader
                  selectedKeys={selectedKeys}
                  options={categoryDataSource}
                  open={isCategoryOpen}
                  onSelect={(entries) => {
                    setselectedKeys(entries.map((item) => item.key));
                    setisCategoryOpen(false);
                    setcategory(entries.map((item) => item.value).join(" > "));
                  }}
                  onClose={() => {
                    setisCategoryOpen(false);
                  }}
                >
                  <div
                    onClick={handleCategorybuttonClick}
                    className="border border-slate-500 p-1 px-2"
                  >
                    {category}
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
