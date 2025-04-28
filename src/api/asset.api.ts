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
