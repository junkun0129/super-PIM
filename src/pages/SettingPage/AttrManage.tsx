import React, { useEffect, useState } from "react";
import AppTable from "../../components/AppTable/AppTable";
import { Column } from "../../components/AppTable/type";
import attrApis from "../../api_dev/attrs.api";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import AppModal from "../../components/AppModal/AppModal";
import { AttributeTable } from "../../data/attributes/attribute";
import { getObjectFromRowFormData } from "../../util";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { INPUT_TYPE_TO_STRING, INPUT_TYPES } from "../../constant";
type Row = {
  cd: string;
  name: string;
  action: JSX.Element;
};

const columns: Column<Row>[] = [
  { accessor: "cd", header: "項目コード" },
  { accessor: "name", header: "項目名" },
  { accessor: "action", header: "" },
];
const dropdownOption: { cd: string; label: string }[] = [
  { cd: "0", label: "編集" },
  { cd: "1", label: "削除" },
];
const AttrManage = () => {
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const { getAllAttrsApi, getAttrDetailApi, updateAttrApi } = attrApis;
  const [selectedAttr, setselectedAttr] = useState<null | AttributeTable>(null);
  const { setMessage } = useMessageContext();
  const [selectListInput, setselectListInput] = useState(false);
  useEffect(() => {
    getAttributes();
  }, []);

  const handleSelectOption = async (key: string, attr: AttributeTable) => {
    if (key === "0") {
      setselectedAttr(attr);
    }
  };

  const getAttributes = async () => {
    const res = await getAllAttrsApi();
    if (res.result !== "success") return;
    const newDataSource: Row[] = res.data.map((item) => {
      return {
        cd: item.cd,
        name: item.name,
        action: (
          <AppDropDownList
            onSelect={(e) => handleSelectOption(e, item)}
            options={dropdownOption}
          >
            <button>：</button>
          </AppDropDownList>
        ),
      };
    });
    setdataSource(newDataSource);
  };

  const handleSave = async () => {
    if (!selectedAttr) return;
    const res = await updateAttrApi({ attr: selectedAttr });
    if (res.result !== "success") return;
    setselectedAttr(null);
    setMessage("項目情報の更新に成功しました");
    getAttributes();
  };
  return (
    <div>
      <AppTable
        data={dataSource}
        columns={columns}
        onRowClick={() => {}}
        currentPage={1}
        pagination={10}
        total={0}
        onCurrentPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
        onPaginationChange={function (pagination: number): void {
          throw new Error("Function not implemented.");
        }}
      />
      <AppModal open={!!selectedAttr} onClose={() => setselectedAttr(null)}>
        {selectedAttr && (
          <>
            {Object.entries(ATTR_TO_LABEL).map(([key, value]) => {
              if (key === "select_list") {
                if (
                  selectedAttr.control_type === INPUT_TYPES.COMBO_INPUT ||
                  selectedAttr.control_type === INPUT_TYPES.RADIO_INPUT
                ) {
                  return (
                    <div key={key}>
                      <label>{ATTR_TO_LABEL[key]}</label>
                      {selectedAttr[key].split(";").map((item, i) => (
                        <div key={item + i}>{item}</div>
                      ))}
                      {selectListInput ? (
                        <form
                          onSubmit={(e) => {
                            const value = getObjectFromRowFormData(e);
                            let currentList = selectedAttr.select_list;
                            if (currentList === "") {
                              currentList = value["selectlist"] as string;
                            } else {
                              currentList += ";" + value["selectlist"];
                            }
                            setselectedAttr((pre) => ({
                              ...pre,
                              select_list: currentList,
                            }));
                            setselectListInput(false);
                          }}
                          className="flex"
                        >
                          <input name="selectlist" onChange={(e) => {}} />
                          <button type="submit">保存</button>
                        </form>
                      ) : (
                        <div onClick={() => setselectListInput(true)}>+</div>
                      )}
                    </div>
                  );
                } else {
                  return;
                }
              }
              if (key === "max_length") {
                return (
                  <div key={key}>
                    <label>{value}</label>
                    <input
                      type="number"
                      value={selectedAttr[key]}
                      onChange={(e) =>
                        setselectedAttr((pre) => ({
                          ...pre,
                          [key]: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                );
              }

              if (key === "not_null") {
                return (
                  <div key={key}>
                    <label>{value}</label>
                    <input
                      type="checkbox"
                      checked={selectedAttr.not_null === "1" ? true : false}
                      onChange={(e) =>
                        setselectedAttr((pre) => ({
                          ...pre,
                          [key]: e.target.checked ? "1" : "0",
                        }))
                      }
                    />
                  </div>
                );
              }
              if (key === "control_type") {
                return (
                  <div key={key}>
                    <select
                      value={selectedAttr.control_type}
                      onChange={(e) =>
                        setselectedAttr((pre) => ({
                          ...pre,
                          [key]: e.target.value,
                        }))
                      }
                    >
                      {Array.from(INPUT_TYPE_TO_STRING).map(([key, value]) => {
                        return (
                          <option value={key} key={key}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label>{value}</label>
                  <input
                    value={selectedAttr[key]}
                    onChange={(e) =>
                      setselectedAttr((pre) => ({
                        ...pre,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            })}
            <button onClick={handleSave}>保存</button>
          </>
        )}
      </AppModal>
    </div>
  );
};

const ATTR_TO_LABEL = {
  name: "項目名",
  unit: "単位",
  control_type: "入力タイプ",
  not_null: "必須入力",
  max_length: "最大入力文字",
  select_list: "選択肢",
};

export default AttrManage;
