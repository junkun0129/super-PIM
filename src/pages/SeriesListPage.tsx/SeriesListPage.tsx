import React, { useContext, useEffect, useState } from "react";
import AppTable from "../../components/AppTable/AppTable";
import { Column } from "../../components/AppTable/type";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSeriesImg, isoToDateText } from "../../util";
import { SeriesList } from "../../api_dev/series.api";
import seriesApi from "../../api_dev/series.api";
import { Flag } from "../../common";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { PRODUCT_SAIYOUS } from "../../constant";
import { AppRoutes, paramHolder, queryParamKey } from "../../routes";
import AppTableHeader from "./AppTableHeader";
import { getProductListApi } from "../../api/product.api";

type Row = {
  cd: string;
  hinban: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  pcl_name: string;
};
export const columns: Column<Row>[] = [
  { header: "商品コード", accessor: "hinban" },
  { header: "シリーズ名", accessor: "name" },
  { header: "ステータス", accessor: "status" },
  { header: "商品分類", accessor: "pcl_name" },
  { header: "作成日時", accessor: "created_at" },
  { header: "更新日時", accessor: "updated_at" },
];

const SeriesListPage = () => {
  const [data, setdata] = useState<Row[]>([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
  const [categoryKeys, setcategoryKeys] = useState<string[]>([]);
  const [workspace, setworkspace] = useState("");
  const [keywords, setkeywords] = useState("");
  const [orderAttr, setorderAttr] = useState("pr_hinban");
  const [order, setorder] = useState<"asc" | "desc">("asc");
  const [isDeleted, setisDeleted] = useState<Flag>("0");
  const { setMessage } = useMessageContext();
  const [total, setTotal] = useState(0);
  const { getSeriesListApi } = seriesApi;
  const [query, setQuery] = useSearchParams();
  const navigate = useNavigate();
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  useEffect(() => {
    getSeries();

    return () => {
      setdata([]);
    };
  }, [pagination, currentPage, keywords]);

  const handleRowClick = (series_cd: string) => {
    const media_cd = query.get(queryParamKey.mediaSelected);
    if (!media_cd) return;
    let url = AppRoutes.seriesDetailPage.replace(
      paramHolder.series_cd,
      series_cd
    );
    url += `?${queryParamKey.mediaSelected}=${media_cd}`;

    navigate(url);
  };

  const getSeries = async () => {
    const { data, total, result } = await getProductListApi({
      is: "1",
      pg: currentPage,
      ps: pagination,
      ws: workspace,
      ob: orderAttr,
      or: order,
      kw: keywords,
      ct: categoryKeys.length ? categoryKeys[categoryKeys.length - 1] : "",
      id: isDeleted,
    });
    if (result !== "success") return setMessage("リストの取得に失敗しました");
    const newDataSource: Row[] = data.map((pr, i) => ({
      cd: pr.pr_cd,
      hinban: pr.pr_hinban,
      name: pr.pr_name,
      pcl_name: pr.pcl.pcl_name,
      created_at: isoToDateText(pr.pr_created_at),
      updated_at: isoToDateText(pr.pr_updated_at),
      status:
        pr.pr_is_discontinued === "1"
          ? "廃番"
          : PRODUCT_SAIYOUS[pr.pr_acpt_status],
    }));
    setTotal(total);
    setdata(newDataSource);
  };

  const handlePaginaionChange = (newPagination: number) => {
    setcurrentPage(1);
    setpagination(newPagination);
  };

  return (
    <div className="w-full h-full bg-red-50">
      <AppTableHeader
        updateList={getSeries}
        selectedCategoryKeys={categoryKeys}
        setSelectedCategoryKeys={setcategoryKeys}
        setKeyword={setkeywords}
        keyword={keywords}
      />

      {data && (
        <AppTable
          key="series"
          data={data}
          columns={columns}
          onRowClick={(series_cd) => handleRowClick(series_cd)}
          onRowClickKey={"cd"}
          currentPage={currentPage}
          pagination={pagination}
          total={total}
          onCurrentPageChange={(e) => setcurrentPage(e)}
          onPaginationChange={(e) => handlePaginaionChange(e)}
          checkable={true}
          selectedKeys={selectedKeys}
          onSelectedKeysChange={(keys) => setselectedKeys(keys)}
        />
      )}
    </div>
  );
};

export default SeriesListPage;
