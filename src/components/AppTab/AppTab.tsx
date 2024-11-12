import React, { useEffect, useState } from "react";
import { AppTabProps } from "./type";

const AppTab = ({ data, activeId: activeIdProp, onChange }: AppTabProps) => {
  const [activeId, setactiveId] = useState<string>(activeIdProp ?? "0");
  console.log(data);
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
            style={
              node.key === activeId ? { backgroundColor: "lightblue" } : {}
            }
            className="border border-indigo-950 p-3"
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
