import { MediaTable } from "../data/medias/medias";
import { MediaData } from "../data/medias/medias.data";
import { generateRandomString } from "../util";

const createMediaApi = ({
  body,
}: {
  body: { name: string };
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    MediaData.push({
      cd: generateRandomString(17),
      name: body.name,
    });
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
