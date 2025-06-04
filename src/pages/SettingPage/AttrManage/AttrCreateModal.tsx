import React, { useEffect, useRef, useState } from "react";
import AppModal from "../../../components/AppModal/AppModal";
import AppInput from "../../../components/AppInput/AppInput";
import AppSelect from "../../../components/AppSelect/AppSelect";
import { INPUT_TYPE_TO_STRING, INPUT_TYPES } from "../../../constant";
import AppButton from "../../../components/AppButton/AppButton";
import { createAttrApi } from "../../../api/attr.api";
import { useMessageContext } from "../../../providers/MessageContextProvider";
type Props = {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
};
const AttrCreateModal = ({ open, onClose, onUpdate }: Props) => {
  const [isUnitInput, setisUnitInput] = useState(false);
  const context = useMessageContext();
  const [selectedControlType, setselectedControlType] = useState<string>(
    INPUT_TYPES.SINGLE_LINE
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = [
      {
        atr_name: formData.get("atr_name")?.toString() ?? "",
        attr_is_with_unit: formData.get("attr_is_with_unit") ? "1" : "0",
        atr_unit: formData.get("atr_unit")?.toString() ?? "",
        atr_control_type: formData.get("atr_control_type")?.toString() ?? "",
        atr_select_list: formData.get("atr_select_list")?.toString() ?? "",
        atr_not_null: formData.get("atr_not_null")?.toString() ? "1" : "0",
        atr_max_length: formData.get("atr_max_length")?.toString() ?? "",
        atr_default_value: formData.get("atr_default_value")?.toString() ?? "",
      },
    ];

    const res = await createAttrApi({ body: values });
    onUpdate();
    context.setMessage(res.message);
  };
  return (
    <AppModal open={open} title="属性の作成" onClose={() => onClose()}>
      <>
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-end flex-col"
        >
          <AppInput require type="text" name="atr_name" label="属性名" />
          <AppInput
            type="checkbox"
            name="attr_is_with_unit"
            label="単位あり"
            onChange={(e) => setisUnitInput(e.target.checked)}
          />
          {isUnitInput && (
            <AppInput type={"text"} name={"atr_unit"} label={"単位"} />
          )}

          <AppSelect
            options={Array.from(INPUT_TYPE_TO_STRING.entries()).map(
              ([cd, label]) => {
                return { label, cd };
              }
            )}
            name={"atr_control_type"}
            label={"入力タイプ"}
            onChange={(e) => setselectedControlType(e.target.value)}
          />

          {(selectedControlType === INPUT_TYPES.COMBO_INPUT ||
            selectedControlType === INPUT_TYPES.RADIO_INPUT) && (
            <div className="flex justify-between my-5">
              <label className="mx-10" htmlFor={"atr_select_list"}>
                リスト候補
              </label>
              <SelectValues />
            </div>
          )}

          <AppInput type="checkbox" name="atr_not_null" label="必須項目" />
          <AppInput type="number" name="atr_max_length" label="最大文字数" />
          <AppInput type="text" name="atr_default_value" label="デフォルト値" />
          <AppButton
            text={"作成"}
            onClick={() => {}}
            isForm={true}
            className="px-5 mt-5"
            type={"primary"}
          />
        </form>
      </>
    </AppModal>
  );
};

export default AttrCreateModal;

export const SelectValues = ({ defaultValue }: { defaultValue?: string }) => {
  const [isInputApper, setisInputApper] = useState<boolean>(false);
  const [optionValues, setoptionValues] = useState<string>(defaultValue ?? "");
  const addInputRef = useRef<HTMLInputElement>(null);
  const outInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    outInput.current.value = optionValues;
  }, [optionValues]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = e.target.value;
    if (value && !value.includes(";") && !optionValues.includes(value)) {
      setoptionValues((pre) => (pre === "" ? value : `${pre};${value}`));
    }
    setisInputApper(false);
    addInputRef.current.value = "";
  };

  const handleDelete = (value: string, options: string) => {
    if (options.includes(";")) {
      const newOptions = options.replace(`;${value}`, "");
      setoptionValues(newOptions);
    } else {
      setoptionValues("");
    }
  };
  return (
    <>
      <input name={"atr_select_list"} ref={outInput} className="hidden" />
      <div className="w-full ml-4">
        {optionValues.includes(";")
          ? optionValues.split(";").map((item, i) => {
              return (
                <div
                  key={item + i}
                  className="flex justify-between w-[75%]  my-1 p-1 mx-10  bg-gray-200 rounded-md"
                >
                  <div className="ml-2">{item}</div>
                  <button
                    className="w-[10px] h-[10px] mx-2"
                    onClick={() => handleDelete(item, optionValues)}
                  >
                    ✕
                  </button>
                </div>
              );
            })
          : optionValues !== "" && (
              <div className="flex justify-between my-1 w-[75%] p-1 mx-10  bg-gray-200 rounded-md">
                <div className="ml-2">{optionValues}</div>
                <button
                  className="w-[10px] h-[10px] mx-2"
                  onClick={() => handleDelete(optionValues, optionValues)}
                >
                  ✕
                </button>
              </div>
            )}
        {isInputApper && (
          <input
            autoFocus
            className="border border-gray-500 p-1 px-3 mt-3 mx-10"
            ref={addInputRef}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Enterで送信されないようにする
              }
            }}
          />
        )}

        {!isInputApper && (
          <AppButton
            text={"＋ 追加"}
            onClick={() => {
              setisInputApper(true);
            }}
            className="w-[74.5%] h-[10px] mt-3 ml-[42px]"
            type={"normal"}
          />
        )}
      </div>
    </>
  );
};
