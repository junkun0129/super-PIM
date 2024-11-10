import React, { ReactNode, useEffect, useRef, useState } from "react";
type Props = {
  children: JSX.Element[];
  onDragEnd: (a: { activeId: string; overId: string }) => void;
};
const AppSortable = ({ children, onDragEnd }: Props) => {
  const [activeId, setactiveId] = useState("");
  const activeIdRef = useRef(activeId);

  // Update the ref value whenever activeId changes
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  function dragstart_handler(ev: DragEvent) {
    // 対象となる要素の id を DataTransfer オブジェクトに追加する
    const div: HTMLElement = ev.target;
    const ii = div.getElementsByClassName("drag-node");
    if (ii.length) {
      const name = ii[0].id;
      setactiveId(name);
    }

    ev.dataTransfer.setData("text", "s");
    ev.dataTransfer.effectAllowed = "move";
  }
  function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  function drop_handler(ev: DragEvent) {
    ev.preventDefault();
    // 移動された要素の id を取得して、その要素を target の DOM に追加する
    const data = ev.dataTransfer.getData("text");
    onDragEnd({
      activeId: activeIdRef.current ?? "",
      overId: getTargetElement(ev.target).id,
    });
    setactiveId("");
    // ev.target.appendChild(document.getElementById(data));
  }
  const dragenter_handler = (ev) => {
    const dragNode = getTargetElement(ev.target);
    dragNode.style.backgroundColor = "red";
  };
  const dragleave_handler = (ev) => {
    const dragNode = getTargetElement(ev.target);
    dragNode.style.backgroundColor = "";
  };
  const getTargetElement = (element: HTMLElement) => {
    if (element.className.includes("drag-node")) {
      return element;
    } else {
      return getTargetElement(element.parentElement);
    }
  };
  return (
    <div>
      {children.map((Item) => {
        return (
          <div
            draggable="true"
            onDragStart={dragstart_handler}
            onDrop={drop_handler}
            onDragOver={dragover_handler}
            onDragEnter={dragenter_handler}
            onDragLeave={dragleave_handler}
          >
            {Item}
          </div>
        );
      })}
    </div>
  );
};

export default AppSortable;
