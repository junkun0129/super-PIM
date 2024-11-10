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
  onSelect: (keys: string[]) => void;
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
  const [activeKeys, setActiveKeys] = useState<string[]>(["first"]);
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
      setActiveKeys(["first"]);
      window.removeEventListener("mousedown", handleClose);
    }
    // Cleanup listener on component unmount
    return () => window.removeEventListener("mousedown", handleClose);
  }, [open, handleClose]);

  const getDefaultValue = useCallback(() => {
    const newKeys = selectedKeys.slice();
    setActiveKeys(["first", ...newKeys]);
  }, [selectedKeys]);

  const handleClick = (
    node: CategoryNode,
    index: number,
    newKeys: string[]
  ) => {
    const newActiveKeys = newKeys.slice(0, index + 1);
    newActiveKeys.push(node.cd);
    setActiveKeys(newActiveKeys);
    if (!node.children.length) {
      onSelect(newActiveKeys.filter((item) => item !== "first"));
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
          {activeKeys.map((key, i) => {
            const nodeOptions =
              key === "first" ? options : findNodeByCd(key, options);
            if (!nodeOptions?.length) return null;
            return (
              <div className="" key={key + i}>
                {nodeOptions.map((node) => (
                  <div
                    style={
                      activeKeys.includes(node.cd)
                        ? { backgroundColor: "lightblue" }
                        : {}
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(node, i, activeKeys);
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
): CategoryNode[] | undefined {
  for (const node of nodes) {
    if (node.cd === cd) {
      return node.children;
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
