import { categoriesData } from "../data/categories/categories.data";
import { CategoryNode, CategoryTable } from "../data/categories/type";
import { productCategoryData } from "../data/productcategories/productcategories.data";
import {
  arrayMove,
  buildCategoryTree,
  generateRandomString,
  getCategoryTreeByCd,
  getLinkedCategoryArray,
} from "../util";

const getAllCategoriesApi = (): Promise<{
  result: string;
  data: CategoryNode[];
}> => {
  return new Promise((resolve, reject) => {
    const copied = [...categoriesData];
    const categoryTree = buildCategoryTree(copied);
    resolve({ data: categoryTree, result: "success" });
  });
};

const getProductCategoriesApi = ({
  body,
}: {
  body: { product_cd: string; media: string };
}): Promise<{ result: string; data: CategoryTable[] }> => {
  return new Promise((resolve, reject) => {
    const { product_cd, media } = body;
    const filtered = productCategoryData.filter(
      (item) => item.product_cd === product_cd && item.media === media
    );
    const copied = [...categoriesData];
    const keys = getLinkedCategoryArray(
      filtered.length ? filtered[0].category_cd : "",
      copied
    );
    keys.reverse();
    resolve({
      data: keys,
      result: "success",
    });
  });
};

const updateProductCategoryApi = ({
  body,
}: {
  body: {
    category_cd: string;
    product_cd: string;
    media: string;
  };
}): Promise<{ result: string; message?: string }> => {
  return new Promise((resolve, reject) => {
    const { category_cd, product_cd, media } = body;

    //when linked category already exists
    const index = productCategoryData.findIndex(
      (item) => item.product_cd == product_cd && item.media === media
    );
    if (index !== -1) {
      productCategoryData.splice(index, 1);
    }

    //when non category linked is requested
    if (category_cd !== "") {
      const cd = generateRandomString(17);
      productCategoryData.push({
        cd,
        category_cd,
        product_cd,
        media,
      });
    }

    resolve({
      result: "success",
    });
  });
};

const createCaetgoryApi = ({
  body,
}: {
  body: {
    name: string;
    parent_cd: string;
  };
}): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    const { name, parent_cd } = body;
    const cd = generateRandomString(17);

    const newCategories = categoriesData.map((item) => {
      if (item.parent_cd === parent_cd) {
        return { ...item, order: item.order + 1 };
      }
      return item;
    });
    newCategories.push({
      cd,
      name,
      description: "",
      parent_cd,
      order: 0,
    });

    categoriesData.splice(0, categoriesData.length, ...newCategories);
    resolve({ result: "success" });
  });
};

const updateCategoryOrderApi = ({
  body,
}: {
  body: {
    active_cd: string;
    over_cd: string;
    parent_cd: string;
  };
}): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    const { active_cd, over_cd, parent_cd } = body;
    const nodeCategories = categoriesData
      .filter((item) => item.parent_cd === parent_cd)
      .sort((a, b) => a.order - b.order);
    const restCategories = categoriesData.filter(
      (item) => item.parent_cd !== parent_cd
    );
    const overIndex = nodeCategories.findIndex((item) => item.cd === over_cd);
    const activeIndex = nodeCategories.findIndex(
      (item) => item.cd === active_cd
    );

    if (overIndex === -1 || activeIndex === -1)
      return reject("Category not found");

    const newNodecateogy = arrayMove(
      nodeCategories,
      activeIndex,
      overIndex
    ).map((item, i) => ({ ...item, order: i }));
    const newCategories = [...newNodecateogy, ...restCategories];

    categoriesData.splice(0, newCategories.length, ...newCategories);
    resolve({ result: "success" });
  });
};

export default {
  getAllCategoriesApi,
  getProductCategoriesApi,
  updateProductCategoryApi,
  createCaetgoryApi,
  updateCategoryOrderApi,
};
