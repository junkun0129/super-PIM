import { Flag } from "../common";
import { attributeData } from "../data/attributes/attributes.data";
import { attrPclData } from "../data/attrpcls/attrpcls";
import { attrValueData } from "../data/attrvalues/attrvalues";
import { headersData } from "../data/headers/headers.data";
import { pclData } from "../data/pcls/pcls";
import { productData } from "../data/sku/product.data";
import { generateRandomString } from "../util";
import { ProductAttr } from "./series.api";
type Header = {
  cd: string;
  name: string;
};

export const C_REQ_HEADER_SKU_LIST = {
  hinban: "商品コード",
  name: "商品名",
  status: "ステータス",
  pcl_name: "商品分類名",
};

type SkuList = {
  cd: string;
  attrs: { cd: string; value: string }[];
  hinban: string;
  name: string;
  is_discontinued: string;
  acpt_status: string;
  labels: string;
  pcl_name: string;
};

export type SkuDetail = {
  cd: string;
  name: string;
  description: string;
  is_discontinued: string;
  acpt_status: string;
  hinban: string;
  pcl_name: string;
  attrs: ProductAttr[];
  labels: string;
  is_series: string;
};

const getHeadersApi = (): Promise<{
  result: string;
  message?: string;
  headers: Header[];
  addList: {
    [key: string]: string;
  };
}> => {
  return new Promise((resolve, reject) => {
    const headers: Header[] = headersData.map((item) => {
      if (item.attr_cd.length <= 16) {
        return {
          name: C_REQ_HEADER_SKU_LIST[item.attr_cd],
          cd: item.attr_cd,
        };
      } else {
        const filtered = attributeData.filter(
          (attr) => attr.cd === item.attr_cd
        );
        let name = "";
        if (filtered.length) {
          name = filtered[0].name;
        }
        return {
          name,
          cd: item.attr_cd,
        };
      }
    });

    const copiedAttrs = [...attributeData];
    const addList = { ...C_REQ_HEADER_SKU_LIST };
    copiedAttrs.forEach((attr) => {
      addList[attr.cd] = attr.name;
    });

    resolve({ result: "success", headers, addList });
  });
};

const getSkuListApi = ({
  pagination,
  offset,
  order,
  deleted,
  series_cd,
}: {
  pagination: number;
  offset: number;
  order: "asc" | "desc";
  deleted: Flag;
  series_cd: string;
}): Promise<{
  data: SkuList[];
  result: string;
  message?: string;
  total: number;
}> => {
  return new Promise((resolve, reject) => {
    let newSkuList = [...productData].filter((item) => item.is_series === "0");
    if (deleted === "1") {
      newSkuList = newSkuList.filter((item) => item.is_deleted === "1");
    }
    if (order === "desc") {
      newSkuList = newSkuList.reverse();
    }

    if (series_cd !== "") {
      newSkuList = newSkuList = newSkuList.filter(
        (item) => item.series_cd === series_cd
      );
    }

    const populatedSkuList: SkuList[] = newSkuList
      .splice(offset, pagination)
      .map((sku) => {
        const pcl = pclData.filter((item) => item.cd === sku.pcl_cd);
        let attrs: { cd: string; value: string }[] = [];
        if (pcl.length) {
          const pcl_cd = pcl[0].cd;
          const newAttrs = attrPclData
            .filter((attr, i) => attr.pcl_cd === pcl_cd)
            .map((attrpcl, i) => {
              const filtered = attrValueData.filter(
                (attrvalue) =>
                  attrvalue.product_cd === sku.cd &&
                  attrvalue.attr_cd === attrpcl.attr_cd
              );

              return {
                cd: filtered.length ? filtered[0].attr_cd : "",
                value: filtered.length ? filtered[0].value : "",
              };
            });
          attrs = newAttrs;
        }
        return {
          cd: sku.cd,
          name: sku.name,
          is_discontinued: sku.is_discontinued,
          acpt_status: sku.acpt_status,
          hinban: sku.hinban,
          pcl_name: pcl.length ? pcl[0].name : "",
          labels: sku.labels,
          attrs,
        };
      });

    resolve({
      data: populatedSkuList,
      result: "success",
      total: newSkuList.length,
    });
  });
};

const addHeaderApi = ({
  body,
}: {
  body: { attr_cd: string };
}): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    const { attr_cd } = body;
    const cd = generateRandomString(17);
    headersData.push({ cd, attr_cd });
    resolve({ result: "success" });
  });
};

const deleteHeader = () => {};

const getSkuDetailApi = (
  series_cd: string
): Promise<{ data: SkuDetail; result: string }> => {
  return new Promise((resolve, reject) => {
    const filtered = productData.filter((series) => series.cd === series_cd);
    if (!filtered.length) return reject("no series linked");
    const seriesDetail = filtered[0];
    const filteredPcl = pclData.filter(
      (item) => item.cd === seriesDetail.pcl_cd
    );
    if (!filteredPcl.length) return reject("no pcl linked");
    const linkedAttrs = attrPclData.filter(
      (item) => item.pcl_cd === filteredPcl[0].cd
    );
    let linkedAttrsandValues: ProductAttr[] = [];
    if (linkedAttrs.length) {
      linkedAttrs.map((attr, i) => {
        const filteredattrvalue = attrValueData.filter(
          (attrvalue) =>
            attrvalue.attr_cd === attr.attr_cd &&
            attrvalue.product_cd === seriesDetail.cd
        );
        if (filteredattrvalue.length) {
          const attr_value = filteredattrvalue[0];
          if (attr.is_show === "0") return;
          const filteredAttr = attributeData.filter((a) => a.cd === attr.cd);
          if (!filteredAttr.length) return;
          const attribute = filteredAttr[0];
          linkedAttrsandValues.push({
            value: attr_value.value,
            cd: attribute.cd,
            default_value: attribute.default_value,
            is_with_unit: attribute.is_with_unit,
            alter_name: attr.alter_name,
            control_type: attribute.control_type,
            select_list: attribute.select_list,
            unit: attribute.unit,
          });
        }
      });
    }

    const returnvalue: SkuDetail = {
      cd: seriesDetail.cd,
      name: seriesDetail.name,
      is_discontinued: seriesDetail.is_discontinued,
      acpt_status: seriesDetail.acpt_status,
      hinban: seriesDetail.hinban,
      description: seriesDetail.description,
      pcl_name: filteredPcl[0].name,
      attrs: linkedAttrsandValues,
      labels: seriesDetail.labels,
      is_series: seriesDetail.series_cd === "" ? "0" : "1",
    };
    resolve({ data: returnvalue, result: "success" });
  });
};

export default { getHeadersApi, getSkuListApi, addHeaderApi, getSkuDetailApi };
