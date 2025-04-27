import { Result } from "../types/api.type";
import { fetchRequest } from "./helper.api";

type GetProductListReq = {
  is: string;
  pg: number;
  ps: number;
  ws: string;
  ob: string;
  or: string;
  kw: string;
  ct: string;
  id: string;
};
type GetProductListApiRes = {
  message: string;
  result: Result;
  data: {
    pr_cd: string;
    pr_name: string;
    pr_is_discontinued: string;
    pr_acpt_status: string;
    pr_acpt_last_updated_at: string;
    pr_labels: string;
    pr_created_at: string;
    pr_hinban: string;
    pr_updated_at: string;
    pr_is_deleted: string;
    pr_is_series: string;
    pr_series_cd: string;
    pr_description: string;
    pcl: {
      pcl_name: string;
    };
  }[];
  total: number;
};
export const getProductListApi = async ({
  is,
  pg,
  ps,
  ws,
  ob,
  or,
  kw,
  ct,
  id,
}: GetProductListReq): Promise<GetProductListApiRes> => {
  const url = `/product/list?pg=${pg}&ps=${ps}&or=${or}&kw=${kw}&is=${is}&ws=${ws}&ob=${ob}&ct=${ct}&id=${id}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type CreateProductApiReq = {
  body: {
    is_series: string;
    pr_name: string;
    pr_hinban: string;
    ctg_cd: string;
    pcl_cd: string;
    attrvalues: { atr_cd: string; atv_value: string }[];
  };
};
type CreateProductApiRes = {
  message: string;
  result: Result;
};
export const createProductApi = async ({
  body,
}: CreateProductApiReq): Promise<CreateProductApiRes> => {
  const url = `/product/create`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type CheckProductApiReq = {
  body: {
    pr_hinban: string;
    pr_name: string;
  };
};
type CheckProductApiRes = {
  result: string;
  message: string;
};
export const checkProductApi = async ({
  body,
}: CheckProductApiReq): Promise<CheckProductApiRes> => {
  const url = `/product/check`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};
type GetProductDetailApiReq = {
  pr_cd: string;
};
export type ProductAttr = {
  atv_cd: string;
  atv_value: string;
  attr: {
    atr_cd: string;
    atr_name: string;
    atr_is_with_unit: string;
    atr_unit: string;
    atr_control_type: string;
    atr_select_list: string;
    atr_max_length?: number;
    atr_not_null: string;
    attrpcl: {
      atp_is_common: string;
      atp_order: number;
    }[];
  };
};
export type ProductDetail = {
  pr_cd: string;
  pcl: {
    pcl_name: string;
  };
  pr_name: string;
  pr_hinban: string;
  pr_is_discontinued: string;
  pr_acpt_status: string;
  pr_labels: string;
  pr_created_at: string;
  pr_updated_at: string;
  pr_is_series: string;
  pr_description: string;
  categories: {
    ctg_cd: string;
  }[];
};

type GetProductDetailApiRes = {
  message: string;
  result: string;
  data: {
    product: ProductDetail;
    attrvalues: ProductAttr[];
  };
};
export const getProductDetailApi = async ({
  pr_cd,
}: GetProductDetailApiReq): Promise<GetProductDetailApiRes> => {
  const url = `/product/detail/${pr_cd}`;
  const res = await fetchRequest(url, "GET");
  return res;
};
