import React, { ReactNode, useEffect, useRef, useState } from "react";
type Props = {
  children: ReactNode;
  onDragEnd: (e: DragEvent) => void;
};
const SortElement = ({ children, onDragEnd }: Props) => {
  function dragstart_handler(ev: DragEvent) {
    // 対象となる要素の id を DataTransfer オブジェクトに追加する

    ev.dataTransfer.setData("text", "s");
    ev.dataTransfer.effectAllowed = "move";
  }
  function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  function drop_handler(ev) {
    ev.preventDefault();
    // 移動された要素の id を取得して、その要素を target の DOM に追加する
    const data = ev.dataTransfer.getData("text");
    onDragEnd(ev);
    // ev.target.appendChild(document.getElementById(data));
  }
  const dragenter_handler = (ev) => {
    ev.target.style.backgroundColor = "red";
  };
  const dragleave_handler = (ev) => {
    ev.target.style.backgroundColor = "";
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            draggable: true,
            onDragStart: dragstart_handler,
            onDrop: drop_handler,
            onDragOver: dragover_handler,
            onDragEnter: dragenter_handler,
            onDragLeave: dragleave_handler,
            ...child.props, // Spread other original props
          });
        }
        return child;
      })}
    </div>
  );
};

export default SortElement;
