import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import attrApis from "../../api_dev/attrs.api";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { SkuDetail } from "../../api_dev/sku.api";
import AppAttrInput from "../AppAttrInput/AppAttrInput";
import AppButton from "../AppButton/AppButton";
import { ProductAttr } from "../../api/product.api";
type Props = {
  updateDetail: () => void;
  attrList: ProductAttr[];
};
const AppAttrList = ({ updateDetail, attrList }: Props) => {
  const { getProductAttrsApi, updateProductAttrsApi } = attrApis;
  const { series_cd, sku_cd } = useParams();
  const context = useMessageContext();
  console.log(attrList);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // const formValues = Object.fromEntries(
    //   Array.from(formData.entries()).map(([key, value]) => {
    //     // Check if the input was a checkbox and convert to "1" or "0"
    //     const element = event.currentTarget.elements.namedItem(
    //       key
    //     ) as HTMLInputElement;
    //     if (element && element.type === "checkbox") {
    //       return [key, element.checked ? "1" : "0"];
    //     }
    //     return [key, value];
    //   })
    // );
    // // Loop through all attributes to build formValues
    // attrList.forEach((attr) => {
    //   const element = event.currentTarget.elements.namedItem(
    //     attr.cd
    //   ) as HTMLInputElement;
    //   // Handle checkboxes
    //   if (element && element.type === "checkbox") {
    //     formValues[attr.cd] = element.checked ? "1" : "0";
    //   } else {
    //     // Handle other input types
    //     const value = formData.get(attr.cd);
    //     formValues[attr.cd] = value ? String(value) : ""; // Ensure string type
    //   }
    // });
    // const request = {
    //   body: {
    //     product_cd: product.cd,
    //     attrs: Object.entries(formValues).map(([key, value]) => ({
    //       cd: key,
    //       value: value as string,
    //     })),
    //   },
    // };
    // const res = await updateProductAttrsApi(request);
    // if (res.result !== "success")
    //   return context.setMessage("更新に失敗しました");
    // context.setMessage("更新に成功しました");
  };

  return (
    <div className="w-full">
      {attrList.length > 0 && (
        <form className="flex flex-col w-full px-4" onSubmit={handleSubmit}>
          <div className="border-b border-gray-300 my-2"></div>
          {attrList.map((attr, i) => (
            <div key={i} className="w-full ">
              {sku_cd && attr.attr.attrpcl[0].atp_is_common === "1" ? (
                <div className="flex bg-red-50 w-full">
                  <div className="font-bold w-1/2">{attr.attr.atr_name}</div>
                  <div className="w-1/2">{attr.atv_value}</div>
                </div>
              ) : (
                <div className="flex w-full">
                  {/* Label for the attribute */}
                  <div className="w-1/2 font-bold flex">
                    {attr.attr.atr_name}
                  </div>
                  <div className="w-1/2">
                    <AppAttrInput
                      cd={attr.attr.atr_cd}
                      select_list={attr.attr.atr_select_list}
                      default_value={attr.atv_value}
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

export default AppAttrList;
