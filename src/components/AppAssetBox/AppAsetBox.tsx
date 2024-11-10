import React, { useState } from "react";
import { Asset } from "../../api_dev/assets.api";
import AppDropDownList, {
  AppDropDownListProps,
} from "../AppDropDownList/AppDropDownList";
type AppAssetBoxProps = {
  acordionKey: string;
  asset: Asset;
};
const AppAsetBox = ({ acordionKey, asset }: AppAssetBoxProps) => {
  const [isOpen, setisOpen] = useState(false);
  const options: AppDropDownListProps["options"] = [
    {
      cd: "dd",
      label: "アップド",
    },
  ];
  return (
    <div>
      <div
        className="w-[100px] h-[100px]"
        style={{
          backgroundImage: `url(${asset.asset ? asset.asset.img : ""})`,
          backgroundSize: "contain",
        }}
      ></div>
      <div className="relative">
        <div>ID:{asset.box.no}</div>
        <div>ラベル:{asset.box.lbl}</div>
        <div>拡張子:{asset.box.ext}</div>
        <AppDropDownList
          open={isOpen}
          onSelect={function (e: string): void {
            throw new Error("Function not implemented.");
          }}
          options={options}
          onClose={() => setisOpen(false)}
        >
          <button
            onClick={() => setisOpen(true)}
            className="absolute right-0 bottom-0"
          >
            ⚙
          </button>
        </AppDropDownList>
      </div>
    </div>
  );
};

export default AppAsetBox;
