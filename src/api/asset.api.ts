import { fetchRequest } from "./helper.api";

type UploadAssetApiReq = {
  pr_cd: string;
  im?: string;
  asb?: string;
  type: string;
  body: BodyInit;
};
type UploadAssetApiRes = {
  result: string;
  message: string;
};
export const uploadAssetApi = async ({
  pr_cd,
  im,
  asb,
  body,
  type,
}: UploadAssetApiReq): Promise<UploadAssetApiRes> => {
  let url = `/assets/upload/${pr_cd}/${type}?im=`;
  if (im) {
    url += im;
  }
  if (asb) {
    url += `&asb=${asb}`;
  }
  const res = await fetchRequest(url, "POST", body, false, true);
  return res;
};

type GetProductAssetsApiReq = {
  pr_cd: string;
  type: string;
};
type GetProductAssetsApiRes = {
  data: {
    assets: Asset[];
    assetboxes: AssetBox[];
  };
  result: string;
  message: string;
};

type Asset = {
  ast_cd: string;
  ast_type: string;
  ast_ext: string;
  asb_cd: string;
  pr_cd: string;
};

type AssetBox = {
  asb_cd: string;
  asb_name: string;
  asb_type: string;
};

export type ProductAsset = AssetBox & { asset?: Asset };

export const getProductAssetsApi = async ({
  pr_cd,
  type,
}: GetProductAssetsApiReq): Promise<GetProductAssetsApiRes> => {
  let url = `/assets/prlist?pr_cd=${pr_cd}&type=${type}`;

  const res = await fetchRequest(url, "GET");
  return res;
};

type CreateAssetBoxApiReq = {
  body: {
    asb_name: string;
    asb_type: string;
  };
};
type CreateAssetBoxApiRes = {
  message: string;
  result: string;
};

export const CreateAssetBoxApi = async ({
  body,
}: CreateAssetBoxApiReq): Promise<CreateAssetBoxApiRes> => {
  let url = `/assets/createasb`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type GetMainAssetBoxKeyApiRes = {
  message: string;
  result: string;
  data?: string;
};

export const GetMainAssetBoxKeyApi =
  async (): Promise<GetMainAssetBoxKeyApiRes> => {
    let url = `/assets/mainkey`;
    const res = await fetchRequest(url, "GET");
    return res;
  };

type SetMainAssetBoxApiReq = {
  body: {
    asb_cd: string;
  };
};
type SetMainAssetBoxApiRes = {
  result: string;
  message: string;
};

export const setMainAssetBoxApi = async ({
  body,
}: SetMainAssetBoxApiReq): Promise<SetMainAssetBoxApiRes> => {
  let url = `/assets/changemain`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DeleteAssetBoxApiReq = {
  body: {
    asb_cd: string;
  };
};
type DeleteAssetBoxApiRes = {
  result: string;
  message: string;
};

export const deleteAssetBoxApi = async ({
  body,
}: DeleteAssetBoxApiReq): Promise<DeleteAssetBoxApiRes> => {
  let url = `/assets/deleteasb`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DeleteAssetApiReq = {
  body: {
    asb_cd: string;
    pr_cd: string;
  };
};
type DeleteAssetApiRes = {
  result: string;
  message: string;
};

export const deleteAssetApi = async ({
  body,
}: DeleteAssetApiReq): Promise<DeleteAssetApiRes> => {
  let url = `/assets/deleteast`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};

type DownloadAssetApiReq = {
  body: {
    asb_cd: string;
    pr_cd: string;
    ext: string;
  };
};

export const downloadAssetApi = async ({
  body,
}: DownloadAssetApiReq): Promise<void> => {
  let url = `/assets/download`;
  const res = await fetchRequest(url, "POST", body);
  return res;
};
