import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import attrApis, { ProductAttrList } from "../../api_dev/attrs.api";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { INPUT_TYPES } from "../../constant";
import AppDropDownList from "../AppDropDownList/AppDropDownList";
import pclApis from "../../api_dev/pcl.api";
import seriesApis, { SeriesDetail } from "../../api_dev/series.api";
import productApis from "../../api_dev/product.api";
import { queryParamKey } from "../../routes";
import { SkuDetail } from "../../api_dev/sku.api";
import AppAttrInput from "../AppAttrInput/AppAttrInput";
type Props = {
  updateDetail: () => void;
  product: SkuDetail | SeriesDetail;
};
const AppAttrList = ({ updateDetail, product }: Props) => {
  const { getProductAttrsApi, updateProductAttrsApi } = attrApis;
  const { series_cd, sku_cd } = useParams();
  const [attrs, setAttrs] = useState<ProductAttrList[]>([]);
  const context = useMessageContext();
  const { getPclsApi } = pclApis;
  const { updateProductPclApi } = productApis;
  const [query, setQuery] = useSearchParams();
  const [dropDownOptions, setdropDownOptions] = useState<
    {
      cd: string;
      label: string;
    }[]
  >([]);
  const [dropdownOpen, setdropdownOpen] = useState(false);

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

  const handleClick = async () => {
    const res = await getPclsApi();
    setdropDownOptions(
      res.data.map((item) => {
        return {
          label: item.pcl_name,
          cd: item.cd,
        };
      })
    );
    setdropdownOpen(true);
  };

  const handleChangePcl = async (cd) => {
    const res = await updateProductPclApi({
      product_cd: product.cd,
      pcl_cd: cd,
    });
    if (res.result === "success") {
      setdropdownOpen(false);
      context.setMessage("商品分類を変更しました");
      updateDetail();
      getAttrs();
    }
  };
  return (
    <div>
      <div>共通項目</div>
      <AppDropDownList
        open={dropdownOpen}
        onSelect={handleChangePcl}
        options={dropDownOptions}
      >
        {sku_cd && product.is_series === "1" ? (
          <div>商品項目名：{product.pcl_name}</div>
        ) : (
          <button onClick={handleClick}>{product.pcl_name}</button>
        )}
      </AppDropDownList>
      {attrs.length > 0 && (
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {attrs.map((attr, i) => (
            <label key={"series-detail-attrlist-" + i}>
              {sku_cd && attr.is_common === "1" ? (
                <div className="rounded p-3 bg-gray-100">
                  {attr.name}:{attr.value}
                </div>
              ) : (
                <>
                  {/* Label for the attribute */}
                  {attr.name + "："}
                  <AppAttrInput
                    cd={attr.cd}
                    select_list={attr.select_list}
                    value={attr.value}
                    control_type={attr.control_type}
                  />
                </>
              )}
            </label>
          ))}
          <button type="submit">更新</button>
        </form>
      )}
    </div>
  );
};

export default AppAttrList;
