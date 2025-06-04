import { productData } from "../data/sku/product.data";

const updateProductPclApi = ({
  product_cd,
  pcl_cd,
}: {
  product_cd: string;
  pcl_cd: string;
}): Promise<{ result: string }> =>
  new Promise((resolve, reject) => {
    const newProduct = productData.map((item, i) => {
      if (item.cd === product_cd || item.series_cd === product_cd) {
        return {
          ...item,
          pcl_cd,
        };
      }
      return item;
    });

    productData.splice(0, newProduct.length, ...newProduct);
    resolve({ result: "success" });
  });

export default {
  updateProductPclApi,
};
