export type Column<T extends Object> = {
  key: string;
  header: string | JSX.Element;
  accessor: keyof T; // 各列がオブジェクトのどのキーを使用するか
  width?: number;
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
  isColumnResizable?: boolean;
  onCurrentPageChange: (page: number) => void;
  onPaginationChange: (pagination: number) => void;
  isWithCustom?: boolean;
  draggableAccesor?: keyof T;
  onDrop?: ({ activeCd, overCd }: { activeCd: string; overCd: string }) => void;
  checkable?: boolean;
  isColumnDraggable?: boolean;
  onColumnDrop?: (activeCd: string, overCd: string) => void;
  selectedKeys?: string[];
  onWidthChange?: (cd: string, width: number) => void;
  onSelectedKeysChange?: (keys: string[]) => void;
};

export type PageSetting = {
  pagination: number;
  currentPage: number;
};
