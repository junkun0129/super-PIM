import { DefaultDeserializer } from "v8";
import { Result } from "../types/api.type";
import { fetchRequest } from "./helper.api";

type GetAttrListApiReq = {
  pg: number;
  ps: number;
  or: string;
  kw: string;
};
type GetAttrListApiRes = {
  data: {
    atr_cd: string;
    atr_control_type: string;
    atr_created_at: string;
    atr_default_value: string;
    atr_is_delete: boolean;
    atr_is_with_unit: string;
    atr_max_length: number;
    atr_name: string;
    atr_not_null: string;
    atr_select_list: string;
    atr_unit: string;
    atr_updated_at: string;
  }[];
  total: number;
  message: string;
  result: Result;
};
export const getAttrListApi = async ({
  pg,
  ps,
  or,
  kw,
}: GetAttrListApiReq): Promise<GetAttrListApiRes> => {
  const url = `/atp/attr/list?pg=${pg}&ps=${ps}&or=${or}&kw=${kw}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type GetAttrsEntries = {
  data: {
    atr_cd: string;
    atr_name: string;
  }[];
  result: string;
  message: string;
};

export const getAttrsEntriesApi = async (): Promise<GetAttrsEntries> => {
  const url = `/atp/attr/entries`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type CreateAttrApiReq = {
  body: {
    atr_name: string;
    attr_is_with_unit: string;
    atr_unit: string;
    atr_control_type: string;
    atr_select_list: string;
    atr_not_null: string;
    atr_max_length: string;
    atr_default_value: string;
  }[];
};

type CreateAttrApiRes = {
  message: string;
  result: string;
};

export const createAttrApi = async ({
  body,
}: CreateAttrApiReq): Promise<CreateAttrApiRes> => {
  const url = `/atp/attr/create`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type UpdateAttrApiReq = {
  body: {
    atr_name: string;
    attr_is_with_unit: string;
    atr_control_type: string;
    atr_not_null: string;
    atr_max_length: string;
    atr_select_list: string;
    atr_default_value: string;
    atr_unit: string;
  };
};

type UpdateAttrApiRes = {
  message: string;
  result: string;
};
export const udpateAttrApi = async ({
  body,
}: UpdateAttrApiReq): Promise<UpdateAttrApiRes> => {
  const url = `/atp/attr/update`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DeleteAttrApiReq = {
  body: {
    atr_cd: string;
  };
};

type DeleteAttrApiRes = {
  message: string;
  result: string;
};
export const deleteAttrApi = async ({
  body,
}: DeleteAttrApiReq): Promise<DeleteAttrApiRes> => {
  const url = `/atp/attr/delete`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type GetAttrForPrFilterApiReq = {
  selectedPclCd: string;
  keyword: string;
};

export type FilterAttrList = {
  atr_cd: string;
  atr_name: string;
  atr_control_type: string;
  atr_max_length: number;
  atr_select_list: string;
};

type GetAttrForPrFilterApiRes = {
  data: FilterAttrList[];
  result: string;
  message: string;
};
export const getAttrForPrFilterApi = async ({
  selectedPclCd,
  keyword,
}: GetAttrForPrFilterApiReq): Promise<GetAttrForPrFilterApiRes> => {
  const url = `/atp/attr/filterlist?selectedPclCd=${selectedPclCd}&keyword=${keyword}`;
  const res = await fetchRequest(url, "GET");
  return res;
};
