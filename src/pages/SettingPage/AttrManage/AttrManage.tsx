import React, { useEffect, useState } from "react";
import AppTable from "../../../components/AppTable/AppTable";
import { Column } from "../../../components/AppTable/type";
import attrApis from "../../../api_dev/attrs.api";
import AppDropDownList from "../../../components/AppDropDownList/AppDropDownList";
import AppModal from "../../../components/AppModal/AppModal";
import { AttributeTable } from "../../../data/attributes/attribute";
import {
  flagToText,
  getObjectFromRowFormData,
  isoToDateText,
} from "../../../util";
import { useMessageContext } from "../../../providers/MessageContextProvider";
import { INPUT_TYPE_TO_STRING, INPUT_TYPES } from "../../../constant";
import { getAttrListApi } from "../../../api/attr.api";
import AttrCreateModal from "./AttrCreateModal";
import AppButton from "../../../components/AppButton/AppButton";
import AttrDeleteButton from "./AttrDeleteButton";
import AttrUpdateModal from "./AttrUpdateModal";
type Row = {
  cd: string;
  name: string;
  is_with_unit: string;
  unit: string;
  control_type: string;
  not_null: string;
  max_length: number;
  default_value: string;
  created_at: string;
  updated_at: string;
  select_list: string;
};

const columns: Column<Row>[] = [
  { accessor: "name", header: "項目名" },
  { accessor: "unit", header: "単位" },
  { accessor: "control_type", header: "入力タイプ" },
  { accessor: "not_null", header: "必須項目" },
  { accessor: "is_with_unit", header: "単位アリ" },
  { accessor: "max_length", header: "最大文字数" },
  { accessor: "default_value", header: "デフォルト値" },
  { accessor: "created_at", header: "作成日" },
  { accessor: "updated_at", header: "更新日" },
];

const controls = ["0", "1", "2", "3", "4", "5", "6"];
const AttrManage = () => {
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [pageSize, setpageSize] = useState<number>(10);
  const [page, setpage] = useState<number>(1);
  const [listorder, setlistorder] = useState<"asc" | "desc">("asc");
  const [keywords, setkeywords] = useState<string>("");
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  const [total, settotal] = useState<number>(0);

  const [isCreateAttrOpen, setisCreateAttrOpen] = useState<boolean>(false);
  const [selectedAttr, setselectedAttr] = useState<null | Row>(null);
  const { setMessage } = useMessageContext();
  const [selectListInput, setselectListInput] = useState(false);

  useEffect(() => {
    getAttributes(page, pageSize, listorder, keywords);
  }, [page, pageSize, listorder, keywords]);

  const handleSelectOption = async (key: string, attr: AttributeTable) => {
    if (key === "0") {
      setselectedAttr(attr);
    }
  };

  const getAttributes = async (
    pg: number,
    ps: number,
    or: string,
    kw: string
  ) => {
    const res = await getAttrListApi({ pg, ps, or, kw });
    if (res.result !== "success") return;

    settotal(res.total);

    if (total / page < 1) {
      setpage(1);
    }
    const newDataSource: Row[] = res.data.map((item) => {
      return {
        cd: item.atr_cd,
        name: item.atr_name,
        control_type: controls.includes(item.atr_control_type)
          ? INPUT_TYPE_TO_STRING.get(
              item.atr_control_type as "0" | "1" | "2" | "3" | "4" | "5" | "6"
            )
          : "",
        not_null: flagToText({
          flag: item.atr_not_null,
          okText: "〇",
          notText: "✕",
        }),
        is_with_unit: flagToText({
          flag: item.atr_is_with_unit,
          okText: "〇",
          notText: "✕",
        }),
        unit: item.atr_unit,
        max_length: item.atr_max_length,
        default_value: item.atr_default_value,
        updated_at: isoToDateText(item.atr_updated_at),
        created_at: isoToDateText(item.atr_created_at),
        select_list: item.atr_select_list,
      };
    });
    setdataSource(newDataSource);
  };

  const handleSave = async () => {
    // if (!selectedAttr) return;
    // const res = await updateAttrApi({ attr: selectedAttr });
    // if (res.result !== "success") return;
    // setselectedAttr(null);
    setMessage("項目情報の更新に成功しました");
  };
  return (
    <div>
      <div className="flex">
        <AppButton
          text={"＋ 属性を作成する"}
          className="px-5 mb-1 mr-1"
          onClick={() => setisCreateAttrOpen(true)}
          type={"primary"}
        />
        <AttrDeleteButton
          selectedKeys={selectedKeys}
          updateList={() => {
            setselectedKeys([]);
            getAttributes(page, pageSize, listorder, keywords);
          }}
        />
      </div>
      <AppTable
        data={dataSource}
        columns={columns}
        onRowClick={(cd) => {
          if (!cd) return;
          console.log(cd);
          const selected = dataSource.find((item) => item.cd === cd);
          if (!selected) return;
          console.log(selected);
          setselectedAttr(selected);
        }}
        currentPage={page}
        selectedKeys={selectedKeys}
        onSelectedKeysChange={(keys) => setselectedKeys(keys)}
        pagination={pageSize}
        total={total}
        onCurrentPageChange={(page) => {
          setpage(page);
        }}
        onPaginationChange={(pageSize) => {
          setpageSize(pageSize);
        }}
        onRowClickKey="cd"
        key={"cd"}
      />
      <AttrCreateModal
        open={!!isCreateAttrOpen}
        onClose={() => setisCreateAttrOpen(false)}
        onUpdate={() => {
          setisCreateAttrOpen(false);
          getAttributes(page, pageSize, listorder, keywords);
        }}
      />
      <AttrUpdateModal
        selectedAttr={selectedAttr}
        onClose={() => setselectedAttr(null)}
        onUpdate={() => {
          getAttributes(page, pageSize, listorder, keywords);
        }}
      />
    </div>
  );
};

export default AttrManage;
