import React, { useEffect, useState } from "react";
import AppCategoryTree from "../../components/AppCategoryTree/AppCategoryTree";
import { categoriesData } from "../../data/categories/categories.data";
import { CategoryNode } from "../../data/categories/type";
import categoryApis from "../../api_dev/category.api";
import AppSortable from "../../components/AppSortable/AppSortable";
import { useMessageContext } from "../../providers/MessageContextProvider";

const CategoryManage = () => {
  const [categories, setcategories] = useState<CategoryNode[]>([]);
  const { getAllCategoriesApi, updateCategoryOrderApi } = categoryApis;
  const { setMessage } = useMessageContext();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const res = await getAllCategoriesApi();
    if (res.result !== "success") return;
    setcategories(res.data);
  };

  const updateOrder = async ({
    activeId,
    overId,
  }: {
    activeId: string;
    overId: string;
  }) => {
    const res = await updateCategoryOrderApi({
      body: {
        active_cd: activeId,
        over_cd: overId,
      },
    });
    if (res.result !== "success") return;
    getCategories();
    setMessage("カテゴリの順番が更新されました");
  };
  return (
    <div>
      {categories.length && (
        <AppSortable onDragEnd={updateOrder}>
          {categories.map((child, i) => (
            <div key={child.cd} className="draggable">
              <AppCategoryTree
                updateOrder={updateOrder}
                updateCategoryTree={getCategories}
                node={child}
              />
            </div>
          ))}
        </AppSortable>
      )}
    </div>
  );
};

export default CategoryManage;
