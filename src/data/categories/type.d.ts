type CategoryTable = {
  cd: string;
  name: string;
  description: string;
  order: number;

  //他のCategoryTableの値のcd
  parent_cd: string;
};

export type CategoryNode = CategoryTable & { children: CategoryNode[] };
