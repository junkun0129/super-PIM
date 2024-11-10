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
    is_common: string;
  };
}): Promise<{ message?: string; result: string }> => {
  return new Promise((resolve, reject) => {
    const { attr_cd, pcl_cd, is_common } = body;
    const cd = generateRandomString(35);
    attrPclData.push({
      pcl_cd,
      attr_cd,
      cd,
      is_common,
      order: attrPclData.length + 1,
      alter_name: "",
      is_show: "1",
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
const getPclsAttrsApi = (
  pcl_cd: string
): Promise<{
  data: AttrPclList[];
  result: string;
  message?: string;
}> => {
  return new Promise((resolve, reject) => {
    const filtered: AttrPclList[] = attrPclData
      .filter((item) => item.pcl_cd === pcl_cd)
      .map((item) => {
        let name = "";
        const filtered = attributeData.filter(
          (attr) => attr.cd === item.attr_cd
        );
        if (filtered.length) {
          name = filtered[0].name;
        }
        return { ...item, name };
      });

    resolve({ data: filtered, result: "success" });
  });
};

export default {
  getPclsAttrsApi,
  addAttrToPclApi,
  createPclApi,
  getPclsApi,
};
