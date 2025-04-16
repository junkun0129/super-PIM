import React, { useEffect, useRef, useState } from "react";
import { Column } from "../../../components/AppTable/type";
import AppTable from "../../../components/AppTable/AppTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import pclApis from "../../../api_dev/pcl.api";
import PclDetailPage from "../../PclDetailPage/PclDetailPage";
import { queryParamKey } from "../../../routes";
import { GetPclListApi } from "../../../api/pcl.api";
import { isoToDateText } from "../../../util";
import PclCreateButton from "./PclCreateButton";
type Row = {
  cd: string;
  name: string;
  count: number;
  created_at: string;
};
export const pclColumnData: Column<Row>[] = [
  { header: "属性セット名", accessor: "name" },
  { header: "紐づき属性数", accessor: "count" },
  { header: "作成日", accessor: "created_at" },
];
const PclManagePage = () => {
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [isShowCreateInput, setisShowCreateInput] = useState<boolean>(false);
  const [page, setpage] = useState<number>(1);
  const [pageSize, setpageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  const [listorder, setlistorder] = useState<"asc" | "desc">("asc");
  const [keyword, setkeyword] = useState<string>("");
  const { addAttrToPclApi, createPclApi, getPclsApi } = pclApis;
  const navigate = useNavigate();
  const [searchParams, setSearchPrams] = useSearchParams();

  useEffect(() => {
    updatePclList(page, pageSize, listorder, keyword);
  }, [page, pageSize, listorder, keyword]);

  const updatePclList = async (
    pg: number,
    ps: number,
    or: string,
    kw: string
  ) => {
    const res = await GetPclListApi({ pg, ps, or, kw });
    console.log(res);
    const { data, total } = res;
    setTotal(total);
    const newDataSource = data.map((item) => {
      return {
        cd: item.pcl_cd,
        name: item.pcl_name,
        created_at: isoToDateText(item.pcl_created_at),
        count: item._count.attrpcl,
      };
    });
    setdataSource(newDataSource);
  };
  const handleRowClick = (cd: string) => {};
  return (
    <div>
      {searchParams.get(queryParamKey.pclDetail) ? (
        <PclDetailPage />
      ) : (
        <div>
          <PclCreateButton
            onUpdate={() => {
              updatePclList(page, pageSize, listorder, keyword);
            }}
          />
          <AppTable
            data={dataSource}
            columns={pclColumnData}
            onRowClick={(id) => handleRowClick(id)}
            currentPage={page}
            pagination={pageSize}
            total={total}
            onRowClickKey={"cd"}
            selectedKeys={selectedKeys}
            onSelectedKeysChange={(keys) => setselectedKeys(keys)}
            onCurrentPageChange={(e) => setpage(e)}
            onPaginationChange={(e) => setpageSize(e)}
            key={"cd"}
          />
        </div>
      )}
    </div>
  );
};

export default PclManagePage;
