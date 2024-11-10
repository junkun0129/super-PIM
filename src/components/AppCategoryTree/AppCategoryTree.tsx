import React, { useCallback, useEffect, useRef, useState } from "react";
import { CategoryNode } from "../../data/categories/type";
import categoryApis from "../../api_dev/category.api";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { getObjectFromRowFormData } from "../../util";
import AppSortable from "../AppSortable/AppSortable";
type Props = {
  node: CategoryNode;
  updateCategoryTree: () => void;
  updateOrder: (a: { activeId: string; overId: string }) => void;
};
const AppCategoryTree = ({ node, updateCategoryTree, updateOrder }: Props) => {
  const [isOpen, setisOpen] = useState(false);
  const [isAdd, setisAdd] = useState(false);
  const { updateCategoryOrderApi, createCaetgoryApi } = categoryApis;
  const { setMessage } = useMessageContext();
  const [nameInput, setnameInput] = useState("");
  const ref = useRef();
  const handleClick = () => {
    setisOpen((pre) => {
      return !pre;
    });
  };
  const handleAdd = () => {
    setisAdd(true);
  };
  const handleSave = async (e) => {
    const value = getObjectFromRowFormData(e);
    const name = value["name"];
    if (name !== "") {
      const res = await createCaetgoryApi({
        body: {
          parent_cd: node.cd,
          name: name as string,
        },
      });
      if (res.result === "success") {
        setMessage("カテゴリの作成に成功しました");
        updateCategoryTree();
        setisOpen(true);
      }
    }

    setisAdd(false);
  };

  useEffect(() => {
    if (open) {
      window.addEventListener("mousedown", handleClose);
    } else {
      window.removeEventListener("mousedown", handleClose);
    }
  }, [open]);
  const handleClose = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setisAdd(false);
    }
  };

  return (
    <div id={node.cd} className="draggable drag-node ml-4">
      <div className="flex">
        <button onClick={handleClick}>{"<"}</button>
        <div>{node.name}</div>
        <button onClick={handleAdd}>+</button>
        <div>削除</div>
      </div>
      <div>
        {isAdd && (
          <div ref={ref}>
            <form onSubmit={handleSave}>
              <input
                name="name"
                value={nameInput}
                onChange={(e) => setnameInput(e.target.value)}
                autoFocus
              />
              <button type="submit">保存</button>
            </form>
          </div>
        )}
        {isOpen && !!node.children.length && (
          <AppSortable onDragEnd={updateOrder}>
            {node.children.map((child, i) => (
              <div key={i}>
                <AppCategoryTree
                  updateCategoryTree={updateCategoryTree}
                  key={child.cd + i}
                  node={child}
                  updateOrder={updateOrder}
                />
              </div>
            ))}
          </AppSortable>
        )}
      </div>
    </div>
  );
};

export default AppCategoryTree;
