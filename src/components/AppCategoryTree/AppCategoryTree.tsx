import React, { useCallback, useEffect, useRef, useState } from "react";

import categoryApis from "../../api_dev/category.api";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { getObjectFromRowFormData } from "../../util";
import AppSortable from "../AppSortable/AppSortable";
import {
  CategoryNode,
  CategoryTree,
  createCategoryApi,
  deleteCategoryApi,
} from "../../api/category.api";
import AppInput from "../AppInput/AppInput";
type Props = {
  node: CategoryTree;
  updateCategoryTree: () => void;
  updateOrder: (a: {
    activeCd: string;
    overCd: string;
    parent_cd: string;
  }) => void;
};
const AppCategoryTree = ({ node, updateCategoryTree, updateOrder }: Props) => {
  const [isOpen, setisOpen] = useState(false);
  const [isAdd, setisAdd] = useState(false);
  const [isMouseOver, setisMouseOver] = useState(false);
  const { updateCategoryOrderApi, createCaetgoryApi } = categoryApis;
  const [hasChildren, setHasChildren] = useState(!!node.children?.length);
  const { setMessage } = useMessageContext();
  const [nameInput, setnameInput] = useState("");
  const ref = useRef();
  const handleClick = (e) => {
    e.stopPropagation();
    setisOpen((pre) => {
      return !pre;
    });
  };
  const handleAdd = (e) => {
    e.stopPropagation();
    setisAdd(true);
  };

  const handleOnBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = e.target.value;
    if (!value) return setisAdd(false);

    const res = await createCategoryApi({
      body: {
        ctg_name: value,
        parent_cd: node.ctg_cd,
      },
    });
    setMessage(res.message);
    setisAdd(false);
    setnameInput("");
    updateCategoryTree();
  };

  const handleDelete = async () => {
    const res = await deleteCategoryApi({ body: { ctg_cd: node.ctg_cd } });
    setMessage(res.message);
    updateCategoryTree();
  };
  return (
    <div
      onMouseOver={() => setisMouseOver(true)}
      onMouseLeave={() => setisMouseOver(false)}
      id={node.ctg_cd}
      className="draggable drag-node ml-4 "
      onClick={handleClick}
    >
      <div className="flex items-center px-3 py-1 y-4  rounded-md shadow-md border border-slate-300 hover:bg-slate-200">
        <button
          className="text-lg text-slate-500"
          style={{
            opacity: hasChildren ? 1 : 0,
            transform: isOpen ? `rotate(90deg)` : `rotate(0deg)`,
          }}
        >
          {"⊳"}
        </button>
        <div className=" mx-4">{node.ctg_name}</div>
        {isMouseOver && (
          <button
            onClick={handleAdd}
            className="px-2 rounded-md text-lg  text-slate-500 hover:bg-slate-300 ml-4"
          >
            +
          </button>
        )}
        {isMouseOver && (
          <div
            onClick={handleDelete}
            className="px-1 rounded-md text-slate-500 hover:bg-slate-300 ml-1 text-sm p-1 "
          >
            削除
          </div>
        )}
      </div>
      <div>
        {isAdd && (
          <div
            ref={ref}
            className="ml-10 flex p-3 border border-slate-500 m-3  rounded-md shadow-lg"
          >
            <input
              type={"text"}
              className="p-1 px-2 text-md w-[50%]"
              placeholder="作成するカテゴリ名を入力してください"
              autoFocus={true}
              name={""}
              value={nameInput}
              onChange={(e) => setnameInput(e.target.value)}
              onBlur={handleOnBlur}
            />
          </div>
        )}
        {isOpen && !!node.children.length && (
          <AppSortable
            layerCd={node.ctg_cd}
            onDrop={({ activeCd, overCd }) => {
              updateOrder({ activeCd, overCd, parent_cd: node.ctg_cd });
            }}
          >
            {node.children.map((child, i) => (
              <div key={child.ctg_cd} className="ml-3">
                <AppCategoryTree
                  updateCategoryTree={updateCategoryTree}
                  key={child.ctg_cd + i}
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
