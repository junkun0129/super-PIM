import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppRoutes, paramHolder, queryParamKey } from "../../routes";
import skuApis, { SkuDetail } from "../../api_dev/sku.api";
import skuApi from "../../api_dev/sku.api";
import { PRODUCT_SAIYOUS } from "../../constant";
import PclButton from "./PclButton";
import { AppTabProps } from "../../components/AppTab/type";
import AppAttrList from "../../components/AppAttrList/AppAttrList";
import AppAssetList from "../../components/AppAssetList/AppAssetList";
import AppTab from "../../components/AppTab/AppTab";
import LabelButton from "./LabelButton";
const SkuDetailPage = () => {
  const { sku_cd } = useParams();
  const [query, setQuery] = useSearchParams();
  const { getSkuDetailApi } = skuApi;
  const navigate = useNavigate();
  const attachedSeries = query.get(queryParamKey.detailAttched);
  const [activeTabKey, setactiveTabKey] = useState("0");
  const [skuDetail, setskuDetail] = useState<SkuDetail>({
    cd: "",
    name: "",
    description: "",
    is_discontinued: "",
    acpt_status: "",
    hinban: "",
    pcl_name: "",
    attrs: [],
    labels: "",
    is_series: "",
  });

  useEffect(() => {
    getSkuDetail();
  }, []);

  useEffect(() => {
    const tabKey = query.get(queryParamKey.tab);
    if (!tabKey) return;
    setactiveTabKey(tabKey);
  }, [query]);

  const getSkuDetail = async () => {
    const res = await getSkuDetailApi(sku_cd);
    if (res.result !== "success") return;
    setskuDetail(res.data);
  };

  const tabdata: AppTabProps = useMemo(() => {
    return {
      data: [
        {
          key: "0",
          label: "項目",
          content: (
            <AppAttrList updateDetail={getSkuDetail} product={skuDetail} />
          ),
        },
        {
          key: "1",
          label: "アセット",
          content: <AppAssetList product_cd={sku_cd} />,
        },
      ],
    };
  }, [skuDetail]);
  const handleTabKey = (e: string) => {
    setQuery({ ["tab"]: e });
  };
  const handleBackClick = () => {
    if (attachedSeries) {
      const url = AppRoutes.seriesDetailPage.replace(
        paramHolder.series_cd,
        attachedSeries
      );
      navigate(url);
    } else {
      let url = AppRoutes.serisListPage;
      url += `?${queryParamKey.tab}=1`;
      navigate(url);
    }
  };
  return (
    <div>
      <div>
        <button onClick={handleBackClick}>←</button>
        <div>SKU詳細画面</div>
      </div>
      <div className="flex">
        {/* left side */}
        <div>
          <div>商品名：{skuDetail.name}</div>
          <div>説明：{skuDetail.description}</div>
          <div className="flex">
            商品分類：
            {attachedSeries ? (
              skuDetail.pcl_name
            ) : (
              <PclButton pcl_name={skuDetail.pcl_name} />
            )}
          </div>
          <div>
            <LabelButton update={getSkuDetail} labelProps={skuDetail.labels} />
          </div>
          <div>カテゴリ：{skuDetail.description}</div>
          <div>
            ステータス：
            {skuDetail.is_discontinued === "1"
              ? "廃番"
              : PRODUCT_SAIYOUS[skuDetail.acpt_status]}
          </div>
        </div>

        {/* right side */}
        <div>
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

export default SkuDetailPage;
