import React from "react";
import AppModal from "../../components/AppModal/AppModal";
import AppButton from "../../components/AppButton/AppButton";
import { DeleteProductApi, DeleteProductApiRes } from "../../api/product.api";
import { runWithConcurrency } from "../../util";
import { useMessageContext } from "../../providers/MessageContextProvider";
type Props = {
  open: boolean;
  updateList: () => void;
  onClose: () => void;
  selectedKeys: string[];
};
const ProductDeleteModal = ({
  open,
  updateList,
  onClose,
  selectedKeys,
}: Props) => {
  const context = useMessageContext();
  const handleDelete = async () => {
    const promises = selectedKeys.map(
      (key, i) => () => DeleteProductApi({ body: { cd: key } })
    );
    const res = await runWithConcurrency(promises, 1);
    context.setMessage("選択された商品が削除されました。");
    updateList();
    onClose();
  };
  return (
    <AppModal open={open} onClose={onClose} title={"商品の削除"}>
      <h3>{`${
        selectedKeys.length ?? 0
      }個の商品を削除します。よろしいですか`}</h3>
      <p>
        ※削除した商品は ”削除済み”
        一覧表示に切り替えることで表示することができます。
      </p>

      <div className="flex">
        <AppButton text={"削除"} onClick={handleDelete} type={"primary"} />
        <AppButton text={"キャンセル"} onClick={onClose} type={"normal"} />
      </div>
    </AppModal>
  );
};

export default ProductDeleteModal;
