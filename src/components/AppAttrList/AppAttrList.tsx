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

                  {/* Single line input */}
                  {attr.control_type === INPUT_TYPES.SINGLE_LINE && (
                    <input
                      className="input"
                      name={attr.cd} // Unique name for the attribute
                      defaultValue={attr.value}
                    />
                  )}

                  {/* Multi line input */}
                  {attr.control_type === INPUT_TYPES.MULTI_LINE && (
                    <textarea name={attr.cd} defaultValue={attr.value} />
                  )}

                  {/* Radio input */}
                  {attr.control_type === INPUT_TYPES.RADIO_INPUT && (
                    <fieldset name={attr.name}>
                      {attr.select_list.split(";").map((item, index) => (
                        <div key={index}>
                          <input
                            type="radio"
                            name={attr.cd} // Group radios by attribute `cd`
                            id={`${attr.cd}-${index}`} // Unique id for each radio
                            value={item} // Value for each radio option
                            defaultChecked={item === attr.value} // Check if it matches current value
                          />
                          <label htmlFor={`${attr.cd}-${index}`}>{item}</label>
                        </div>
                      ))}
                    </fieldset>
                  )}

                  {/* Combo box (select input) */}
                  {attr.control_type === INPUT_TYPES.COMBO_INPUT && (
                    <select name={attr.cd} defaultValue={attr.value}>
                      {attr.select_list.split(";").map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Number input */}
                  {attr.control_type === INPUT_TYPES.NUMBER_INPUT && (
                    <input
                      defaultValue={attr.value}
                      name={attr.cd}
                      type="number"
                    />
                  )}

                  {/* Date input */}
                  {attr.control_type === INPUT_TYPES.DATE_INPUT && (
                    <input
                      type="date"
                      defaultValue={attr.value}
                      name={attr.cd}
                    />
                  )}

                  {/* CheckBox input */}
                  {attr.control_type === INPUT_TYPES.CHECKBOX_INPUT && (
                    <input
                      type="checkbox"
                      defaultChecked={attr.value === "1"}
                      name={attr.cd}
                    />
                  )}
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
