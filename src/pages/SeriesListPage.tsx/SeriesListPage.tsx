import React, { useContext, useEffect, useState } from "react";
import AppTable from "../../components/AppTable/AppTable";
import { Column } from "../../components/AppTable/type";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSeriesImg } from "../../util";
import { SeriesList } from "../../api_dev/series.api";
import seriesApi from "../../api_dev/series.api";
import { Flag } from "../../common";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { PRODUCT_SAIYOUS } from "../../constant";
import { AppRoutes, paramHolder, queryParamKey } from "../../routes";
type Row = {
  cd: string;
  hinban: string;
  name: string;
  status: string;
  pcl_name: string;
};
export const columns: Column<Row>[] = [
  { header: "商品コード", accessor: "hinban" },
  { header: "シリーズ名", accessor: "name" },
  { header: "ステータス", accessor: "status" },
  { header: "商品分類", accessor: "pcl_name" },
];

const SeriesListPage = () => {
  const [data, setdata] = useState<Row[]>([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
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
  }, [pagination, currentPage]);

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
    const offset = (currentPage - 1) * pagination;
    const { data, total, result } = await getSeriesListApi({
      offset,
      pagination,
      order,
      deleted: isDeleted,
    });
    if (result !== "success") return setMessage("リストの取得に失敗しました");
    const newDataSource: Row[] = data.map((series, i) => ({
      cd: series.cd,
      hinban: series.hinban,
      name: series.name,
      pcl_name: series.pcl_name,
      status:
        series.is_discontinued === "1"
          ? "廃番"
          : PRODUCT_SAIYOUS[series.acpt_status],
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
      <div>header</div>
      {data && (
        <AppTable
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
          seletedKeys={selectedKeys}
          onSelect={(keys) => {
            setselectedKeys(keys);
          }}
        />
      )}
    </div>
  );
};

export default SeriesListPage;
