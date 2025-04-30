import { fetchRequest } from "./helper.api";

type GetHeadersApiReq = {
  wks_cd: string;
};

type GetHeadersApiRes = {
  message: string;
  result: string;
  data: {
    headers: {
      wks_cd: string;
      hdr_cd: string;
      attr_cd: string;
      hdr_width: number;
      hdr_order: number;
    }[];
    attrList: {
      [key: string]: string;
    };
  };
};
export const getHeadersApi = async ({
  wks_cd,
}: GetHeadersApiReq): Promise<GetHeadersApiRes> => {
  const url = `/header/get?wks=${wks_cd}`;
  const res = await fetchRequest(url, "GET");
  return res;
};

type AddHeaderApiReq = {
  body: {
    atr_cd: string;
    wks_cd: string;
  };
};

type AddHeaderApiRes = {
  message: string;
  result: string;
};
export const addHeaderApi = async ({
  body,
}: AddHeaderApiReq): Promise<AddHeaderApiRes> => {
  const url = `/header/add`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DeleteHeaderReq = {
  hdr_cd: string;
};

type DeleteHeaderRes = {
  message: string;
  result: string;
};
export const deleteHeader = async ({
  hdr_cd,
}: DeleteHeaderReq): Promise<DeleteHeaderRes> => {
  const url = `/header/delete/${hdr_cd}`;
  const res = await fetchRequest(url, "POST");
  return res;
};

type UpdateOrderApiReq = {
  body: {
    active_cd: string;
    over_cd: string;
    wks_cd: string;
  };
};

type UpdateOrderApiRes = {
  message: string;
  result: string;
};
export const updateHeaderOrderApi = async ({
  body,
}: UpdateOrderApiReq): Promise<UpdateOrderApiRes> => {
  const url = `/header/updateorder`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type UpdateWidthApiReq = {
  body: {
    hdr_cd: string;
    hdr_width: number;
    wks_cd: string;
  };
};

type UpdateWidthApiRes = {
  message: string;
  result: string;
};
export const updateWidthApi = async ({
  body,
}: UpdateWidthApiReq): Promise<UpdateWidthApiRes> => {
  const url = `/header/updatewidth`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};
