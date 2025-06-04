import React, { useCallback, useEffect, useRef, useState } from "react";
import attrApis, { CreateProductAttr } from "../../api_dev/attrs.api";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import pclApi from "../../api_dev/pcl.api";
import seriesApis from "../../api_dev/series.api";
import Spreadsheet from "react-spreadsheet";
import { getObjectFromRowFormData } from "../../util";
import { INPUT_TYPES } from "../../constant";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes";
const SeriesCreatePage = () => {
  const { getProductCreateAttrPclListApi } = attrApis;
  const { getPclsApi } = pclApi;
  const { createSeriesApi } = seriesApis;
  const { setMessage } = useMessageContext();
  const [selectedPcl, setselectedPcl] = useState<{
    cd: string;
    label: string;
  } | null>(null);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [dropdownOptions, setdropdownOptions] = useState<
    { cd: string; label: string }[]
  >([]);
  const [attrList, setattrList] = useState<CreateProductAttr[]>([]);
  const [cellDataSource, setcellDataSource] = useState<
    { value: string; readOnly: boolean }[][]
  >([]);
  const [spreadColLabels, setspreadColLabels] = useState<string[]>([]);
  const [deafultAddProductNum, setdeafultAddProductNum] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedPcl) return;
    getAttrList(selectedPcl.cd);
  }, [selectedPcl]);

  useEffect(() => {
    updateSpreadSheet(attrList);
  }, [attrList]);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const res = await getPclsApi();
    setdropdownOptions(
      res.data.map((item) => ({ cd: item.cd, label: item.pcl_name }))
    );
    setdropdownOpen(true);
  };

  const handleSelectPcl = (cd) => {
    setdropdownOpen(false);
    const pcl = dropdownOptions.find((item) => item.cd === cd);
    if (!pcl) return;
    setselectedPcl(pcl);
  };

  const getAttrList = async (pcl_cd: string) => {
    const res = await getProductCreateAttrPclListApi({ pcl_cd });
    if (res.result !== "success") return;
    setattrList(res.data.filter((item) => item.is_common === "1"));
  };

  const SPLIT_INDEX = {
    INDEX: 0,
    CD: 1,
    VALUE: 2,
    CONTROL_TYPE: 3,
    SELECT_LIST: 4,
    NOT_NULL: 5,
  };

  const updateSpreadSheet = (attrs: CreateProductAttr[]) => {
    const includedAttrs = [...REQUIRED_ADD_LIST, ...attrs];

    const newDataSource = Array(deafultAddProductNum)
      .fill("")
      .map((_, colIndex) => {
        return includedAttrs
          .filter((item) => item.is_common === "1")
          .map((attr, i) => ({
            value: `${colIndex}-${attr.cd}-${
              attr.default_value === "" ? "null" : attr.default_value
            }-${attr.control_type}-${
              attr.select_list === "" ? "null" : attr.select_list
            }-${attr.not_null}`,
            readOnly: true,
          }));
      });
    setspreadColLabels(includedAttrs.map((item) => item.name));
    console.log(newDataSource);
    setcellDataSource(newDataSource);
  };

  const handleSubmit = useCallback(
    async (e) => {
      if (!selectedPcl) return;
      const values = getObjectFromRowFormData(e);
      let productMap = {};
      Object.keys(values).map((item) => {
        const productIndex = item.split("-")[1];
        productMap[productIndex] = {};
      });
      Object.entries(values).map(([key, value]) => {
        const productIndex = key.split("-")[1];
        const attr_cd = key.split("-")[0];
        const attr_value = value ?? "";
        productMap[productIndex][attr_cd] = attr_value;
      });
      console.log(productMap);
      const products: { [key: string]: string }[] = Object.values(productMap);
      const res = await createSeriesApi({
        body: {
          pcl_cd: selectedPcl.cd,
          products: products,
        },
      });
      if (res.result !== "success") return;
      setMessage("シリーズの登録に成功しました");
      navigate(AppRoutes.serisListPage);
    },
    [selectedPcl]
  );

  const handleAddRow = () => {
    setdeafultAddProductNum((pre) => pre + 1);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <AppDropDownList
          open={dropdownOpen}
          onClose={() => setdropdownOpen(false)}
          onSelect={handleSelectPcl}
          options={dropdownOptions}
        >
          <button onClick={(e) => handleClick(e)}>
            {selectedPcl ? selectedPcl.label : "商品分類を選択する"}
          </button>
        </AppDropDownList>
        {selectedPcl && attrList.length && (
          <Spreadsheet
            Table={(e) => {
              return <div tabIndex={-1}>{e.children}</div>;
            }}
            columnLabels={spreadColLabels}
            className=" animate-none"
            DataViewer={({ column, row, setCellData, cell }, i) => {
              if (!cellDataSource[row]) return;
              if (!cellDataSource[row][column]) return;
              const cellPropaty = cellDataSource[row][column].value.split("-");

              return getAttrInput({
                cd: `${cellPropaty[SPLIT_INDEX.CD]}-${
                  cellPropaty[SPLIT_INDEX.INDEX]
                }`,
                select_list:
                  cellPropaty[SPLIT_INDEX.SELECT_LIST] === "null"
                    ? ""
                    : cellPropaty[SPLIT_INDEX.SELECT_LIST],
                control_type: cellPropaty[SPLIT_INDEX.CONTROL_TYPE],
                value:
                  cellPropaty[SPLIT_INDEX.VALUE] === "null"
                    ? ""
                    : cellPropaty[SPLIT_INDEX.VALUE],
                required: cellPropaty[SPLIT_INDEX.NOT_NULL] === "1",
              });
            }}
            data={cellDataSource}
          />
        )}
        <button type="submit">保存</button>
      </form>
      <button onClick={handleAddRow}>シリーズ追加＋</button>
    </div>
  );
};

export default SeriesCreatePage;

const REQUIRED_ADD_LIST: CreateProductAttr[] = [
  {
    cd: "series_name",
    name: "シリーズ名",
    control_type: "0",
    select_list: "",
    is_common: "1",
    not_null: "1",
    default_value: "",
  },
  {
    cd: "hinban",
    name: "商品コード",
    control_type: "0",
    select_list: "",
    is_common: "1",
    not_null: "1",
    default_value: "",
  },
];

export const getAttrInput = ({
  cd,
  control_type,
  value,
  select_list,
  required,
}: {
  cd: string;
  control_type: string;
  value: string;
  select_list: string;
  required: boolean;
}) => {
  return (
    <>
      {/* Single line input */}
      {control_type === INPUT_TYPES.SINGLE_LINE && (
        <input
          required={required}
          className="input w-full h-full"
          name={cd}
          defaultValue={value}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      )}

      {/* Multi line input */}
      {control_type === INPUT_TYPES.MULTI_LINE && (
        <textarea
          required={required}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          name={cd}
          defaultValue={value}
        />
      )}

      {/* Radio input */}
      {control_type === INPUT_TYPES.RADIO_INPUT && (
        <fieldset>
          {select_list.split(";").map((item, index) => (
            <div key={index}>
              <input
                required={required}
                type="radio"
                name={cd} // Group radios by attribute `cd`
                id={`${cd}-${index}`} // Unique id for each radio
                value={item} // Value for each radio option
                defaultChecked={item === value} // Check if it matches current value
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              />
              <label htmlFor={`${cd}-${index}`}>{item}</label>
            </div>
          ))}
        </fieldset>
      )}

      {/* Combo box (select input) */}
      {control_type === INPUT_TYPES.COMBO_INPUT && (
        <select
          required={required}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          name={cd}
          defaultValue={value}
        >
          {select_list.split(";").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}

      {/* Number input */}
      {control_type === INPUT_TYPES.NUMBER_INPUT && (
        <input
          required={required}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          defaultValue={value}
          name={cd}
          type="number"
        />
      )}

      {/* Date input */}
      {control_type === INPUT_TYPES.DATE_INPUT && (
        <input
          required={required}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="date"
          defaultValue={value}
          name={cd}
        />
      )}

      {/* CheckBox input */}
      {control_type === INPUT_TYPES.CHECKBOX_INPUT && (
        <input
          required={required}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="checkbox"
          defaultChecked={value === "1"}
          name={cd}
        />
      )}
    </>
  );
};
