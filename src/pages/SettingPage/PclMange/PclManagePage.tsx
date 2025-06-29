import React, { useEffect, useRef, useState } from "react";
import { Column } from "../../../components/AppTable/type";
import AppTable from "../../../components/AppTable/AppTable";
import { useNavigate, useSearchParams } from "react-router-dom";

import PclDetailPage from "../../PclDetailPage/PclDetailPage";
import { queryParamKey } from "../../../routes";
import { GetPclListApi } from "../../../api/pcl.api";
import { isoToDateText } from "../../../util";
import PclCreateButton from "./PclCreateButton";
import PclDeleteButton from "./PclDeleteButton";
import PclUpdateModal from "./PclUpdateModal";
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

  const navigate = useNavigate();
  const [searchParams, setSearchPrams] = useSearchParams();
  const [selectedPclKey, setselectedPclKey] = useState<string | null>(null);

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
  return (
    <div>
      {searchParams.get(queryParamKey.pclDetail) ? (
        <PclDetailPage />
      ) : (
        <div>
          <div className="flex">
            <PclCreateButton
              onUpdate={() => {
                updatePclList(page, pageSize, listorder, keyword);
              }}
            />
            <PclDeleteButton
              selectedKeys={selectedKeys}
              updateList={() => {
                setselectedKeys([]);
                updatePclList(page, pageSize, listorder, keyword);
              }}
            />
          </div>
          <AppTable
            data={dataSource}
            columns={pclColumnData}
            onRowClick={(cd) => setselectedPclKey(cd)}
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
      <PclUpdateModal
        selectedPclKey={selectedPclKey}
        onClose={() => setselectedPclKey(null)}
        onUpdate={() => {
          updatePclList(page, pageSize, listorder, keyword);
        }}
      />
    </div>
  );
};

export default PclManagePage;
