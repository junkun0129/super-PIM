import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useMessageContext } from "../../providers/MessageContextProvider";

import AppAttrInput from "../../components/AppAttrInput/AppAttrInput";
import AppButton from "../../components/AppButton/AppButton";

import AppSelect from "../../components/AppSelect/AppSelect";
import {
  getProductAttrListApi,
  ProductAttr,
  updateProductAttrsApi,
} from "../../api/attr.api";
import { queryParamKey } from "../../routes";
import { ATTR_DISPLAY_MODE } from "../../constant";

type Props = {
  updateDetail: () => void;
  selectedPclCd: string;
};
const ProductAttrList = ({ updateDetail, selectedPclCd }: Props) => {
  const { series_cd, sku_cd } = useParams();
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const attachedCd = query.get(queryParamKey.detailAttched);
  const context = useMessageContext();
  const [displayMode, setdisplayMode] = useState<string>(
    ATTR_DISPLAY_MODE.BOTH
  );
  const [attrList, setattrList] = useState<ProductAttr[]>([]);
  useEffect(() => {
    if (!selectedPclCd) return;
    getAttrList();
  }, [selectedPclCd, displayMode]);

  const getAttrList = async () => {
    const res = await getProductAttrListApi({
      pcl_cd: selectedPclCd,
      series_cd: attachedCd ?? "",
      display_mode: displayMode,
      pr_cd: series_cd ?? sku_cd,
    });
    if (res.result !== "success") return context.setMessage(res.message);
    setattrList(res.data);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(Array.from(formData.entries()));
    const formValues = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => {
        const element = event.currentTarget.elements.namedItem(
          key
        ) as HTMLInputElement;
        if (element && element.type === "checkbox") {
          return [key, element.checked ? "1" : "0"];
        }
        return [key, value];
      })
    );

    Object.entries(formValues).forEach(([atr_cd, value]) => {
      const element = event.currentTarget.elements.namedItem(
        atr_cd
      ) as HTMLInputElement;

      if (element && element.type === "checkbox") {
        formValues[atr_cd] = element.checked ? "1" : "0";
      }
    });

    const res = await updateProductAttrsApi({
      body: {
        pr_cd: series_cd ?? sku_cd,
        attrs: Object.entries(formValues).map(([key, value]) => ({
          atr_cd: key,
          value: value as string,
        })),
      },
    });

    if (res.result !== "success") return context.setMessage(res.message);
    context.setMessage(res.message);
    getAttrList();
  };

  return (
    <div className="w-full">
      {!(!attachedCd && sku_cd) && (
        <div>
          <AppSelect
            defaultValue={ATTR_DISPLAY_MODE.BOTH}
            onChange={(e) => setdisplayMode(e.target.value)}
            options={[
              { cd: ATTR_DISPLAY_MODE.COMMON, label: "共有属性" },
              { cd: ATTR_DISPLAY_MODE.UNIQUE, label: "固有属性" },
              { cd: ATTR_DISPLAY_MODE.BOTH, label: "すべて" },
            ]}
            name={"atr_display_mode"}
          ></AppSelect>
        </div>
      )}
      {attrList.length > 0 && (
        <form className="flex flex-col w-full px-4" onSubmit={handleSubmit}>
          <div className="border-b border-gray-300 my-2"></div>
          {attrList.map((attr, i) => (
            <div key={i} className="w-full ">
              {/* 編集可能な入力欄 */}
              {((!!sku_cd &&
                !attachedCd &&
                displayMode === ATTR_DISPLAY_MODE.UNIQUE) ||
                (!!series_cd &&
                  attr.atp_is_common === ATTR_DISPLAY_MODE.COMMON) ||
                (attachedCd &&
                  attr.atp_is_common === ATTR_DISPLAY_MODE.UNIQUE)) && (
                <div className="flex w-full">
                  {/* Label for the attribute */}
                  <div className="w-1/2 font-bold flex">
                    {attr.attr.atr_name}
                  </div>
                  <div className="w-1/2">
                    <AppAttrInput
                      cd={attr.attr.atr_cd}
                      select_list={attr.attr.atr_select_list}
                      default_value={attr.value ?? ""}
                      control_type={attr.attr.atr_control_type}
                      {...(!!attr.attr.atr_max_length
                        ? { maxLength: attr.attr.atr_max_length }
                        : {})}
                      is_with_unit={attr.attr.atr_is_with_unit}
                      unit={attr.attr.atr_unit}
                    />
                  </div>
                </div>
              )}

              {/* 編集不可な入力欄（シリーズ詳細画面の時の固有項目） */}
              {!!series_cd &&
                attr.atp_is_common === ATTR_DISPLAY_MODE.UNIQUE && (
                  <div className="flex bg-red-50 w-full">
                    <div className="font-bold w-1/2">{attr.attr.atr_name}</div>
                    <div className="w-1/2">
                      ※この値はSKUごとに設定できます。
                    </div>
                  </div>
                )}

              {/* 編集不可な入力欄（SKU詳細画面の時の必須項目項目） */}
              {!!sku_cd && attr.atp_is_common === ATTR_DISPLAY_MODE.COMMON && (
                <div className="flex bg-red-50 w-full">
                  <div className="font-bold w-1/2">{attr.attr.atr_name}</div>
                  <div className="w-1/2">{attr.value ?? ""}</div>
                </div>
              )}
              <div className="border-b border-gray-300 my-2"></div>
            </div>
          ))}
          <div className="w-full flex justify-end">
            <div className="w-[100px] -mr-10">
              <AppButton
                text={"更新"}
                onClick={() => console.log("object")}
                type={"primary"}
                isForm={true}
              ></AppButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductAttrList;
