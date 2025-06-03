import React, { useEffect, useState } from "react";
import AppButton from "../../components/AppButton/AppButton";
import AppPopup from "../../components/AppPopup/AppPopup";
import { AttrFilter } from "../../api/product.api";
import { FilterAttrList, getAttrForPrFilterApi } from "../../api/attr.api";
import AppSelect from "../../components/AppSelect/AppSelect";
import {
  INPUT_TYPES,
  operands,
  operandsLabelForCheck,
  operandsLabelForComboAndRadio,
  operandsLabelForNumberAndDate,
  operandsLabelForText,
} from "../../constant";
type Props = {
  selectedPclCd: string;
};
const AttrFilterButton = ({ selectedPclCd }: Props) => {
  const [openpopup, setopenpopup] = useState(false);
  const [filtered, setfiltered] = useState<AttrFilter[]>([]);
  const [filterAttrsList, setfilterAttrsList] = useState<FilterAttrList[]>([]);
  const [keyword, setkeyword] = useState<string>("");

  useEffect(() => {
    if (!openpopup) return;
    getFilterList();
  }, [openpopup]);

  const getFilterList = async () => {
    const res = await getAttrForPrFilterApi({ selectedPclCd, keyword });
    if (res.result !== "success") return;
    setfilterAttrsList(res.data);
  };

  return (
    <div>
      <AppPopup
        open={openpopup}
        onClose={() => setopenpopup(false)}
        content={
          <FilterList
            selectedFilters={filtered}
            filterList={filterAttrsList}
            setSelectedFilters={(selecteds) => setfiltered((pre) => selecteds)}
          />
        }
      >
        <AppButton
          text="属性フィルター"
          type="normal"
          className="mx-2"
          onClick={() => setopenpopup(true)}
        />
      </AppPopup>
    </div>
  );
};

export default AttrFilterButton;

type FilterListProps = {
  selectedFilters: AttrFilter[];
  filterList: FilterAttrList[];
  setSelectedFilters: (list: AttrFilter[]) => void;
};
const FilterList = ({
  selectedFilters,
  filterList,
  setSelectedFilters,
}: FilterListProps) => (
  <ul>
    {filterList.map((item, i) => {
      const selectedFilter = selectedFilters.find(
        (selected) => selected.attr_cd === item.atr_cd
      );
      let operandsOption: any = { [""]: "" };

      switch (item.atr_control_type) {
        case INPUT_TYPES.SINGLE_LINE || INPUT_TYPES.MULTI_LINE:
          operandsOption = operandsLabelForText;
          break;

        case INPUT_TYPES.CHECKBOX_INPUT:
          operandsOption = operandsLabelForCheck;
          break;

        case INPUT_TYPES.NUMBER_INPUT || INPUT_TYPES.DATE_INPUT:
          operandsOption = operandsLabelForNumberAndDate;
          break;

        case INPUT_TYPES.COMBO_INPUT || INPUT_TYPES.RADIO_INPUT:
          operandsOption = operandsLabelForComboAndRadio;
          break;
      }
      return (
        <li
          key={`${i}-attrfilterlist`}
          className="flex py-1 my-2 justify-between"
        >
          <input
            key={`filterattrcheck-${item.atr_cd}`}
            type="checkbox"
            checked={!!selectedFilter}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked) {
                let newFilters = structuredClone(selectedFilters);
                newFilters.push({
                  attr_cd: item.atr_cd,
                  operand: operands.equal,
                  value: "",
                });
                setSelectedFilters(newFilters);
              } else {
                let newFilters = selectedFilters.filter(
                  (selected) => selected.attr_cd !== item.atr_cd
                );
                setSelectedFilters(newFilters);
              }
            }}
          />
          <label>{item.atr_name}</label>
          {!!selectedFilter && (
            <select
              value={selectedFilter.operand}
              onChange={(e) => {
                const newSelectedFilters = selectedFilters.map((selected) => {
                  if (selected.attr_cd === item.atr_cd) {
                    return { ...selected, operand: e.target.value };
                  }
                  return selected;
                });
                setSelectedFilters(newSelectedFilters);
              }}
            >
              {Object.entries(operandsOption).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          )}
          {!!selectedFilter &&
            selectedFilter.operand !== operands.contains &&
            selectedFilter.operand !== operands.notContains && (
              <input
                type={
                  selectedFilter.operand === operands.lessThan ||
                  selectedFilter.operand === operands.greaterThan ||
                  selectedFilter.operand === operands.greaterThanOrEqual ||
                  selectedFilter.operand === operands.lessThanOrEqual
                    ? "number"
                    : "text"
                }
              />
            )}
        </li>
      );
    })}
  </ul>
);
