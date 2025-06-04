import React, { ReactNode, useCallback, useEffect, useState } from "react";
import AppButton from "../../../components/AppButton/AppButton";
import AppModal from "../../../components/AppModal/AppModal";
import { getAttrsEntriesApi } from "../../../api/attr.api";
import AppInput from "../../../components/AppInput/AppInput";
import AppTable from "../../../components/AppTable/AppTable";
import { Column } from "../../../components/AppTable/type";
import { AddAttrsToPclApi, CreatePclApi } from "../../../api/pcl.api";
type Row = {
  cd: string;

  name: string;
  alter_name: ReactNode;
  is_common: ReactNode;
  is_show: ReactNode;
};

const columns: Column<Row>[] = [
  { accessor: "name", header: "項目名" },
  { accessor: "alter_name", header: "表示名" },
  { accessor: "is_common", header: "必須項目" },
  { accessor: "is_show", header: "非表示にする" },
];

type Props = {
  onUpdate: () => void;
};
const PclCreateButton = ({ onUpdate }: Props) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);

  const [page, setpage] = useState<number>(1);
  const [pageSize, setpageSize] = useState<number>(10);
  const [total, settotal] = useState(0);
  const [dataSource, setdataSource] = useState<Row[]>([]);

  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  useEffect(() => {
    if (!isModalOpen) return;
    getAttrs();
  }, [isModalOpen]);

  const getAttrs = async () => {
    const res = await getAttrsEntriesApi();
    if (res.result !== "success") return;

    const newDataSource: Row[] = res.data.map((item) => ({
      cd: item.atr_cd,
      name: item.atr_name,

      alter_name: (
        <input
          name={`${item.atr_cd}-atp_alter_name`}
          className="border border-slate-400 p-1 px-2"
        />
      ),
      is_common: (
        <input
          name={`${item.atr_cd}-atp_is_common`}
          className="w-[20px] h-[20px] flex items-center"
          type="checkbox"
        />
      ),
      is_show: (
        <input
          name={`${item.atr_cd}-atp_is_show`}
          className="w-[20px] h-[20px] flex items-center"
          type="checkbox"
        />
      ),
    }));
    setdataSource(newDataSource);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const pcl_name = formData.get("pcl_name")?.toString() ?? "";
    if (pcl_name === "") return;
    const res = await CreatePclApi({ body: { pcl_name } });
    if (res.result !== "success") return;

    const values = selectedKeys.map((cd, i) => ({
      pcl_cd: res.data.pcl_cd,
      atr_cd: cd,
      atp_is_show: formData.get(`${cd}-atp_is_show`) ? "1" : "0",
      atp_alter_name: formData.get(`${cd}-atp_alter_name`)?.toString() ?? "",
      atp_is_common: formData.get(`${cd}-atp_is_common`) ? "1" : "0",
      atp_order: i,
    }));

    const res2 = await AddAttrsToPclApi({ body: values });
    if (res2.result !== "success") return;
    setisModalOpen(false);
    setselectedKeys([]);
    onUpdate();
  };
  return (
    <>
      <AppButton
        className="px-5 mb-1 mr-1"
        text={"＋ 属性セットを作成する"}
        onClick={() => setisModalOpen(true)}
        type={"primary"}
      />
      <AppModal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        title={"属性セットの作成"}
      >
        <form onSubmit={handleSubmit}>
          <div className="my-5">
            <AppInput
              require
              type={"text"}
              name={"pcl_name"}
              label={"商品分類名"}
            />
          </div>

          <AppTable
            key={"cd"}
            onRowClickKey={"cd"}
            selectedKeys={selectedKeys}
            onSelectedKeysChange={(keys) => setselectedKeys(keys)}
            data={dataSource}
            columns={columns}
            onRowClick={function (id: string): void {
              throw new Error("Function not implemented.");
            }}
            currentPage={page}
            pagination={pageSize}
            total={10}
            onCurrentPageChange={(page) => setpage(page)}
            onPaginationChange={(pageSize) => setpageSize(pageSize)}
          />
          <AppButton
            text={"確定"}
            isForm={true}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            type={"primary"}
          />
        </form>
      </AppModal>
    </>
  );
};

export default PclCreateButton;
