import React, { useEffect, useState } from "react";
import AppCategoryTree from "../../../components/AppCategoryTree/AppCategoryTree";
import { categoriesData } from "../../../data/categories/categories.data";
import { CategoryNode } from "../../../data/categories/type";
import categoryApis from "../../../api_dev/category.api";
import AppSortable from "../../../components/AppSortable/AppSortable";
import { useMessageContext } from "../../../providers/MessageContextProvider";
import AppButton from "../../../components/AppButton/AppButton";
import nocontent from "../../../assets/nocontent.png";
import AppInput from "../../../components/AppInput/AppInput";
import {
  CategoryTree,
  createCategoryApi,
  getCategoryListApi,
} from "../../../api/category.api";

const CategoryManage = () => {
  const [categories, setcategories] = useState<CategoryTree[]>([]);
  const { getAllCategoriesApi, updateCategoryOrderApi } = categoryApis;
  const [isFirstInputOn, setisFirstInputOn] = useState<boolean>(false);
  const { setMessage } = useMessageContext();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const res = await getCategoryListApi();
    if (res.result !== "success") return;
    setcategories(res.data);
  };

  const updateOrder = async ({
    activeCd,
    overCd,
    parent_cd,
  }: {
    activeCd: string;
    overCd: string;
    parent_cd: string;
  }) => {
    console.log(parent_cd, overCd, activeCd);
    const res = await updateCategoryOrderApi({
      body: {
        active_cd: activeCd,
        over_cd: overCd,
        parent_cd,
      },
    });
    if (res.result !== "success") return;
    getCategories();
    setMessage("カテゴリの順番が更新されました");
  };

  const handleBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return setisFirstInputOn(false);
    const res = await createCategoryApi({
      body: {
        parent_cd: "",
        ctg_name: e.target.value,
      },
    });

    setMessage(res.message);
    getCategories();
  };

  return (
    <div className="w-full h-full">
      {categories.length ? (
        <AppSortable
          layerCd="rootcategory"
          onDrop={({ activeCd, overCd }) =>
            updateOrder({ activeCd, overCd, parent_cd: "" })
          }
        >
          {categories.map((child, i) => (
            <div key={child.ctg_cd} className="draggable">
              <AppCategoryTree
                updateOrder={updateOrder}
                updateCategoryTree={getCategories}
                node={child}
              />
            </div>
          ))}
        </AppSortable>
      ) : (
        <div className=" flex flex-col items-center">
          <div
            className=" bg-cover w-[20vw] h-[40vh] mt-20"
            style={{ backgroundImage: `url(${nocontent})` }}
          ></div>
          <div className="text-2xl my-5">カテゴリが作成されていません。</div>
          {!isFirstInputOn && (
            <AppButton
              text={"＋ カテゴリを作成する"}
              className="mt-5"
              onClick={() => {
                setisFirstInputOn(true);
              }}
              type={"primary"}
            />
          )}
          {!!isFirstInputOn && (
            <AppInput
              autoFocus={true}
              onBlur={handleBlur}
              type={"text"}
              placeholder={"カテゴリ名を入力してください"}
              name={""}
              label={""}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
