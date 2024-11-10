import { AssetBoxTable } from "../data/assetboxes/assetbodes";
import { assetBoxdata } from "../data/assetboxes/assetboxes.data";
import { AssetTable } from "../data/assets/assets";
import { assetsData } from "../data/assets/assets.data";

export type Asset = {
  box: AssetBoxTable;
  asset: AssetTable | null;
};

const getAllAssetBoxesApi = (): Promise<{
  data: AssetBoxTable[];
  result: string;
}> => {
  return new Promise((resolve, reject) => {
    const newBoxes = [...assetBoxdata];
    resolve({ data: newBoxes, result: "success" });
  });
};

const getProductAssetsApi = ({
  product_cd,
}: {
  product_cd: string;
}): Promise<{ data: AssetTable[]; result: string }> => {
  return new Promise((resolve, reject) => {
    const newAssetData = assetsData.filter(
      (item) => item.product_cd === product_cd
    );
    resolve({ data: newAssetData, result: "success" });
  });
};

const createAssetBox = ({
  body,
}: {
  body: {
    ext: string;
    lbl: string;
    no: string;
    type: string;
  };
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const { ext, lbl, no, type } = body;
    const filtercd = assetBoxdata.filter((item) => item.no === no);
    if (filtercd.length) {
      resolve({ result: "failed", message: "このIDは既に存在しています" });
    }
    assetBoxdata.push({
      ext,
      is_main: "0",
      lbl,
      no,
      type,
    });
    resolve({ result: "success" });
  });
};

export default {
  getAllAssetBoxesApi,
  getProductAssetsApi,
  createAssetBox,
};
