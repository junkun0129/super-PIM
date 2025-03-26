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
import { AppRoutes, paramHolder, queryParamKey } from "../../routes";
import AppButton from "../../components/AppButton/AppButton";
const SeriesDetailPage = () => {
  const { getSeriesDetailApi, getSeriesSkuListApi, updateSeriesApi } =
    seriesApis;
  const {
    getAllCategoriesApi,
    getProductCategoriesApi,
    updateProductCategoryApi,
  } = categoryApis;

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
  let { series_cd } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTabKey, setactiveTabKey] = useState("0");
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

  return (
    <div className="w-full">
      <div className="px-6">
        <button onClick={handleBackClick}>←</button>
      </div>
      <div className="flex">
        <div className="rounded-md bg-white shadow-md flex flex-col px-6">
          <div className="w-full flex">
            <div className="w-[150px] h-[150px] bg-slate-500 m-4"></div>
          </div>
          {series && (
            <form
              className=" relative w-full flex flex-col py-3"
              onSubmit={handleSubmit}
            >
              <div>
                <div>シリーズ名</div>
                <input name="name" defaultValue={series.name} />
              </div>

              <div>
                <div>説明</div>
                <textarea
                  name="description"
                  defaultValue={series.description}
                />
              </div>

              <AppCategoryCascader
                selectedKeys={selectedKeys}
                options={categoryDataSource}
                open={isCategoryOpen}
                onSelect={(keys) => {
                  setselectedKeys(keys);
                  setisCategoryOpen(false);
                }}
                onClose={() => {
                  setisCategoryOpen(false);
                }}
              >
                <div onClick={handleCategorybuttonClick}>カテゴリ</div>
              </AppCategoryCascader>
              <div className="flex justify-end">
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
        <AppTab
          activeId={activeTabKey}
          onChange={handleTabKey}
          data={tabdata.data}
        />
      </div>
    </div>
  );
};

export default SeriesDetailPage;
