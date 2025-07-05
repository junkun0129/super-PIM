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
