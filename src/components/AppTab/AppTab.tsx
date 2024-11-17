import React, { useEffect, useState } from "react";
import { AppTabProps } from "./type";

const AppTab = ({ data, activeId: activeIdProp, onChange }: AppTabProps) => {
  const [activeId, setactiveId] = useState<string>(activeIdProp ?? "0");

  useEffect(() => {
    setactiveId(activeIdProp);
  }, [activeIdProp]);
  const handleClick = (id: string) => {
    console.log(id);
    if (!activeIdProp) {
      setactiveId(id);
    }
    onChange(id);
  };
  return (
    <div className="w-full h-full">
      {/* Label */}
      <div className="flex">
        {data.map((node, i) => (
          <div
            key={i}
            style={{
              color: activeId === node.key ? "green" : "",
              borderBottom: activeId === node.key ? "green solid 2px" : "",
              cursor: "pointer",
            }}
            className="p-2 my-3 mx-1"
            onClick={() => {
              handleClick(node.key);
            }}
          >
            {node.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="w-full f-full relative">
        {data.map((node, i) => (
          <div
            style={{
              opacity: activeId === node.key ? 1 : 0,
              zIndex: activeId === node.key ? 1 : 0,
            }}
            className=" absolute w-full h-full"
            key={i + "-tab-content"}
          >
            {node.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppTab;
