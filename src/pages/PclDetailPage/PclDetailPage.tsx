import React, { Attributes, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppTable from "../../components/AppTable/AppTable";
import { Column } from "../../components/AppTable/type";
import AppModal from "../../components/AppModal/AppModal";
import pclApis from "../../api_dev/pcl.api";
import attrApis from "../../api_dev/attrs.api";

import { useMessageContext } from "../../providers/MessageContextProvider";
import { AttrPclTable } from "../../data/attrpcls/type";
type Row = {
  cd: string;
  name: string;
  action: JSX.Element;
};
const attrColumnData: Column<Row>[] = [
  { accessor: "name", header: "項目名" },
  { accessor: "cd", header: "項目コード" },
  { accessor: "action", header: "" },
];

const PclDetailPage = () => {
  const { getPclsApi, getPclsAttrsApi, createPclApi, addAttrToPclApi } =
    pclApis;
  const { getAllAttrsApi } = attrApis;
  const [selectedAttr, setselectedAttr] = useState<string | null>(null);
  const { setMessage } = useMessageContext();
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
  const [total, settotal] = useState(0);
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [attrslist, setattrslist] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isCommon, setisCommon] = useState(false);
  const [searchParams, setSearchPrams] = useSearchParams();
  const pcl_cd = searchParams.get("pc");
  useEffect(() => {
    getPclDetail();
  }, []);

  useEffect(() => {
    if (attrslist.length === 1) {
      setselectedAttr(attrslist[0].cd);
    }
  }, [attrslist]);

  const getPclDetail = async () => {
    const res = await getPclsAttrsApi(pcl_cd as string);
    if (res.result !== "success") setMessage("失敗しました");
    const newDataSource: Row[] = res.data.map((item) => ({
      cd: item.attr_cd,
      name: item.name,
      action: <div>仮</div>,
    }));
    setdataSource(newDataSource);
  };

  const handleClickAddButton = async () => {
    const res = await getAllAttrsApi();
    if (res.result !== "success") return setMessage("失敗しました");
    const newList = res.data.filter(
      (item) => !dataSource.map((item) => item.cd).includes(item.cd)
    );
    if (!newList.length) return setMessage("追加できる項目はありません");
    setattrslist(newList);
    setisModalOpen(true);
  };
  const handleAddAttr = async () => {
    const res = await addAttrToPclApi({
      body: {
        pcl_cd,
        attr_cd: selectedAttr,
        is_common: isCommon ? "1" : "0",
      },
    });

    setisModalOpen(false);
    getPclDetail();
  };

  return (
    <div>
      <button
        onClick={() => {
          setSearchPrams({});
        }}
      >
        戻る
      </button>
      <button onClick={handleClickAddButton}>作成</button>
      <AppModal onClose={() => setisModalOpen(false)} open={isModalOpen}>
        <div>
          <select
            value={selectedAttr}
            onChange={(e) => {
              setselectedAttr(e.target.value); // Update the selected attribute
            }}
          >
            {attrslist.map((attr, i) => (
              <option key={i} value={attr.cd}>
                {attr.name}
              </option>
            ))}
          </select>
          <input
            type="checkbox"
            value={isCommon}
            onChange={(e) => setisCommon(e.target.checked)}
          />
          <button disabled={!selectedAttr} onClick={() => handleAddAttr()}>
            追加
          </button>
        </div>
      </AppModal>
      {dataSource.length && (
        <div>
          <div>商品分類CD:{pcl_cd}</div>
          <div>
            <AppTable
              data={dataSource}
              columns={attrColumnData}
              onRowClick={function (id: string): void {
                throw new Error("Function not implemented.");
              }}
              currentPage={currentPage}
              pagination={pagination}
              total={total}
              onCurrentPageChange={function (page: number): void {
                throw new Error("Function not implemented.");
              }}
              onPaginationChange={function (pagination: number): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PclDetailPage;
