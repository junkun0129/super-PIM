import React, { useState } from "react";
import AppButton from "../AppButton/AppButton";
import AppModal from "../AppModal/AppModal";
import SeriesCreateModal from "./components/SeriesCreateModal";
import AppSearchBar from "../AppSearchBar/AppSearchBar";
type AppTableHeaderProps = {
  updateList: () => void;
};
const AppTableHeader = ({ updateList }: AppTableHeaderProps) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-[50px] rounded-sm my-2 mb-6 bg-white shadow-md flex items-center p-3 justify-between">
      <div className="flex items-center">
        <AppSearchBar />
        <AppButton
          text="フィルター"
          type="normal"
          onClick={() => console.log("object")}
        />
      </div>

      <div className="flex items-center">
        <AppButton
          text="削除"
          type="normal"
          onClick={() => console.log("object")}
        />
        <AppButton
          text="ステータス変更"
          type="normal"
          onClick={() => console.log("object")}
        />
      </div>

      <AppButton
        text="＋新シリーズ作成"
        type="primary"
        onClick={() => setisModalOpen(true)}
      />
      <SeriesCreateModal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        updateList={updateList}
      />
    </div>
  );
};

export default AppTableHeader;
