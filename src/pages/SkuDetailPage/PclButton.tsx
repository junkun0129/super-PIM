import React, { useState } from "react";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import pclApi from "../../api_dev/pcl.api";
import productApi from "../../api_dev/product.api";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { useParams } from "react-router-dom";
type Props = {
  pcl_name: string;
};
const PclButton = ({ pcl_name }: Props) => {
  const { sku_cd } = useParams();
  const [open, setopen] = useState<boolean>(false);
  const [options, setoptions] = useState<{ cd: string; label: string }[]>([]);
  const { setMessage } = useMessageContext();
  const { getPclsApi } = pclApi;
  const { updateProductPclApi } = productApi;

  const handleSelect = async (pcl_cd: string) => {
    const res = await updateProductPclApi({ product_cd: sku_cd, pcl_cd });
    if (res.result !== "success") return;
    setMessage("商品分類を変更しました");
    setopen(false);
  };

  const handleButtonClick = async () => {
    const res = await getPclsApi();
    setoptions(
      res.data.map((item) => {
        return {
          cd: item.cd,
          label: item.pcl_name,
        };
      })
    );
    setopen(true);
  };
  return (
    <AppDropDownList open={open} onSelect={handleSelect} options={options}>
      <button onClick={() => handleButtonClick()}>{pcl_name}</button>
    </AppDropDownList>
  );
};

export default PclButton;
