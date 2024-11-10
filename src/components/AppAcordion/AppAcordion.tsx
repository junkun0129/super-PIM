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
      {items.map((item) => {
        return (
          <div>
            <div onClick={() => handleClick(item.key)}> {item.label}</div>
            {activeKeys.includes(item.key) && <div>{item.children}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default AppAcordion;
