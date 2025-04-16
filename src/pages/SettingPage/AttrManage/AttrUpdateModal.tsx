import { useState } from "react";
import AppModal from "../../../components/AppModal/AppModal";
import AppInput from "../../../components/AppInput/AppInput";
import AppSelect from "../../../components/AppSelect/AppSelect";
import {
  INPUT_STRING_TO_TYPE,
  INPUT_TYPE_TO_STRING,
  INPUT_TYPES,
} from "../../../constant";
import AppButton from "../../../components/AppButton/AppButton";
import { SelectValues } from "./AttrCreateModal";
import { useMessageContext } from "../../../providers/MessageContextProvider";
import { udpateAttrApi } from "../../../api/attr.api";
type Props = {
  selectedAttr: {
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
  } | null;
  onClose: () => void;
  onUpdate: () => void;
};

const SignToValue = (sign: string) => {
  if (sign === "〇") return "1";
  if (sign === "✕") return "0";
  return "";
};
const AttrUpdateModal = ({ selectedAttr, onClose, onUpdate }: Props) => {
  if (!selectedAttr) return null;
  const {
    cd,
    name,
    is_with_unit,
    unit,
    control_type,
    not_null,
    max_length,
    default_value,
    created_at,
    updated_at,
    select_list,
  } = selectedAttr;
  const [isUnitInput, setisUnitInput] = useState(
    SignToValue(is_with_unit) === "1" ? true : false
  );
  const valuedControlType = INPUT_STRING_TO_TYPE.get(
    control_type as
      | "単数行テキスト"
      | "複数行テキスト"
      | "コンボ選択"
      | "ラジオ選択"
      | "チェック選択"
      | "数値"
      | "日付"
  );
  const [selectedControlType, setselectedControlType] =
    useState(valuedControlType);
  const context = useMessageContext();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      atr_cd: cd,
      atr_name: formData.get("atr_name")?.toString() ?? "",
      attr_is_with_unit: formData.get("attr_is_with_unit") ? "1" : "0",
      atr_control_type: formData.get("atr_control_type")?.toString() ?? "",
      atr_not_null: formData.get("atr_not_null")?.toString() ? "1" : "0",
      atr_max_length: formData.get("atr_max_length")?.toString() ?? "",
      atr_select_list: formData.get("atr_select_list")?.toString() ?? "",
      atr_default_value: formData.get("atr_default_value")?.toString() ?? "",
      atr_unit: formData.get("atr_unit")?.toString() ?? "",
    };
    console.log(values);
    const res = await udpateAttrApi({ body: values });
    onUpdate();
    context.setMessage(res.message);
  };

  return (
    <AppModal
      open={!!selectedAttr}
      onClose={() => onClose()}
      title={"項目の編集"}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-end flex-col"
      >
        <AppInput
          require
          type="text"
          name="atr_name"
          label="属性名"
          defaultValue={name}
        />
        <AppInput
          defaultValue={SignToValue(is_with_unit)}
          type="checkbox"
          name="attr_is_with_unit"
          label="単位あり"
          onChange={(e) => setisUnitInput(e.target.checked)}
        />
        {isUnitInput && (
          <AppInput
            type={"text"}
            name={"atr_unit"}
            label={"単位"}
            defaultValue={unit}
          />
        )}

        <AppSelect
          options={Array.from(INPUT_TYPE_TO_STRING.entries()).map(
            ([cd, label]) => {
              return { label, cd };
            }
          )}
          defaultValue={valuedControlType}
          name={"atr_control_type"}
          label={"入力タイプ"}
          onChange={(e) => setselectedControlType(e.target.value as any)}
        />

        {(selectedControlType === INPUT_TYPES.COMBO_INPUT ||
          selectedControlType === INPUT_TYPES.RADIO_INPUT) && (
          <div className="flex justify-between my-5">
            <label className="mx-10" htmlFor={"atr_select_list"}>
              リスト候補
            </label>
            <SelectValues defaultValue={select_list} />
          </div>
        )}

        <AppInput
          type="checkbox"
          name="atr_not_null"
          label="必須項目"
          defaultValue={SignToValue(not_null)}
        />
        <AppInput
          type="number"
          name="atr_max_length"
          label="最大文字数"
          defaultValue={max_length ? max_length.toString() : ""}
        />
        <AppInput
          type="text"
          name="atr_default_value"
          label="デフォルト値"
          defaultValue={default_value}
        />
        <AppButton
          text={"更新"}
          onClick={() => {}}
          isForm={true}
          className="px-5 mt-5"
          type={"primary"}
        />
      </form>
    </AppModal>
  );
};

export default AttrUpdateModal;
