import { CreatedSeriesEntry } from "../pages/SeriesListPage.tsx/SeriesCreateModal";
import { SAIYOUS_TO_ID } from "../constant";
import { attributeData } from "../data/attributes/attributes.data";
import { attrPclData } from "../data/attrpcls/attrpcls";
import { attrValueData } from "../data/attrvalues/attrvalues";
import { pclData } from "../data/pcls/pcls";
import { ProductTable } from "../data/sku/product";
import { productData } from "../data/sku/product.data";
import { generateRandomString } from "../util";

export type SeriesList = {
  cd: string;
  name: string;
  is_discontinued: string;
  acpt_status: string;
  hinban: string;
  pcl_name: string;
};

export type SkuList = {
  cd: string;
  name: string;
  is_discontinued: string;
  acpt_status: string;
  hinban: string;
};

export type SeriesDetail = {
  cd: string;
  name: string;
  description: string;
  is_discontinued: string;
  acpt_status: string;
  hinban: string;
  pcl_name: string;
  attrs: ProductAttr[];
  is_series: string;
};

export type ProductAttr = {
  cd: string;
  value: string;
  default_value: string;
  is_with_unit: string;
  alter_name: string;
  control_type: string;
  select_list: string;
  unit: string;
};

const getSeriesSkuListApi = ({ series_cd }: { series_cd: string }) => {
  return new Promise((resolve, reject) => {
    const filtered = productData
      .filter((item) => item.is_series === "0")
      .filter((item) => item.cd === series_cd);

    const returnValue: SkuList[] = filtered.map((sku) => ({
      cd: sku.cd,
      name: sku.name,
      is_discontinued: sku.is_discontinued,
      acpt_status: sku.acpt_status,
      hinban: sku.hinban,
    }));
    resolve(returnValue);
  });
};
const getSeriesDetailApi = (series_cd: string): Promise<SeriesDetail> => {
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

    const returnvalue: SeriesDetail = {
      cd: seriesDetail.cd,
      name: seriesDetail.name,
      is_discontinued: seriesDetail.is_discontinued,
      acpt_status: seriesDetail.acpt_status,
      hinban: seriesDetail.hinban,
      description: seriesDetail.description,
      pcl_name: filteredPcl[0].name,
      attrs: linkedAttrsandValues,
      is_series: seriesDetail.series_cd === "" ? "0" : "1",
    };
    resolve(returnvalue);
  });
};

const getSeriesListApi = ({
  offset,
  pagination,
  order,
  deleted,
}: {
  offset: number;
  pagination: number;
  order: string;
  deleted: string;
}): Promise<{
  data: SeriesList[];
  total: number;
  result: string;
  message?: string;
}> => {
  return new Promise((resolve, reject) => {
    let newSeries = [...productData].filter((item) => item.is_series === "1");
    if (deleted === "1") {
      newSeries = newSeries.filter((item) => item.is_deleted === "1");
    }
    if (order === "desc") {
      newSeries = newSeries.reverse();
    }

    const populatedSeriesList: SeriesList[] = newSeries
      .splice(offset, pagination)
      .map((series) => {
        const pcl = pclData.filter((item) => item.cd === series.pcl_cd);

        return {
          cd: series.cd,
          name: series.name,
          is_discontinued: series.is_discontinued,
          acpt_status: series.acpt_status,
          hinban: series.hinban,
          pcl_name: pcl.length ? pcl[0].name : "",
        };
      });
    const total = productData.length;
    resolve({ data: populatedSeriesList, total, result: "success" });
  });
};

const CREATE_SERIES_REQUIRED_ADD_LIST: { [key: string]: string } = {
  SERIES_NAME: "series_name",
  HINBAN: "hinban",
};
export const createSeriesApi = ({
  body,
}: {
  body: CreatedSeriesEntry[];
}): Promise<{ message?: string; result: string }> =>
  new Promise((resolve, reject) => {
    body.map((series) => {
      productData.push({
        cd: series.series_cd,
        name: series.series_name,
        description: "",
        is_discontinued: "0",
        acpt_status: "0",
        acpt_last_updated_at: "",
        labels: "",
        created_at: "",
        updated_at: "",
        hinban: "",
        medias: "",
        series_cd: "",
        pcl_cd: series.pcl_cd,
        is_series: "1",
        is_deleted: "0",
      });

      series.attrs.map((attr, i) => {
        const attrvalue_cd = generateRandomString(17);
        attrValueData.push({
          cd: attrvalue_cd,
          value: attr.value,
          product_cd: series.series_cd,
          attr_cd: attr.cd,
        });
      });
    });

    resolve({ result: "success" });
  });

const updateSeriesApi = ({
  series_cd,
  body,
}: {
  series_cd: string;
  body: {
    name: string;
    description: string;
  };
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const { name, description } = body;
    const series = productData
      .filter((item) => item.is_series === "1")
      .find((item) => item.cd === series_cd);
    if (!series)
      resolve({
        result: "failed",
        message: "シリーズが存在しませんでした。",
      });
    const newSeriesData = productData.map((item) => {
      if (item.is_series === "1" && item.cd === series_cd) {
        return { ...item, description, name };
      }
      return item;
    });

    productData.splice(0, newSeriesData.length, ...newSeriesData);
    resolve({
      result: "success",
    });
  });
};

const checkSeriesExists = (
  series_cd: string,
  series_name: string
): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const cdArray = productData.filter(
      (item) => item.is_series === "1" && item.cd === series_cd
    );
    const nameArray = productData.filter(
      (item) => item.is_series === "1" && item.name === series_name
    );
    if (cdArray.length)
      return resolve({
        result: "failed",
        message: "シリーズコードが既に存在します",
      });
    if (nameArray.length)
      return resolve({
        result: "failed",
        message: "シリーズ名が既に存在します",
      });
    resolve({ result: "success" });
  });
};

export default {
  getSeriesDetailApi,
  getSeriesListApi,
  getSeriesSkuListApi,
  createSeriesApi,
  updateSeriesApi,
  checkSeriesExists,
};
