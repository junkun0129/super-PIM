import React, { Attributes, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppTable from "../../components/AppTable/AppTable";
import { Column } from "../../components/AppTable/type";
import AppModal from "../../components/AppModal/AppModal";
import pclApis from "../../api_dev/pcl.api";
import attrApis from "../../api_dev/attrs.api";

import { useMessageContext } from "../../providers/MessageContextProvider";
import { AttrPclTable } from "../../data/attrpcls/type";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import { getObjectFromRowFormData } from "../../util";
import mediaApi from "../../api_dev/media.api";
import { MediaTable } from "../../data/medias/medias";
import AppTab from "../../components/AppTab/AppTab";
import { queryParamKey } from "../../routes";
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
const dropdownOption: { cd: string; label: string }[] = [
  { cd: "0", label: "編集" },
  { cd: "1", label: "削除" },
];
const PclDetailPage = () => {
  const { getPclsAttrsApi, addAttrToPclApi, updatePclAttrApi } = pclApis;
  const { getAllAttrsApi } = attrApis;
  const [selectedAttr, setselectedAttr] = useState<string | null>(null);
  const [selectedAttrPcl, setselectedAttrPcl] = useState<AttrPclTable | null>(
    null
  );
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
  const { getAllMediaApi } = mediaApi;
  const [mediaList, setmediaList] = useState<MediaTable[]>([]);
  useEffect(() => {
    getMedialist();
  }, []);

  useEffect(() => {
    console.log(mediaList);
  }, [mediaList]);
  useEffect(() => {
    const media_cd = searchParams.get(queryParamKey.tab);
    if (!media_cd) return;
    getPclDetail(media_cd);
  }, [searchParams]);

  useEffect(() => {
    if (attrslist.length === 1) {
      setselectedAttr(attrslist[0].cd);
    }
  }, [attrslist]);

  const getMedialist = async () => {
    const res = await getAllMediaApi();
    if (res.result !== "success") return;

    setmediaList([{ cd: "0", name: "商品管理" }, ...res.data]);
  };

  const getPclDetail = async (media_cd: string) => {
    const res = await getPclsAttrsApi({ body: { media_cd, pcl_cd } });
    if (res.result !== "success") setMessage("失敗しました");
    const newDataSource: Row[] = res.data.map((item) => ({
      cd: item.attr_cd,
      name: item.name,
      action: (
        <AppDropDownList
          onSelect={(e) => handleSelectOption(e, item)}
          options={dropdownOption}
        >
          <button>：</button>
        </AppDropDownList>
      ),
    }));
    setdataSource(newDataSource);
  };
  const handleSelectOption = async (key: string, attr: AttrPclTable) => {
    if (key === "0") {
      setselectedAttrPcl(attr);
    }
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
  const handleAddAttr = async () => {};
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    const values = getObjectFromRowFormData(e);
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
            onChange={(e) => setisCommon(e.target.checked)}
          />
          <button disabled={!selectedAttr} onClick={() => handleAddAttr()}>
            追加
          </button>
        </div>
      </AppModal>
      <AppModal open={!!selectedAttrPcl} onClose={() => setselectedAttr(null)}>
        {selectedAttrPcl && (
          <form onSubmit={handleUpdate}>
            {Object.entries(ATTRPCL_TO_LABEL).map(([key, value]) => {
              if (key === "is_common" || key === "is_show") {
                return (
                  <div key={key}>
                    <label>{value}</label>
                    <input
                      type="checkbox"
                      defaultChecked={
                        selectedAttrPcl[key] === "1" ? true : false
                      }
                    />
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label>{value}</label>
                  <input defaultValue={selectedAttrPcl[key]} />
                </div>
              );
            })}
            <button type="submit">保存</button>
          </form>
        )}
      </AppModal>
      <AppTab
        onChange={(e) => {
          setSearchPrams({ ["pc"]: pcl_cd, [queryParamKey.tab]: e });
        }}
        data={mediaList.map((item) => ({
          key: item.cd,
          label: item.name,
          content: "",
        }))}
      />
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

const ATTRPCL_TO_LABEL = {
  is_show: "表示",
  is_common: "必須項目",
  alter_name: "表示名称",
};
