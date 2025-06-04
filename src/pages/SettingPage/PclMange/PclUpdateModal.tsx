import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppModal from "../../../components/AppModal/AppModal";
import AppInput from "../../../components/AppInput/AppInput";
import AppTable from "../../../components/AppTable/AppTable";
import AppButton from "../../../components/AppButton/AppButton";
import { Column } from "../../../components/AppTable/type";
import { GetPclDetailApi, PclDetail, updatePclApi } from "../../../api/pcl.api";
import {
  changeOrderByOrder,
  flagToBoolean,
  moveBehindByKey,
} from "../../../util";
import { useMessageContext } from "../../../providers/MessageContextProvider";
type Props = {
  selectedPclKey: string | null;
  onClose: () => void;
  onUpdate: () => void;
};
type Row = {
  cd: string;
  action: ReactNode;
  name: string;
  order: number;
  alter_name: ReactNode;
  is_common: ReactNode;
  is_show: ReactNode;
  alter_name_value: string;
  is_common_value: string;
  is_show_value: string;
};

const columns: Column<Row>[] = [
  { accessor: "action", header: "順番" },
  { accessor: "name", header: "項目名" },
  { accessor: "alter_name", header: "表示名" },
  { accessor: "is_common", header: "必須項目" },
  { accessor: "is_show", header: "非表示にする" },
];
type UpdatedRowData = {
  [atp_cd: string]: {
    cd: string;
    alter_name: string;
    is_show: string;
    is_common: string;
    order: number;
  };
};

const PclUpdateModal = ({ selectedPclKey, onClose, onUpdate }: Props) => {
  const [page, setpage] = useState<number>(1);
  const [pageSize, setpageSize] = useState<number>(10);
  const [total, settotal] = useState(0);
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [updatedRowData, setupdatedRowData] = useState<UpdatedRowData>({});
  const context = useMessageContext();
  const [pclName, setpclName] = useState<string>("");

  useEffect(() => {
    if (selectedPclKey) {
      getPcl(selectedPclKey);
    }
    return () => {
      setdataSource([]);
      setupdatedRowData({});
      setpclName("");
    };
  }, [selectedPclKey]);

  const getPcl = async (pcl_cd: string) => {
    const res = await GetPclDetailApi({ pcl_cd });
    if (res.result !== "success") return;
    setpclName(res.data.pcl_name);

    const sortedAttrs = res.data.attrpcl.sort(
      (a, b) => a.atp_order - b.atp_order
    );
    const newDataSource: Row[] = sortedAttrs.map((item) => {
      return {
        cd: item.atp_cd,
        name: item.attr.atr_name,
        action: <div className=" cursor-move">: : : : </div>,
        order: item.atp_order,
        alter_name_value: item.atp_alter_name,
        is_show_value: item.atp_is_common,
        is_common_value: item.atp_is_common,
        alter_name: (
          <input
            key={`${item.atp_cd}-atp_alter_name`}
            id={`${item.atp_cd}-atp_alter_name`}
            defaultValue={item.atp_alter_name.toString()}
            name={`${item.atp_alter_name}`}
            className="border border-slate-400 p-1 px-2"
            onBlur={(e) => handleBlur(e, "alter_name", item.atp_cd, "text")}
          />
        ),
        is_common: (
          <input
            key={`${item.atp_cd}-atp_is_common`}
            id={`${item.atp_cd}-atp_is_common`}
            defaultChecked={flagToBoolean({ flag: item.atp_is_common })}
            name={item.atp_is_common}
            className="w-[20px] h-[20px] flex items-center"
            type="checkbox"
            onBlur={(e) => handleBlur(e, "is_common", item.atp_cd, "check")}
          />
        ),
        is_show: (
          <input
            key={`${item.atp_cd}-atp_is_show`}
            id={`${item.atp_cd}-atp_is_show`}
            defaultChecked={flagToBoolean({ flag: item.atp_is_show })}
            name={item.atp_is_show}
            className="w-[20px] h-[20px] flex items-center"
            type="checkbox"
            onBlur={(e) => handleBlur(e, "is_show", item.atp_cd, "check")}
          />
        ),
      };
    });
    console.log(newDataSource, "newDataSource");
    setdataSource(newDataSource);
  };

  useEffect(() => {
    console.log(updatedRowData, "updatedRowData");
  }, [updatedRowData]);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    key: string,
    cd: string,
    flag: "check" | "text"
  ) => {
    setupdatedRowData((pre) => {
      let newData = JSON.parse(JSON.stringify(pre));
      if (flag === "text") {
        newData[cd] = { ...newData[cd], [key]: e.target.value };
      }
      if (flag === "check") {
        newData[cd] = { ...newData[cd], [key]: e.target.checked ? "1" : "0" };
      }
      return newData;
    });

    setdataSource((pre) =>
      pre.map((item) => {
        if (item.cd === cd) {
          return {
            ...item,
            [`${key}_value`]:
              flag === "check"
                ? !!e.target.checked
                  ? "1"
                  : "0"
                : e.target.value,
            [key]: (
              <input
                key={`${item.cd}-atp_${key}`}
                {...(flag === "check"
                  ? {
                      defaultChecked: e.target.checked,

                      type: "checkbox",
                      className: "w-[20px] h-[20px] flex items-center",
                    }
                  : {})}
                {...(flag === "text"
                  ? {
                      defaultValue: e.target.value,
                      className: "border border-slate-400 p-1 px-2",
                    }
                  : {})}
                id={`${item.cd}-atp_${key}`}
                onBlur={(e) => handleBlur(e, key, item.cd, flag)}
              />
            ),
          };
        }
        return {
          ...item,
        };
      })
    );
  };

  const handleDrop = ({
    activeCd,
    overCd,
    updatedRowData,
  }: {
    activeCd: string;
    overCd: string;

    updatedRowData: UpdatedRowData;
  }) => {
    //sort out by new order
    const swapedArray = moveBehindByKey(
      [...dataSource],
      activeCd,
      overCd,
      "cd"
    );

    let newDataSource = changeOrderByOrder(swapedArray, "order");

    //update updatedrowData
    let newUpdatedRowdata: UpdatedRowData = JSON.parse(
      JSON.stringify(updatedRowData)
    );

    newDataSource.forEach((item) => {
      newUpdatedRowdata[item.cd] = {
        cd: item.cd,
        alter_name: item.alter_name_value,
        is_show: item.is_show_value,
        is_common: item.is_common_value,
        order: item.order,
      };
    });

    //update useState
    setdataSource(newDataSource);
    setupdatedRowData(newUpdatedRowdata);
  };

  const handleSubmit = async (
    updatedRowData: UpdatedRowData,
    dataSource: Row[],
    pcl_name: string
  ) => {
    let attrsBody = [];
    let newUpdatedRowdata: UpdatedRowData = JSON.parse(
      JSON.stringify(updatedRowData)
    );
    dataSource.forEach((item) => {
      newUpdatedRowdata[item.cd] = {
        cd: item.cd,
        alter_name: item.alter_name_value,
        is_show: item.is_show_value,
        is_common: item.is_common_value,
        order: item.order,
      };
    });
    const attrsArray = Object.values(newUpdatedRowdata);
    if (attrsArray.length) {
      attrsBody = attrsArray.map((attr) => ({
        atp_cd: attr.cd,
        atp_is_show: attr.is_show,
        atp_alter_name: attr.alter_name,
        atp_is_common: attr.is_common,
        atp_order: attr.order,
      }));
    }

    const body = {
      pcl_cd: selectedPclKey,
      pcl_name,
      attrs: attrsBody,
    };

    const res = await updatePclApi({ body });
    if (res.result !== "success") return;

    onClose();
    onUpdate();
    getPcl(selectedPclKey);
    context.setMessage(res.message);
  };

  return (
    <AppModal
      open={!!selectedPclKey}
      onClose={() => {
        onClose();
      }}
      title={"商品分類の編集"}
    >
      <div className="my-5">
        <AppInput
          require
          value={pclName}
          onChange={(e) => setpclName(e.target.value)}
          type={"text"}
          name={"pcl_name"}
          label={"商品分類名"}
        />
      </div>

      <AppTable
        key={"cd"}
        onRowClickKey={"cd"}
        data={dataSource}
        columns={columns}
        onRowClick={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
        onDrop={({ activeCd, overCd }) =>
          handleDrop({ activeCd, overCd, updatedRowData })
        }
        checkable={false}
        draggableAccesor="action"
        currentPage={page}
        pagination={pageSize}
        total={10}
        onCurrentPageChange={(page) => setpage(page)}
        onPaginationChange={(pageSize) => setpageSize(pageSize)}
      />

      <AppButton
        text={"更新"}
        isForm={true}
        onClick={() => handleSubmit(updatedRowData, dataSource, pclName)}
        type={"primary"}
      />
    </AppModal>
  );
};

export default PclUpdateModal;
