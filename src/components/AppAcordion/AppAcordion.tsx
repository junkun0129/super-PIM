import React, { ReactNode, useState } from "react";
export type AppAcordionProps = {
  items: { key: string; label: string; children: ReactNode }[];
};
const AppAcordion = ({ items }: AppAcordionProps) => {
  const [activeKeys, setactiveKeys] = useState<string[]>([]);
  const handleClick = (key: string) => {
    if (activeKeys.includes(key)) {
      const newKeys = activeKeys.filter((item) => item !== key);
      setactiveKeys(newKeys);
    } else {
      setactiveKeys((pre) => [...pre, key]);
    }
  };
  return (
    <div>
      {items.map((item, i) => {
        return (
          <div
            key={i + "-accordion"}
            className="rounded-lg bg-slate-500 my-3 shadow-lg hover:bg-slate-400"
          >
            <div
              className="p-2 px-3 flex justify-between"
              onClick={() => handleClick(item.key)}
            >
              <div className="text-white ">{item.label}</div>
              <div
                style={{
                  transform: activeKeys.includes(item.key)
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
                }}
                className="text-white text-lg"
              >
                {">"}
              </div>
            </div>
            {activeKeys.includes(item.key) && (
              <div className="bg-gray-200">{item.children}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppAcordion;
