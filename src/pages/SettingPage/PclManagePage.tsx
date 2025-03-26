import React, { useEffect, useRef, useState } from "react";
import { Column } from "../../components/AppTable/type";
import AppTable from "../../components/AppTable/AppTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import pclApis from "../../api_dev/pcl.api";
import PclDetailPage from "../PclDetailPage/PclDetailPage";
import { queryParamKey } from "../../routes";
type Row = {
  cd: string;
  name: string;
  count: string;
  action: JSX.Element;
};
export const pclColumnData: Column<Row>[] = [
  { header: "商品分類ID", accessor: "cd" },
  { header: "商品名", accessor: "name" },
  { header: "属性数", accessor: "count" },
  { header: "", accessor: "action" },
];
const PclManagePage = () => {
  const [pcls, setpcls] = useState([]);
  const [isShowCreateInput, setisShowCreateInput] = useState<boolean>(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
  const [total, setTotal] = useState(0);
  const { addAttrToPclApi, createPclApi, getPclsApi } = pclApis;
  const navigate = useNavigate();
  const [searchParams, setSearchPrams] = useSearchParams();
  useEffect(() => {
    getpcls();
  }, []);

  const getpcls = async () => {
    const { data, total } = await getPclsApi();

    setTotal(total);
    setpcls(data);
  };

  const CreatePclInput = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleBlur = () => {
      if (inputRef.current?.value === "") {
        setisShowCreateInput(false);
      }
    };

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const handleSubmit = async () => {
      const name = inputRef.current?.value;
      if (name === "" || name === undefined) return;
      const res = await createPclApi({ name });

      getpcls();
      setisShowCreateInput(false);
      if (inputRef.current) inputRef.current.value = "";
    };

    return (
      <div className="flex">
        <input
          ref={inputRef}
          onBlur={() => handleBlur()}
          style={{ border: "solid 1px black" }}
        />
        <button
          onClick={handleSubmit}
          disabled={inputRef.current?.value === ""}
        >
          作成
        </button>
      </div>
    );
  };

  const CreatePclButton = () => (
    <button onClick={() => setisShowCreateInput(true)}>＋</button>
  );

  const handleRowClick = (pcl_id: string) => {
    setSearchPrams({ [queryParamKey.pclDetail]: pcl_id });
  };

  return (
    <div>
      {searchParams.get(queryParamKey.pclDetail) ? (
        <PclDetailPage />
      ) : (
        <div>
          {pcls.length && (
            <AppTable
              data={pcls}
              columns={pclColumnData}
              onRowClick={(id) => handleRowClick(id)}
              currentPage={currentPage}
              pagination={pagination}
              total={total}
              onRowClickKey={"cd"}
              selectedKeys={[]}
              onCurrentPageChange={(e) => setcurrentPage(e)}
              onPaginationChange={(e) => setpagination(e)}
            />
          )}

          {isShowCreateInput ? <CreatePclInput /> : <CreatePclButton />}
        </div>
      )}
    </div>
  );
};

export default PclManagePage;
