import { fetchRequest } from "./helper.api";

type CreateCategoryApiReq = {
  body: {
    ctg_name: string;
    parent_cd: string;
  };
};

type CreateCategoryApiRes = {
  message: string;
  result: string;
};
export const createCategoryApi = async ({
  body,
}: CreateCategoryApiReq): Promise<CreateCategoryApiRes> => {
  const url = `/category/create`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

export type CategoryNode = {
  ctg_cd: string;
  ctg_name: string;
  ctg_desc: string;
  ctg_order: number;
  parent_cd: string | null;
};

export type CategoryTree = CategoryNode & {
  children?: CategoryTree[];
};
type GetCategoryListApiRes = {
  message: string;
  result: string;
  data: CategoryTree[];
};
export const getCategoryListApi = async (): Promise<GetCategoryListApiRes> => {
  const url = `/category/list`;
  const res = await fetchRequest(url, "GET");
  return res;
};
