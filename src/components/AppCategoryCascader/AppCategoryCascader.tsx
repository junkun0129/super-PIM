import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CategoryNode } from "../../data/categories/type";
import { getLinkedCategoryArray } from "../../util";

type Props = {
  selectedKeys: string[];
  options: CategoryNode[];
  open: boolean;
  onSelect: (keys: { key: string; value: string }[]) => void;
  children: ReactNode;
  onClose: () => void;
};

const AppCategoryCascader = ({
  selectedKeys,
  options,
  open,
  children,
  onSelect,
  onClose,
}: Props) => {
  const [activeEntries, setActiveEntries] = useState<
    { key: string; value: string }[]
  >([{ key: "first", value: "first" }]);
  const ref = useRef<HTMLDivElement>(null);

  // Handle outside click
  const handleClose = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  // Effect to manage open/close state and add/remove event listener
  useEffect(() => {
    if (open) {
      window.addEventListener("mousedown", handleClose);
      getDefaultValue();
    } else {
      setActiveEntries([{ key: "first", value: "first" }]);
      window.removeEventListener("mousedown", handleClose);
    }
    // Cleanup listener on component unmount
    return () => window.removeEventListener("mousedown", handleClose);
  }, [open, handleClose]);

  const getDefaultValue = useCallback(() => {
    const newKeys = selectedKeys.slice();
    const newEntries = newKeys.map((key) => {
      const node = findNodeByCd(key, options);
      return { key, value: node?.name || "" };
    });
    setActiveEntries([{ key: "first", value: "first" }, ...newEntries]);
  }, [selectedKeys]);

  const handleClick = (
    node: CategoryNode,
    index: number,
    entries: { key: string; value: string }[]
  ) => {
    const newActiveEntriess = entries.slice(0, index + 1);
    newActiveEntriess.push({ key: node.cd, value: node.name });
    setActiveEntries(newActiveEntriess);
    if (!node.children.length) {
      onSelect(newActiveEntriess.filter((item) => item.key !== "first"));
    }
  };

  return (
    <div className="relative">
      {children}
      {open && (
        <div
          ref={ref}
          className="absolute left-0 top-full p-2 flex shadow-md border bg-white z-10"
        >
          {activeEntries.map(({ key, value }, i) => {
            const nodeOptions =
              key === "first" ? options : findNextNodeByCd(key, options);
            if (!nodeOptions.length) return;
            return (
              <div className="" key={key + i}>
                {nodeOptions.map((node) => (
                  <div
                    style={
                      activeEntries.map((item) => item.key).includes(node.cd)
                        ? { backgroundColor: "lightblue" }
                        : {}
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(node, i, activeEntries);
                    }}
                    key={node.cd}
                  >
                    {node.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppCategoryCascader;

function findNodeByCd(
  cd: string,
  nodes: CategoryNode[]
): CategoryNode | undefined {
  for (const node of nodes) {
    if (node.cd === cd) {
      return node;
    }
    if (node.children) {
      const found = findNodeByCd(cd, node.children);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

function findNextNodeByCd(
  cd: string,
  nodes: CategoryNode[]
): CategoryNode[] | undefined {
  for (const node of nodes) {
    if (node.cd === cd) {
      return node.children;
    }
    if (node.children) {
      const found = findNextNodeByCd(cd, node.children);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}
