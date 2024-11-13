import { attrPclData } from "../data/attrpcls/attrpcls";
import { MediaTable } from "../data/medias/medias";
import { MediaData } from "../data/medias/medias.data";
import { generateRandomString } from "../util";

const createMediaApi = ({
  body,
}: {
  body: { name: string };
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const media_cd = generateRandomString(17);
    MediaData.push({
      cd: media_cd,
      name: body.name,
    });
    const newAttrPclData = attrPclData.map((item) => {
      let returnValue = { ...item };
      returnValue["order"] =
        item.order === ""
          ? `${media_cd}-${item.default_order}`
          : item.order + `;${media_cd}-${item.default_order}`;
      returnValue["is_show"] =
        item.is_show === "" ? `${media_cd}-1` : item.is_show + `;${media_cd}-1`;
      return returnValue;
    });
    attrPclData.splice(0, newAttrPclData.length, ...newAttrPclData);
    resolve({ result: "success" });
  });
};

const getAllMediaApi = (): Promise<{ data: MediaTable[]; result: string }> => {
  return new Promise((resolve, reject) => {
    resolve({ data: MediaData, result: "success" });
  });
};

export default {
  createMediaApi,
  getAllMediaApi,
};
