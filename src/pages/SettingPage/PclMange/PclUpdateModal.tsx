import React, { ReactNode, useCallback, useEffect, useState } from "react";
import AppModal from "../../../components/AppModal/AppModal";
import AppInput from "../../../components/AppInput/AppInput";
import AppTable from "../../../components/AppTable/AppTable";
import AppButton from "../../../components/AppButton/AppButton";
import { Column } from "../../../components/AppTable/type";
import { GetPclDetailApi, PclDetail, updatePclApi } from "../../../api/pcl.api";
import { flagToBoolean, moveBehindByKey } from "../../../util";
type Props = {
  selectedPclKey: string | null;
  onClose: () => void;
  onUpdate: () => void;
};
type Row = {
  cd: string;
  action: ReactNode;
  name: string;
  order: ReactNode;
  alter_name: ReactNode;
  is_common: ReactNode;
  is_show: ReactNode;
};

const columns: Column<Row>[] = [
  { accessor: "action", header: "順番変更" },
  { accessor: "name", header: "項目名" },
  { accessor: "alter_name", header: "表示名" },
  { accessor: "is_common", header: "必須項目" },
  { accessor: "is_show", header: "非表示にする" },
];

const PclUpdateModal = ({ selectedPclKey, onClose, onUpdate }: Props) => {
  const [page, setpage] = useState<number>(1);
  const [pageSize, setpageSize] = useState<number>(10);
  const [total, settotal] = useState(0);
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (selectedPclKey) {
      getPcl(selectedPclKey);
    }
    return () => {
      setdataSource([]);
      setselectedKeys([]);
    };
  }, [selectedPclKey]);
  const getPcl = async (pcl_cd: string) => {
    const res = await GetPclDetailApi({ pcl_cd });
    if (res.result !== "success") return;

    const newDataSource: Row[] = res.data.attrpcl.map((item) => ({
      cd: item.atp_cd,
      name: item.attr.atr_name,
      action: <div className="cursor-pointer">：</div>,
      order: (
        <input
          defaultValue={item.atp_order}
          className="hidden"
          name={`${item.atp_cd}-atp_order`}
        />
      ),
      alter_name: (
        <input
          defaultValue={item.atp_alter_name}
          name={`${item.atp_cd}-atp_alter_name`}
          className="border border-slate-400 p-1 px-2"
        />
      ),
      is_common: (
        <input
          defaultChecked={flagToBoolean({ flag: item.atp_is_common })}
          name={`${item.atp_cd}-atp_is_common`}
          className="w-[20px] h-[20px] flex items-center"
          type="checkbox"
        />
      ),
      is_show: (
        <input
          defaultChecked={flagToBoolean({ flag: item.atp_is_show })}
          name={`${item.atp_cd}-atp_is_show`}
          className="w-[20px] h-[20px] flex items-center"
          type="checkbox"
        />
      ),
    }));
    setdataSource(newDataSource);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const pcl_name = formData.get("pcl_name")?.toString() ?? "";
      const attrs = selectedKeys.map((cd) => ({
        atp_cd: cd,
        atp_is_show: formData.get(`${cd}-atp_is_show`) ? "1" : "0",
        atp_alter_name: formData.get(`${cd}-atp_alter_name`)?.toString() ?? "",
        atp_is_common: formData.get(`${cd}-atp_is_common`) ? "1" : "0",
        atp_order: formData.get(`${cd}-atp_order`)?.toString() ?? "",
      }));
      const body = {
        pcl_cd: selectedPclKey,
        pcl_name,
        attrs,
      };

      const res = await updatePclApi({ body });
      if (res.result !== "success") return;
      setselectedKeys([]);
      onClose();
      onUpdate();
    },
    [selectedPclKey]
  );

  return (
    <AppModal
      open={!!selectedPclKey}
      onClose={() => {
        onClose();
      }}
      title={"商品分類の編集"}
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
          onDrop={({ activeCd, overCd }) => {
            const newDatasource = [...dataSource];
            const sortedDataSource = moveBehindByKey(
              newDatasource,
              activeCd,
              overCd,
              "cd"
            );
            setdataSource(sortedDataSource);
          }}
          checkable={false}
          draggableAccesor="action"
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
  );
};

export default PclUpdateModal;
