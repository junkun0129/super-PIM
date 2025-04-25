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
  { accessor: "action", header: "順番" },
  { accessor: "name", header: "項目名" },
  { accessor: "alter_name", header: "表示名" },
  { accessor: "is_common", header: "必須項目" },
  { accessor: "is_show", header: "非表示にする" },
];
type UpdatedRowData = {
  cd: string;
  alter_name: string;
  is_show: string;
  is_common: string;
  order: number;
};

type UpdatedValueRowData = {
  cd: string;
  key: "alter_name" | "is_common" | "is_show";
  value: string | number;
};

const PclUpdateModal = ({ selectedPclKey, onClose, onUpdate }: Props) => {
  const [page, setpage] = useState<number>(1);
  const [pageSize, setpageSize] = useState<number>(10);
  const [total, settotal] = useState(0);
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  const [updatedRowData, setupdatedRowData] = useState<Row[]>([]);
  const [updatedTextData, setupdatedTextData] = useState<UpdatedValueRowData[]>(
    []
  );
  const [pclName, setpclName] = useState<string>("");
  const tableRef = useRef<HTMLDivElement>(null);
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
    setpclName(res.data.pcl_name);
    const newDataSource: Row[] = res.data.attrpcl.map((item) => {
      return {
        cd: item.atp_cd,
        name: item.attr.atr_name,
        action: <div className=" cursor-move">: : : : </div>,
        order: (
          <input
            key={`${item.atp_cd}-atp_order`}
            id={`${item.atp_cd}-atp_order`}
            defaultValue={item.atp_order}
            className="hidden"
            name={item.atp_order.toString()}
          />
        ),
        alter_name: (
          <input
            key={`${item.atp_cd}-atp_alter_name`}
            id={`${item.atp_cd}-atp_alter_name`}
            defaultValue={item.atp_alter_name.toString()}
            name={`${item.atp_alter_name}`}
            className="border border-slate-400 p-1px-2"
            onBlur={(e) => handleBlur(e, "alter_name", item.atp_cd)}
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
            onBlur={(e) => handleBlur(e, "is_common", item.atp_cd)}
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
            onBlur={(e) => handleBlur(e, "is_show", item.atp_cd)}
          />
        ),
      };
    });
    console.log(newDataSource, "newDataSource");
    setdataSource(newDataSource);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    key: "alter_name" | "is_common" | "is_show",
    cd: string
  ) => {
    let value: string | number;
    if (key === "is_common" || key === "is_show") {
      value = e.target.checked ? 1 : 0;
    }

    if (key === "alter_name") {
      value = e.target.value;
    }
    setupdatedTextData((pre) => {
      let newData: UpdatedValueRowData[];
      if (pre.some((item) => item.cd === cd && item.key === key)) {
        const newIncludedData = pre.map((item) => {
          if (item.cd === cd && item.key === key) {
            return { ...item, value };
          }
          return { ...item };
        });
        newData = [...newIncludedData];
      } else {
        newData = [...pre, { key, cd, value }];
      }
      return newData;
    });
  };

  const handleDrop = ({
    activeCd,
    overCd,
    updatedRowData,
    updatedTextData,
  }: {
    activeCd: string;
    overCd: string;
    updatedTextData: UpdatedValueRowData[];
    updatedRowData: Row[];
  }) => {
    const swapedArray = moveBehindByKey(
      [...dataSource],
      activeCd,
      overCd,
      "cd"
    );

    let newDataSource = changeOrderByOrder(swapedArray, "order");

    if (updatedTextData.length) {
      updatedTextData.forEach((item) => {
        const index = newDataSource.findIndex((data) => data.cd === item.cd);
        console.log(`${item.cd}-atp_${item.key}`);
        if (index === -1) return;
        newDataSource[index][item.key] = (
          <input
            key={`${item.cd}-atp_${item.key}`}
            {...(item.key === "is_common" || item.key === "is_show"
              ? {
                  defaultChecked: !!item.value,

                  type: "checkbox",
                  className: "w-[20px] h-[20px] flex items-center",
                }
              : {})}
            {...(item.key === "alter_name"
              ? {
                  defaultValue: item.value,
                  className: "border border-slate-400 p-1px-2",
                }
              : {})}
            name={item.value.toString()}
            id={`${item.cd}-atp_${item.key}`}
            data-row={";lkj"}
            onBlur={(e) => handleBlur(e, item.key, item.key)}
          />
        );
        console.log(newDataSource, "newdata");
      });
    }

    let newUpdatedRowData: Row[] = [...updatedRowData];
    newDataSource.forEach((newdata) => {
      if (newUpdatedRowData.map((item) => item.cd).includes(newdata.cd)) {
        const index = newUpdatedRowData.findIndex(
          (item) => item.cd === newdata.cd
        );
        newUpdatedRowData[index] = newdata;
      } else {
        newUpdatedRowData.push(newdata);
      }
    });
    setupdatedRowData(newUpdatedRowData);
    setupdatedTextData([]);
    setdataSource(newDataSource);
  };

  const handleSubmit = async (attrs: Row[], pcl_name: string) => {
    if (!tableRef) return;

    const newAttrs = attrs.map((attr) => {
      const alterName = document
        .getElementById(`${attr.cd}-atp_alter_name`)
        ?.getAttribute("name");

      const isShow = document
        .getElementById(`${attr.cd}-atp_is_show`)
        .getAttribute("name");
      const isCommon = document
        .getElementById(`${attr.cd}-atp_is_common`)
        ?.getAttribute("name");
      const order = document
        .getElementById(`${attr.cd}-atp_order`)
        ?.getAttribute("name");
      return {
        atp_cd: attr.cd,
        atp_is_show: !!isShow ? "1" : "0",
        atp_alter_name: alterName ? alterName.toString() : "",
        atp_is_common: !!isCommon ? "1" : "0",
        atp_order: isNaN(parseInt(order)) ? 0 : parseInt(order),
      };
    });

    console.log(newAttrs, "newattrs");
    const body = {
      pcl_cd: selectedPclKey,
      pcl_name,
      attrs: newAttrs,
    };

    const res = await updatePclApi({ body });
    if (res.result !== "success") return;
    setselectedKeys([]);
    onClose();
    onUpdate();
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
      <div ref={tableRef}>
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
          onDrop={({ activeCd, overCd }) =>
            handleDrop({ activeCd, overCd, updatedRowData, updatedTextData })
          }
          checkable={false}
          draggableAccesor="action"
          currentPage={page}
          pagination={pageSize}
          total={10}
          onCurrentPageChange={(page) => setpage(page)}
          onPaginationChange={(pageSize) => setpageSize(pageSize)}
        />
      </div>
      <AppButton
        text={"確定"}
        isForm={true}
        onClick={() => handleSubmit(updatedRowData, pclName)}
        type={"primary"}
      />
    </AppModal>
  );
};

export default PclUpdateModal;
