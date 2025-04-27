import React, { useEffect, useState } from "react";
import AppCategoryCascader from "../../components/AppCategoryCascader/AppCategoryCascader";
import AppButton from "../../components/AppButton/AppButton";
import { CategoryTree, getCategoryListApi } from "../../api/category.api";
type Props = {
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
};
const CategoryCascaderButton = ({ selectedKeys, setSelectedKeys }: Props) => {
  const [open, setopen] = useState<boolean>(false);
  const [options, setoptions] = useState<CategoryTree[]>([]);
  console.log(selectedKeys);
  useEffect(() => {
    if (open) {
      getCategories();
    } else {
      setoptions([]);
    }
  }, [open]);

  const getCategories = async () => {
    const res = await getCategoryListApi();
    if (res.result !== "success") return;
    setoptions(res.data);
  };
  return (
    <AppCategoryCascader
      selectedKeys={selectedKeys}
      options={options}
      open={open}
      onSelect={(entries) => {
        const keys = entries.map((item) => item.key);
        setSelectedKeys(keys);
      }}
      onClose={() => setopen(false)}
    >
      <AppButton
        text="カテゴリで絞込み"
        type="normal"
        onClick={() => setopen(true)}
        badgeNum={selectedKeys.length}
      />
    </AppCategoryCascader>
  );
};

export default CategoryCascaderButton;
