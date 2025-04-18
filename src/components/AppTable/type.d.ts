export type Column<T extends Object> = {
  header: string | JSX.Element;
  accessor: keyof T; // 各列がオブジェクトのどのキーを使用するか
};

export type TableProps<T extends Object> = {
  key: string;
  data: T[];
  columns: Column<T>[];
  onRowClick: (id: string) => void;
  currentPage: number;
  pagination: number;
  total: number;
  onRowClickKey?: keyof T;
  onCurrentPageChange: (page: number) => void;
  onPaginationChange: (pagination: number) => void;
  draggableAccesor?: keyof T;
  onDrop?: ({ activeCd, overCd }: { activeCd: string; overCd: string }) => void;
  checkable?: boolean;
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
};

export type PageSetting = {
  pagination: number;
  currentPage: number;
};
