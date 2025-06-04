import { Attributes } from "react";
import { attrPclData } from "../data/attrpcls/attrpcls";
import { attrValueData } from "../data/attrvalues/attrvalues";
import { generateRandomString } from "../util";
import { productData } from "../data/sku/product.data";
import { AttrValueTable } from "../data/attrvalues/type";
import { pclData } from "../data/pcls/pcls";
import { AttrPclTable } from "../data/attrpcls/type";
import { attributeData } from "../data/attributes/attributes.data";

const addAttrToPclApi = ({
  body,
}: {
  body: {
    attr_cd: string;
    pcl_cd: string;
  };
}): Promise<{ message?: string; result: string }> => {
  return new Promise((resolve, reject) => {
    const { attr_cd, pcl_cd } = body;
    const cd = generateRandomString(35);
    const currentattrpcl = attrPclData.filter((item) => item.pcl_cd === pcl_cd);
    attrPclData.push({
      pcl_cd,
      attr_cd,
      cd,
      order: "",
      alter_name: "",
      is_show: "1",
      alter_value: "",
      default_order: currentattrpcl.length,
    });

    const linkedProducts = productData.filter(
      (series, i) => series.pcl_cd === pcl_cd
    );
    const attrValues: AttrValueTable[] = [];
    linkedProducts.map((product) => {
      const attr_value_cd = generateRandomString(35);

      attrValues.push({
        cd: attr_value_cd,
        value: "",
        product_cd: product.cd,
        attr_cd: cd,
      });
    });
    attrValueData.splice(0, attrValueData.length, ...attrValues);

    const linkedSeries = linkedProducts.filter(
      (item) => item.is_series === "1"
    );
    const linkedSku = linkedProducts.filter((item) => item.is_series === "0");

    resolve({
      result: "success",
      message: `${linkedSeries.length}個のシリーズ、${linkedSku.length}個のSKUに項目が新たに追加されました`,
    });
  });
};

const createPclApi = ({
  name,
}: {
  name: string;
}): Promise<{ message?: string; result: string }> => {
  return new Promise((resolve, reject) => {
    const filtered = pclData.filter((item) => item.name === name);
    if (filtered.length) {
      resolve({ message: "既に存在している商品分類名です", result: "failed" });
    } else {
      const cd = generateRandomString();
      const created_at = new Date().toString();
      pclData.push({ name, cd, created_at, is_deleted: "0" });
      resolve({ result: "success" });
    }
  });
};

export type GetPclData = {
  cd: string;
  attr_count: number;
  pcl_name: string;
  is_deleted: string;
};

const getPclsApi = (): Promise<{
  data: GetPclData[];
  total: number;
}> => {
  return new Promise((resolve, reject) => {
    const newPcls = [...pclData];
    const total = newPcls.length;
    const arrangedPcls = newPcls.map((pcl, i) => {
      const newAttrPcl = [...attrPclData];
      const attrCount = newAttrPcl.filter(
        (node) => node.pcl_cd === pcl.cd
      ).length;
      const newPcl: GetPclData = {
        pcl_name: pcl.name,
        attr_count: attrCount,
        cd: pcl.cd,
        is_deleted: pcl.is_deleted,
      };
      return newPcl;
    });

    resolve({ data: arrangedPcls, total });
  });
};

type AttrPclList = AttrPclTable & { name: string };
const getPclsAttrsApi = ({
  body,
}: {
  body: {
    pcl_cd: string;
    media_cd: string;
  };
}): Promise<{
  data: AttrPclList[];
  result: string;
  message?: string;
}> => {
  return new Promise((resolve, reject) => {
    const { pcl_cd, media_cd } = body;
    const attrPclList: AttrPclList[] = attrPclData
      .filter((item) => item.pcl_cd === pcl_cd)
      .map((item) => {
        let name = "";
        const attribute = attributeData.find(
          (attr) => attr.cd === item.attr_cd
        );
        if (attribute) {
          name = attribute.name;
        }
        const alterName = getValueFromPclValue(item.alter_name, media_cd);
        const alterValue = getValueFromPclValue(item.alter_value, media_cd);
        const isShow = getValueFromPclValue(item.is_show, media_cd);
        const order = getValueFromPclValue(item.order, media_cd);

        return {
          ...item,
          alter_name: alterName ?? "",
          alter_value: alterValue ?? "",
          is_show: isShow ?? "1",
          order: order ?? "",
          name: attribute.name,
        };
      });
    console.log(attrPclList);
    resolve({ data: attrPclList, result: "success" });
  });
};

const getValueFromPclValue = (string: string, media_cd: string) => {
  if (string === "") return "";
  const mediaCdArray = string.split(";").map((item) => item.split("-")[0]);
  const matchedIndex = mediaCdArray.findIndex((item) => item === media_cd);
  if (matchedIndex === -1) return;
  const value = string.split(";")[matchedIndex].split("-")[1];
  return value;
};

const updatePclAttrApi = ({
  body,
}: {
  body: {
    attrpcls: {
      alter_name: string;
      alter_value: string;
      order: string;
      is_show: string;
      cd: string;
    }[];
    media_cd: string;
  };
}): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    console.log(body.attrpcls);
    const newAttrPcls = attrPclData.map((item) => {
      const attrPcl = body.attrpcls.find((attrpcl) => attrpcl.cd === item.cd);
      if (!attrPcl) return item;
      let newAttrPcl = { ...item };

      if (attrPcl.alter_name !== "") {
        const newvalue = getValueFromPclValueforUpdate(
          item.alter_name,
          body.media_cd,
          attrPcl.alter_name
        );
        console.log(newvalue, "newvalue");
        newAttrPcl["alter_name"] = newvalue;
      }

      if (attrPcl.alter_value !== "") {
        const newvalue = getValueFromPclValueforUpdate(
          item.alter_value,
          body.media_cd,
          attrPcl.alter_value
        );
        newAttrPcl["alter_value"] = newvalue;
      }
      if (attrPcl.order !== "") {
        const newvalue = getValueFromPclValueforUpdate(
          item.order,
          body.media_cd,
          attrPcl.order
        );
        newAttrPcl["order"] = newvalue;
      }
      if (attrPcl.is_show !== "") {
        const newvalue = getValueFromPclValueforUpdate(
          item.is_show,
          body.media_cd,
          attrPcl.is_show
        );
        newAttrPcl["is_show"] = newvalue;
      }
      return newAttrPcl;
    });
    console.log(newAttrPcls);
    attrPclData.splice(0, newAttrPcls.length, ...newAttrPcls);
    resolve({ result: "success" });
  });
};

const getValueFromPclValueforUpdate = (
  string: string,
  media_cd: string,
  target_vlaue: string
) => {
  if (string === "") return `${media_cd}-${target_vlaue}`;
  const mediaCdArray = string.split(";").map((item) => item.split("-")[0]);

  const matchedIndex = mediaCdArray.findIndex((item) => item === media_cd);
  if (matchedIndex === -1) {
    const newvalue = string + `;${media_cd}-${target_vlaue}`;
    return newvalue;
  } else {
    let newvalue = "";
    string
      .split(";")
      .map((item, i) => {
        if (i === matchedIndex) {
          return `${media_cd}-${target_vlaue}`;
        }
        return item;
      })
      .forEach((item, i) => {
        if (i === 0) return (newvalue += item);
        return (newvalue += ";" + item);
      });
    return newvalue;
  }
};
export default {
  getPclsAttrsApi,
  addAttrToPclApi,
  createPclApi,
  getPclsApi,
  updatePclAttrApi,
};
