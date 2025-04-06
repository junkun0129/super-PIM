import React, { useState } from "react";
import { Asset } from "../../api_dev/assets.api";
import AppDropDownList, {
  AppDropDownListProps,
} from "../AppDropDownList/AppDropDownList";
import AppButton from "../AppButton/AppButton";
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
    <div className="w-[200px] h-[260px] m-5 bg-white shadow-md relative">
      <div
        className="w-full h-1/2"
        style={{
          backgroundImage: `url(${asset.asset ? asset.asset.img : ""})`,
          backgroundSize: "contain",
        }}
      ></div>
      <div className="relative w-full flex px-2">
        <div className="flex flex-col w-full">
          <div className="w-full flex mt-3">
            <div className="w-1/3 font-bold">ID</div>
            <div className="w-2/3">：{asset.box.no}</div>
          </div>
          <div className="w-full flex mt-1">
            <div className="w-1/3 font-bold">ラベル</div>
            <div className="w-2/3">：{asset.box.lbl}</div>
          </div>
          <div className="w-full flex mt-1">
            <div className="w-1/3 font-bold">拡張子</div>
            <div className="w-2/3">：{asset.box.ext}</div>
          </div>
        </div>
        <AppDropDownList
          open={isOpen}
          onSelect={function (e: string): void {
            throw new Error("Function not implemented.");
          }}
          options={options}
          onClose={() => setisOpen(false)}
        >
          <div className="absolute right-0 -bottom-8">
            <AppButton
              text="⚙"
              type="normal"
              onClick={() => setisOpen(true)}
            ></AppButton>
          </div>
        </AppDropDownList>
      </div>
    </div>
  );
};

export default AppAsetBox;
