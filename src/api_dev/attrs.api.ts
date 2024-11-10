import { AttributeTable } from "../data/attributes/attribute";
import { attributeData } from "../data/attributes/attributes.data";
import { attrPclData } from "../data/attrpcls/attrpcls";
import { attrValueData } from "../data/attrvalues/attrvalues";
import { AttrValueTable } from "../data/attrvalues/type";
import { productData } from "../data/sku/product.data";
import { generateRandomString } from "../util";

export type ProductAttrList = {
  cd: string;
  name: string;
  value: string;
  control_type: string;
  select_list: string;
  is_show: string;
  is_common: string;
};

const getAllAttrsApi = (): Promise<{
  data: AttributeTable[];
  result: string;
  message?: string;
}> => {
  return new Promise((resolve, reject) => {
    resolve({ data: [...attributeData], result: "success" });
  });
};

const createAttrApi = ({
  body,
}: {
  body: {
    name: string;
    is_with_unit: string;
    control_type: string;
    not_null: string;
    max_length: number;
    select_list: string;
    default_value: string;
    unit: string;
  };
}): Promise<{ result: string; massage?: string }> => {
  return new Promise((resolve, reject) => {
    const {
      name,
      is_with_unit,
      control_type,
      not_null,
      max_length,
      select_list,
      default_value,
      unit,
    } = body;
    const cd = generateRandomString(35);
    const created_at = new Date().toString();
    const newAttr: AttributeTable = {
      cd,
      name,
      created_at,
      is_delete: "0",
      is_with_unit,
      control_type,
      not_null,
      max_length,
      select_list,
      default_value,
      unit,
      updated_at: "",
    };
    attributeData.push(newAttr);
    resolve({ result: "success" });
  });
};

const getAttrDetailApi = ({
  attr_cd,
}: {
  attr_cd: string;
}): Promise<{ data?: AttributeTable; result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const attribute = attributeData.find((item) => item.cd === attr_cd);
    if (attribute) {
      resolve({ result: "success", data: attribute });
    } else {
      resolve({ message: "項目が孫座しませんでした", result: "failed" });
    }
  });
};

const deleteAttrApi = ({
  attr_cd,
}: {
  attr_cd: string;
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const filtered = attrPclData.filter((item) => item.attr_cd === attr_cd);
    if (filtered.length) {
      resolve({
        result: "failed",
        message: "洗濯された項目が紐づいている商品分類があります",
      });
    } else {
      const newAttrs = attributeData.filter((item) => item.cd !== attr_cd);
      attributeData.splice(0, attributeData.length, ...newAttrs);
      resolve({ result: "success" });
    }
  });
};

const updateAttrApi = ({
  attr,
}: {
  attr: AttributeTable;
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const newAttrs = attributeData.map((item) => {
      if (item.cd === attr.cd) {
        return attr;
      }
      return item;
    });
    attributeData.splice(0, newAttrs.length, ...newAttrs);

    resolve({ result: "success" });
  });
};

const updateProductAttrsApi = ({
  body: { product_cd, attrs },
}: {
  body: {
    product_cd: string;
    attrs: { cd: string; value: string }[];
  };
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    console.log(attrValueData, "before");

    const updatedAttrValues: AttrValueTable[] = attrValueData
      .filter(
        (attr, i) =>
          attr.product_cd === product_cd &&
          attrs.map((a) => a.cd).includes(attr.attr_cd)
      )
      .map((second, d) => {
        const newValue = attrs.filter(
          (inputAttr, i) => inputAttr.cd === second.attr_cd
        )[0].value;
        return { ...second, value: newValue };
      });
    attrValueData.splice(0, updatedAttrValues.length, ...updatedAttrValues);
    console.log(attrValueData);
    resolve({ result: "success" });
  });
};

const getProductAttrsApi = ({
  body,
}: {
  body: {
    product_cd: string;
  };
}): Promise<{
  result: string;
  message?: string;
  data: ProductAttrList[];
}> => {
  return new Promise((resolve, reject) => {
    const { product_cd } = body;
    const product = productData.find((item) => item.cd === product_cd);
    if (!product) {
      resolve({ result: "failed", data: [], message: "not product found" });
    } else {
      const attrsWithNames: ProductAttrList[] = attrPclData
        .filter((item) => item.pcl_cd === product.pcl_cd)
        .map((attrpcl) => {
          const returnValue: ProductAttrList = {
            cd: attrpcl.attr_cd,
            name: "",
            value: "",
            control_type: "",
            select_list: "",
            is_show: attrpcl.is_show,
            is_common: attrpcl.is_common,
          };

          const attribute = attributeData.find(
            (attr) => attr.cd === attrpcl.attr_cd
          );
          // const attrValue = attrValueData.find((attrvalue) =>
          //   attrvalue.attr_cd === attrpcl.attr_cd && product.series_cd === ""
          //     ? attrvalue.product_cd === product.cd
          //     : attrvalue.product_cd === product.series_cd
          // );

          if (product.series_cd === "") {
            const found = attrValueData.find(
              (attrvalue) =>
                attrvalue.attr_cd === attrpcl.attr_cd &&
                attrvalue.product_cd === product.cd
            );
            if (found) {
              returnValue["value"] = found.value;
            }
          } else {
            const found = attrValueData.find(
              (attrvalue) =>
                attrvalue.attr_cd === attrpcl.attr_cd &&
                attrvalue.product_cd === product.series_cd
            );
            if (found) {
              returnValue["value"] = found.value;
            }
          }

          if (attribute) {
            returnValue["control_type"] = attribute.control_type;
            returnValue["select_list"] = attribute.select_list;
            returnValue["name"] = attribute.name;
          }
          return returnValue;
        });
      console.log(attrsWithNames);
      resolve({ data: attrsWithNames, result: "success" });
    }
  });
};

export default {
  getAllAttrsApi,
  createAttrApi,
  updateProductAttrsApi,
  getProductAttrsApi,
  updateAttrApi,
  getAttrDetailApi,
  deleteAttrApi,
};
