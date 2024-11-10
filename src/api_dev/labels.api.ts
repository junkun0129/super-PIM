import { labelsData } from "../data/labels/labels.data";
import { productData } from "../data/sku/product.data";
import { labelDeleteString, removeSpecificString } from "../util";

const getAllLabelsApi = (): Promise<{
  data: LabelsTable[];
  result: string;
  message?: string;
}> => {
  return new Promise((resolve, reject) => {
    const res = [...labelsData];
    resolve({ data: res, result: "success" });
  });
};

const updateLabelsApi = ({
  body,
}: {
  body: {
    update: LabelsTable[];
    create: LabelsTable[];
    delete: LabelsTable[];
  };
}): Promise<{ result: string }> => {
  const newLabels: LabelsTable[] = [...body.update, ...body.create];

  return new Promise((resolve, reject) => {
    labelsData.splice(0, newLabels.length, ...newLabels);
    resolve({ result: "success" });
  });
};

const updateProductLabelsApi = ({
  body,
  product_cd,
}: {
  body: {
    add: string[];
    deleted: string[];
  };
  product_cd: string;
}): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    const { add, deleted } = body;

    if (add.length) {
      const newproduct = productData.map((item) => {
        if (item.cd === product_cd) {
          let newLabels = item.labels;
          add.map((addlabel) => {
            newLabels += newLabels === "" ? addlabel : ";" + addlabel;
          });
          return { ...item, labels: newLabels };
        }
        return item;
      });
      productData.splice(0, newproduct.length, ...newproduct);
    }
    if (deleted.length) {
      const newproduct = productData.map((product) => {
        if (product.cd === product_cd) {
          let newLabels = product.labels;
          deleted.map((deletedLabel) => {
            const removed = removeSpecificString(newLabels, deletedLabel);
            newLabels = removed;
          });

          const removedd = labelDeleteString(newLabels, ";");
          newLabels = removedd;

          return { ...product, labels: newLabels };
        }
        return product;
      });
      productData.splice(0, newproduct.length, ...newproduct);
    }
    resolve({ result: "success" });
  });
};

export default {
  getAllLabelsApi,
  updateLabelsApi,
  updateProductLabelsApi,
};
