import { useState } from "react";
import AppButton from "../../../components/AppButton/AppButton";
import { runWithConcurrency } from "../../../util";
import { deleteAttrApi } from "../../../api/attr.api";
import AppModal from "../../../components/AppModal/AppModal";
import { useMessageContext } from "../../../providers/MessageContextProvider";
type Props = {
  selectedKeys: string[];
  updateList: () => void;
};
const AttrDeleteButton = ({ selectedKeys, updateList }: Props) => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const context = useMessageContext();
  const handleClick = async () => {
    if (selectedKeys.length < 1) return;
    const tasks = selectedKeys.map(
      (item) => () => deleteAttrApi({ body: { atr_cd: item } })
    );
    const res = await runWithConcurrency(tasks, 10);
    context.setMessage("項目の削除に成功しました。");
    setisModalOpen(false);
    updateList();
  };

  return (
    <>
      <AppButton
        text={"削除"}
        disabled={selectedKeys.length < 1}
        onClick={() => setisModalOpen(true)}
        type={"primary"}
      />
      <AppModal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        title={"項目の削除"}
      >
        <div className="w-full">
          <div>
            {selectedKeys.length}この項目を削除します。
            <br />
            よろしいですか？
          </div>
          <div className="flex justify-end w-full">
            <AppButton
              text={"確定"}
              onClick={() => handleClick()}
              type={"normal"}
            />
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default AttrDeleteButton;
