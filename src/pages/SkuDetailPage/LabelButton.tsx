import React, { useEffect, useState } from "react";
import labelApis from "../../api_dev/labels.api";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import { useParams } from "react-router-dom";
type Props = {
  labelProps: string;
  update: () => void;
};
const LabelButton = ({ labelProps, update }: Props) => {
  const { sku_cd } = useParams();
  const [selectedLabels, setselectedLabels] = useState<LabelsTable[]>([]);
  const [options, setoptions] = useState<{ cd: string; label: string }[]>([]);
  const [open, setopen] = useState(false);
  const { getAllLabelsApi, updateProductLabelsApi } = labelApis;
  useEffect(() => {
    updateLabel();
  }, [labelProps]);

  const updateLabel = async () => {
    const res = await getAllLabelsApi();
    if (res.result !== "success") return;
    const currentLabels: string[] = labelProps.split(";");
    const newSelectedLabels: LabelsTable[] = [];
    const newOptions = res.data.filter((option) => {
      if (currentLabels.includes(option.name)) {
        newSelectedLabels.push(option);
        return false;
      }
      return true;
    });
    setoptions(newOptions.map((item) => ({ cd: item.name, label: item.name })));
    setselectedLabels(newSelectedLabels);
  };
  const handleSelect = async (name: string) => {
    console.log(name);
    const res = await updateProductLabelsApi({
      body: {
        add: [name],
        deleted: [],
      },
      product_cd: sku_cd,
    });
    if (res.result !== "success") return;
    update();
    setopen(false);
  };

  const handleDelete = async (name: string) => {
    const res = await updateProductLabelsApi({
      product_cd: sku_cd,
      body: {
        add: [],
        deleted: [name],
      },
    });
    if (res.result !== "success") return;
    update();
  };
  
  return (
    <div>
      <div>ラベル一覧</div>
      <AppDropDownList
        options={options}
        onClose={() => setopen(false)}
        open={open}
        onSelect={handleSelect}
      >
        <button onClick={() => setopen(true)}>＋</button>
      </AppDropDownList>
      <div className="flex">
        {selectedLabels.map((item) => (
          <div
            className="flex rounded p-2 m-2 justify-center items-center"
            key={item.cd}
          >
            <div
              style={{ backgroundColor: item.color }}
              className="w-[10px] h-[10px]"
            ></div>
            <div>{item.name}</div>
            <button onClick={() => handleDelete(item.name)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelButton;
