import { COOKIES } from "./constant";
import { CategoryNode, CategoryTable } from "./data/categories/type";

export function generateRandomString(length: number = 35) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export const isoToDateText = (iso: string) => {
  if (iso === "" || !iso) return "";
  const date = new Date(iso);

  const formatted = `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日`;
  return formatted;
};
export const flagToBoolean = ({ flag }: { flag: string }) => {
  if (flag === "0") {
    return false;
  }
  if (flag === "1") {
    return true;
  }
  return false;
};

export const flagToText = ({
  flag,
  okText,
  notText,
}: {
  flag: string;
  okText: string;
  notText: string;
}) => {
  if (flag === "0") {
    return notText;
  }
  if (flag === "1") {
    return okText;
  }
  return "";
};

export function getSeriesImg(fileName: string) {
  return "/img/series/" + fileName;
}
export function arrayMove(array: any[], fromIndex: number, toIndex: number) {
  // 配列が空でないこと、インデックスが有効であることを確認
  if (fromIndex === toIndex) return array; // 同じ位置であれば変更しない

  // 配列をコピーしてから処理を行う
  const newArray = [...array];

  // 取り出すアイテム
  const [movedItem] = newArray.splice(fromIndex, 1);

  // 新しい位置に挿入
  newArray.splice(toIndex, 0, movedItem);

  return newArray;
}

export const getCookie = (name: string) => {
  const cookie = document.cookie;
  const cookieArray = cookie.split("; ");
  for (const c of cookieArray) {
    const [key, value] = c.split("=");
    if (key === name) {
      return value;
    }
  }
  return "";
};
export const padZero = (num: number): string => {
  return num.toString().padStart(2, "0");
};
export const setCookie = (name: string, value: string, days: number = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const resetAllCookies = () => {
  Object.values(COOKIES).forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function buildCategoryTree(categories: CategoryTable[]): CategoryNode[] {
  const categoryMap: { [cd: string]: CategoryNode } = {};
  const tree: CategoryNode[] = [];

  // Initialize the map with each category and add an empty children array.
  categories.forEach((category) => {
    categoryMap[category.cd] = { ...category, children: [] };
  });

  // Populate the tree structure.
  categories.forEach((category) => {
    if (category.parent_cd) {
      // If the category has a parent, add it to the parent's children array.
      categoryMap[category.parent_cd].children.push(categoryMap[category.cd]);
    } else {
      // If the category has no parent, it’s a root node, so add it to the tree.
      tree.push(categoryMap[category.cd]);
    }
  });
  // Sort the tree nodes and their children by order.
  function sortTree(nodes: CategoryNode[]) {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach((node) => sortTree(node.children));
  }

  sortTree(tree);

  return tree;
}
export const getLinkedCategoryArray = (
  cd: string,
  references: CategoryTable[]
): CategoryTable[] => {
  const result: CategoryTable[] = [];
  const findNode = (code: string) => {
    const node = references.find((item) => item.cd === code);
    if (node) {
      result.push(node);
      if (node.parent_cd) {
        findNode(node.parent_cd);
      }
    }
  };
  findNode(cd);
  return result;
};

export function getCategoryTreeByCd(cd: string, references: CategoryTable[]) {
  const makeNode = (
    categoriesArray: CategoryTable[],
    node: CategoryNode | null = null
  ): CategoryNode => {
    if (!categoriesArray.length) return node!;

    const newNode: CategoryNode = {
      ...categoriesArray[0],
      children: node ? [node] : [],
    };

    // Return the result of the recursive call
    return makeNode(categoriesArray.slice(1), newNode);
  };

  const linkedCategoriesArray = getLinkedCategoryArray(cd, references);
  const node = makeNode(linkedCategoriesArray);
  return node;
}

export const getObjectFromRowFormData = (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  const formdata = new FormData(event.currentTarget);
  const formvalue = Object.fromEntries(formdata.entries());
  return formvalue;
};

export function labelDeleteString(str, target) {
  // 先頭に指定された文字がある場合に取り除く
  if (str.startsWith(target)) {
    str = str.slice(target.length);
  }

  // 重複している部分を排除
  const regex = new RegExp(`${target}{2,}`, "g");
  str = str.replace(regex, target);

  return str;
}
export function removeSpecificString(input, stringToRemove) {
  const regex = new RegExp(stringToRemove, "g");
  return input.replace(regex, "");
}

export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  let i = 0;
  const enqueue = async () => {
    if (i >= tasks.length) return;

    const taskIndex = i++;
    const task = tasks[taskIndex];

    const p = task().then((result) => {
      results[taskIndex] = result;
    });

    const e = p.finally(() => {
      executing.splice(executing.indexOf(e), 1);
    });

    executing.push(e);

    if (executing.length >= concurrency) {
      await Promise.race(executing); // Wait for the first one to finish
    }

    return enqueue(); // Continue with next task
  };

  await Promise.all(new Array(concurrency).fill(0).map(() => enqueue()));
  return results;
}
export const normalizeBoolean = (value: any): boolean | null => {
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  if (value === true || value === false) return value;
  return null;
};
export function moveBehindByKey<T extends Record<string, any>>(
  arr: T[],
  activeKey: string,
  overKey: string,
  targetKey: keyof T
): T[] | undefined {
  if (!arr.every((obj) => targetKey in obj)) return;
  const fromIndex = arr.findIndex((item) => item[targetKey] === activeKey);
  const toIndex = arr.findIndex((item) => item[targetKey] === overKey);

  if (fromIndex === -1 || toIndex === -1) return arr;

  const newArr = [...arr];
  const [movedItem] = newArr.splice(fromIndex, 1);

  // 挿入位置：spliceで要素が1つ減った場合の補正あり
  const insertAt = fromIndex < toIndex ? toIndex : toIndex;

  newArr.splice(insertAt, 0, movedItem);
  return newArr;
}

export function changeOrderByOrder<T extends Record<string, any>>(
  arr: T[],
  orderKey: keyof T
) {
  if (arr.map((item) => item[orderKey]).some((item) => isNaN(item))) return arr;
  const newArr = [...arr];
  let minimum = newArr[0][orderKey];
  newArr.forEach((item) => {
    if (item[orderKey] < minimum) {
      minimum = item[orderKey];
    }
  });
  return newArr.map((item, i) => {
    if (i === 0) return item;
    return {
      ...item,
      [orderKey]: minimum + i,
    };
  });
}
