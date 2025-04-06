import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import attrApis, { ProductAttrList } from "../../api_dev/attrs.api";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { SeriesDetail } from "../../api_dev/series.api";
import { SkuDetail } from "../../api_dev/sku.api";
import AppAttrInput from "../AppAttrInput/AppAttrInput";
import AppButton from "../AppButton/AppButton";
type Props = {
  updateDetail: () => void;
  product: SkuDetail | SeriesDetail;
};
const AppAttrList = ({ updateDetail, product }: Props) => {
  const { getProductAttrsApi, updateProductAttrsApi } = attrApis;
  const { series_cd, sku_cd } = useParams();
  const [attrs, setAttrs] = useState<ProductAttrList[]>([]);
  const context = useMessageContext();

  useEffect(() => {
    getAttrs();
  }, [product]);

  const getAttrs = async () => {
    const res = await getProductAttrsApi({
      body: { product_cd: product.cd },
    });
    if (res.result !== "success") return;
    if (series_cd) {
      setAttrs(res.data.filter((item) => item.is_common === "1"));
    } else {
      setAttrs(res.data);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => {
        // Check if the input was a checkbox and convert to "1" or "0"
        const element = event.currentTarget.elements.namedItem(
          key
        ) as HTMLInputElement;
        if (element && element.type === "checkbox") {
          return [key, element.checked ? "1" : "0"];
        }
        return [key, value];
      })
    );
    // Loop through all attributes to build formValues
    attrs.forEach((attr) => {
      const element = event.currentTarget.elements.namedItem(
        attr.cd
      ) as HTMLInputElement;

      // Handle checkboxes
      if (element && element.type === "checkbox") {
        formValues[attr.cd] = element.checked ? "1" : "0";
      } else {
        // Handle other input types
        const value = formData.get(attr.cd);
        formValues[attr.cd] = value ? String(value) : ""; // Ensure string type
      }
    });
    const request = {
      body: {
        product_cd: product.cd,
        attrs: Object.entries(formValues).map(([key, value]) => ({
          cd: key,
          value: value as string,
        })),
      },
    };

    const res = await updateProductAttrsApi(request);

    if (res.result !== "success")
      return context.setMessage("更新に失敗しました");
    context.setMessage("更新に成功しました");
  };

  return (
    <div className="w-full">
      {attrs.length > 0 && (
        <form className="flex flex-col w-full px-4" onSubmit={handleSubmit}>
          <div className="border-b border-gray-300 my-2"></div>
          {attrs.map((attr, i) => (
            <div key={i} className="w-full ">
              {sku_cd && attr.is_common === "1" ? (
                <div className="flex bg-red-50 w-full">
                  <div className="font-bold w-1/2">{attr.name}</div>
                  <div className="w-1/2">{attr.value}</div>
                </div>
              ) : (
                <div className="flex w-full">
                  {/* Label for the attribute */}
                  <div className="w-1/2 font-bold flex">{attr.name}</div>
                  <div className="w-1/2">
                    <AppAttrInput
                      cd={attr.cd}
                      select_list={attr.select_list}
                      value={attr.value}
                      control_type={attr.control_type}
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
