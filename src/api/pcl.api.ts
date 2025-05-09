import { Result } from "../types/api.type";
import { fetchRequest } from "./helper.api";

type GetPclListApiReq = {
  pg: number;
  ps: number;
  or: string;
  kw: string;
};
type GetPclListApiRes = {
  message: string;
  result: Result;
  data: {
    pcl_cd: string;
    pcl_name: string;
    pcl_created_at: string;
    pcl_is_deleted: string;
    _count: {
      attrpcl: number;
    };
  }[];
  total: number;
};
export const GetPclListApi = async ({
  pg,
  ps,
  or,
  kw,
}: GetPclListApiReq): Promise<GetPclListApiRes> => {
  const url = `/atp/pcl/list?pg=${pg}&ps=${ps}&or=${or}&kw=${kw}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type GetPclAttrEntriesApiReq = {
  pcl_cd: string;
};
type GetPclAttrEntriesApiRes = {
  message: string;
  result: Result;
  data: {
    atp_is_common: string;
    attr: {
      atr_cd: string;
      atr_name: string;
      atr_is_with_unit: string;
      atr_control_type: string;
      atr_not_null: string;
      atr_max_length: number | null;
      atr_select_list: string;
      atr_default_value: string;
      atr_unit: string;
    };
  }[];
};

export const getPclAttrEntriesApi = async ({
  pcl_cd,
}: GetPclAttrEntriesApiReq): Promise<GetPclAttrEntriesApiRes> => {
  const url = `/atp/pclattrs/entries?pcl=${pcl_cd}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type GetPclEntriesApiRes = {
  message: string;
  result: Result;
  data: { pcl_cd: string; pcl_name: string }[];
};
export const GetPclEntriesApi = async (): Promise<GetPclEntriesApiRes> => {
  const url = `/atp/pcl/entries`;
  const res = await fetchRequest(url, "GET");
  return res;
};

export type PclDetail = {
  pcl_cd: string;
  pcl_name: string;
  pcl_created_at: Date;
  attrpcl: {
    atp_cd: string;
    atp_order: number;
    atp_is_show: string;
    atp_alter_name: string | null;
    atp_is_common: string;
    attr: {
      atr_name: string;
    };
  }[];
};
type GetPclDetailApiReq = {
  pcl_cd: string;
};

type GetPclDetailApiRes = {
  message: string;
  result: string;
  data?: PclDetail;
};
export const GetPclDetailApi = async ({
  pcl_cd,
}: GetPclDetailApiReq): Promise<GetPclDetailApiRes> => {
  const url = `/atp/pcl/detail/${pcl_cd}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type GetPclAttrListApiReq = {
  pg: string;
  ps: string;
  or: string;
  kw: string;
  pcl: string;
  wks: string;
};

type GetPclAttrListApiRes = {
  message: string;
  result: Result;
};

export const GetPclAttrList = async ({
  pg,
  ps,
  or,
  kw,
  pcl,
  wks,
}: GetPclAttrListApiReq): Promise<GetPclAttrListApiRes> => {
  const url = `/atp/pclattrs/list?pg=${pg}&ps=${ps}&or=${or}&kw=${kw}&pcl=${pcl}&wks=${wks}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type CreatePclApiReq = {
  body: {
    pcl_name: string;
  };
};

type CreatePclApiRes = {
  message: string;
  result: Result;
  data: { pcl_cd: string };
};

export const CreatePclApi = async ({
  body,
}: CreatePclApiReq): Promise<CreatePclApiRes> => {
  const url = `/atp/pcl/create`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type AddAttrsToPclApiReq = {
  body: {
    pcl_cd: string;
    atr_cd: string;
    atp_is_show: string;
    atp_alter_name: string;
    atp_is_common: string;
    atp_order: number;
  }[];
};

type AddAttrsToPclApiRes = {
  message: string;
  result: Result;
};

export const AddAttrsToPclApi = async ({
  body,
}: AddAttrsToPclApiReq): Promise<AddAttrsToPclApiRes> => {
  const url = `/atp/pclattrs/add`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type UpdatePclApiReq = {
  body: {
    pcl_cd: string;
    pcl_name: string;
    attrs: {
      atp_cd: string;
      atp_alter_name: string;
      atp_is_common: string;
      atp_is_show: string;
      atp_order: number;
    }[];
  };
};

type UpdatePclApiRes = {
  message: string;
  result: Result;
};

export const updatePclApi = async ({
  body,
}: UpdatePclApiReq): Promise<UpdatePclApiRes> => {
  const url = `/atp/pclattrs/update`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DeletePclApiReq = {
  body: {
    pcl_cd: string;
  };
};
type DeletePclApiRes = {
  message: string;
  result: string;
};

export const deletePclApi = async ({
  body,
}: DeletePclApiReq): Promise<DeletePclApiRes> => {
  const url = `/atp/pcl/delete`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DeletePclAttrApiReq = {
  body: {
    pcl_cd: string;
    atr_cd: string;
  };
};
type DeletePclAttrApiRes = {
  message: string;
  result: string;
};

export const deletePclAttrApi = async ({
  body,
}: DeletePclAttrApiReq): Promise<DeletePclAttrApiRes> => {
  const url = `/atp/pclattrs/delete`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type UpdateAttrPclReq = {
  body: {
    atp_cd: string;
    atp_is_show: string;
    atp_alter_name: string;
    atp_alter_value: string;
    atp_is_common: string;
  };
};

type UpdateAttrPclRes = {
  message: string;
  result: string;
};

export const updateAttrPcl = async ({
  body,
}: UpdateAttrPclReq): Promise<UpdateAttrPclRes> => {
  const url = `/atp/pclattrs/update`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};
