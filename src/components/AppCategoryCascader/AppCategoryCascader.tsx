import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getLinkedCategoryArray } from "../../util";
import { CategoryTree } from "../../api/category.api";

type Props = {
  selectedKeys: string[];
  options: CategoryTree[];
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
      return { key, value: node?.ctg_name || "" };
    });
    setActiveEntries([{ key: "first", value: "first" }, ...newEntries]);
  }, [selectedKeys]);

  const handleClick = (
    node: CategoryTree,
    index: number,
    entries: { key: string; value: string }[]
  ) => {
    const newActiveEntriess = entries.slice(0, index + 1);
    newActiveEntriess.push({ key: node.ctg_cd, value: node.ctg_name });
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
            if (!nodeOptions || !nodeOptions.length) return;
            return (
              <div className="" key={key + i}>
                {nodeOptions.map((node) => (
                  <button
                    className="flex flex-col w-full  items-start px-2 py-1 hover:bg-slate-100"
                    style={
                      activeEntries
                        .map((item) => item.key)
                        .includes(node.ctg_cd)
                        ? { backgroundColor: "#c6d9e8" }
                        : {}
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(node, i, activeEntries);
                    }}
                    key={node.ctg_cd}
                  >
                    {node.ctg_name}
                  </button>
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
  nodes: CategoryTree[]
): CategoryTree | undefined {
  for (const node of nodes) {
    if (node.ctg_cd === cd) {
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
  nodes: CategoryTree[]
): CategoryTree[] | undefined {
  for (const node of nodes) {
    if (node.ctg_cd === cd) {
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

export function findCategoryPath(
  tree: CategoryTree[],
  targetCtgCd: string
): string[] {
  const path: string[] = [];

  function dfs(node: CategoryTree, currentPath: string[]): boolean {
    currentPath.push(node.ctg_cd);

    if (node.ctg_cd === targetCtgCd) {
      return true; // 見つかった！
    }

    if (node.children) {
      for (const child of node.children) {
        if (dfs(child, currentPath)) {
          return true; // 子の中で見つかったらOK
        }
      }
    }

    currentPath.pop(); // 戻る（バックトラック）
    return false;
  }

  for (const root of tree) {
    if (dfs(root, path)) {
      break; // 見つかったら終了
    }
  }

  return path;
}
