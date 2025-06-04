import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Column, TableProps } from "./type";
import AppButton from "../AppButton/AppButton";
import { layout } from "../../constant";
import { moveBehindByKey } from "../../util";
const paginatonOption = [10, 25, 50, 100];
function AppTable<T extends Object>({
  key,
  data,
  columns: columnsProps,
  onRowClick,
  currentPage,
  pagination,
  onCurrentPageChange,
  onPaginationChange,
  total,
  onRowClickKey,
  draggableAccesor,
  onDrop,
  checkable = true,
  isWithCustom = false,
  isColumnResizable = false,
  isColumnDraggable = false,
  selectedKeys: selectedKeysProps,
  onColumnDrop,
  onSelectedKeysChange,
  onWidthChange,
}: TableProps<T>) {
  const [activeCd, setactiveCd] = useState<null | string>(null);
  const [overCd, setoverCd] = useState<null | string>(null);
  const [activeColumnCd, setactiveColumnCd] = useState<null | string>(null);
  const [overColumnCd, setoverColumnCd] = useState<null | string>(null);
  const [columns, setcolumns] = useState<Column<T>[]>([]);
  const [dataSource, setdataSource] = useState<T[]>([]);
  const [allChecked, setallChecked] = useState<{
    checked: boolean;
    apply: boolean;
  }>({
    checked: false,
    apply: false,
  });
  const [hoverColumnKey, sethoverColumnKey] = useState<string | null>(null);
  useEffect(() => {
    const newData = data;
    const newColumns = columnsProps;
    const { newData: updatedData, newColumns: updatedColumn } = updateCheckBox(
      newData,
      newColumns,
      checkable
    );
    setdataSource(updatedData);
    setcolumns(updatedColumn);
  }, [data, columnsProps, checkable, selectedKeysProps]);

  const draggingIndex = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const widthChangedColumn = useRef<{ cd: string; width: number } | null>(null);

  useEffect(() => {
    if (!onSelectedKeysChange) return;
    if (!allChecked.apply) return;
    if (allChecked.checked) {
      let newSelectedKeys = [];
      dataSource.map((item) => {
        newSelectedKeys.push(item["cd"]);
      });
      onSelectedKeysChange([
        ...new Set([...selectedKeysProps, ...newSelectedKeys]),
      ]);
    } else {
      let onPageKeys = dataSource.map((item) => item["cd"]);
      let newSelectedKeys = selectedKeysProps.filter((item) => {
        const is = onPageKeys.includes(item);

        return !is;
      });
      onSelectedKeysChange(newSelectedKeys);
    }
  }, [allChecked]);

  const updateCheckBox = (
    data: T[],
    columns: Column<T>[],
    checkable: boolean
  ) => {
    let newData = [...data];
    let newColumns = [...columns];
    if (checkable) {
      newColumns = [
        {
          key: "check",
          accessor: "check" as keyof T,
          header: (
            <input
              className="w-4 h-4 flex justify-center items-center"
              type="checkbox"
              checked={allChecked.checked}
              onChange={(e) => {
                setallChecked({
                  checked: e.target.checked,
                  apply: true,
                });
              }}
            />
          ),
        },
        ...newColumns,
      ];
      newData = newData.map((item) => {
        let newItem = { ...item };
        newItem["check"] = <CheckInput item={item} />;
        return newItem;
      });
    } else {
      newColumns = newColumns.filter((column) => column.accessor !== "check");
      newData = newData.map((item) => {
        const newItem = { ...item };
        delete newItem["check"];
        return newItem;
      });
    }
    return { newData, newColumns };
  };

  const CheckInput = useCallback(
    ({ item }: { item: T }) => (
      <input
        className="w-4 h-4 flex justify-center items-center mt-1"
        type="checkbox"
        checked={selectedKeysProps.includes(item["cd"])}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(e) => {
          e.stopPropagation();
          const isChecked = (e.target as HTMLInputElement).checked;
          if (isChecked) {
            const newSelectedKeys = [...selectedKeysProps, item["cd"]];
            if (onSelectedKeysChange) {
              onSelectedKeysChange(newSelectedKeys);
            }
          } else {
            const newSelectedKeys = selectedKeysProps.filter(
              (key) => key !== item["cd"]
            );
            if (onSelectedKeysChange) {
              onSelectedKeysChange(newSelectedKeys);
            }
          }
        }}
      />
    ),
    [selectedKeysProps]
  );

  const handleRowClick = (row: T) => {
    if (onRowClickKey) {
      if (onRowClickKey in row) {
        const selected_value = row[onRowClickKey as keyof typeof row];
        onRowClick(selected_value as string);
      } else {
        onRowClick("not valid");
      }
    } else {
      if ("cd" in row && row["cd"] === "string") {
        onRowClick(row.cd);
      } else {
        onRowClick("not valid");
      }
    }
  };
  const handleDragEnd = (event: React.DragEvent<HTMLTableRowElement>) => {
    const allHovered = document.querySelectorAll(".tbc");
    allHovered.forEach((el) => {
      (el as HTMLElement).style.backgroundColor = "";
    });
  };
  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    newActiveCd: string
  ) => {
    setactiveCd(newActiveCd);
  };
  const handleDragLeave = (event: React.DragEvent<HTMLTableRowElement>) => {
    const current = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as HTMLElement | null;

    // relatedTarget が currentTarget の内部にまだあるなら、離れてないとみなす
    if (related && current.contains(related)) return;

    current.style.backgroundColor = "";
  };

  const handleDragEnter = (event: React.DragEvent<HTMLTableRowElement>) => {
    (event.currentTarget as HTMLElement).style.backgroundColor = "#c6d9e8 ";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLTableRowElement>,
    cd: string
  ) => {
    const div = event.view.document.getElementsByClassName(cd);
    if (div && div.length > 0) {
      (div[0] as HTMLElement).style.backgroundColor = "";
    }
    if (activeCd && overCd) {
      onDrop({ activeCd, overCd });
    }
    setactiveCd(null);
    setoverCd(null);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLTableRowElement>,
    newOverCd: string
  ) => {
    event.preventDefault();
    setoverCd(newOverCd);
  };
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    draggingIndex.current = index;
    startX.current = e.clientX;
    startWidth.current = !!columns[index].width ? columns[index].width : 0;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingIndex.current === null) return;
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff);
    widthChangedColumn.current = {
      width: newWidth,
      cd: columns[draggingIndex.current].key,
    };
    setcolumns((prev) => {
      const updated = [...prev];
      updated[draggingIndex.current!] = {
        ...updated[draggingIndex.current!],
        width: newWidth,
      };
      return updated;
    });
  };
  const handleMouseUp = () => {
    draggingIndex.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    if (!widthChangedColumn.current) return;
    const { cd, width } = widthChangedColumn.current;
    onWidthChange(cd, width);
    widthChangedColumn.current = null;
  };
  const handleColumnDragStart = (e: React.MouseEvent, key: string) => {
    setactiveColumnCd(key);
  };
  const handleColumnDrop = (e: React.MouseEvent, key: string) => {
    if (activeColumnCd && overColumnCd) {
      const newColumns = moveBehindByKey(
        columns,
        activeColumnCd,
        overColumnCd,
        "key"
      );
      setcolumns(newColumns);
      setactiveColumnCd(null);
      setoverColumnCd(null);
      onColumnDrop(activeColumnCd, overColumnCd);
    }
    setactiveColumnCd(null);
    setoverColumnCd(null);
  };
  const handleColumnDragEnter = (e: React.MouseEvent) => {};
  const handleColumnDragLeave = (e: React.MouseEvent) => {};
  const handleColumnDragOver = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setoverColumnCd(key);
    if (!activeColumnCd) return;
    const newColmns = moveBehindByKey(columns, activeColumnCd, key, "key");
    setcolumns(newColmns);
  };
  const handleColumnDragEnd = (e: React.MouseEvent) => {};
  return (
    <div className=" overflow-x-auto">
      <table
        key={key}
        className={`shadow-md`}
        style={{
          minWidth: isWithCustom ? "max-content" : "",
          tableLayout: isWithCustom ? "fixed" : "auto",
          width: isWithCustom ? "" : "100%",
        }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                className={`px-3 py-2 bg-slate-500  border border-gray-400 text-white text-left font-normal `}
                key={index}
                style={{
                  backgroundColor:
                    activeColumnCd === column.key ? "#c6d9e8" : "",
                  width:
                    column.accessor === "check"
                      ? "41px"
                      : isWithCustom
                      ? column.width
                      : "",
                  height: "40px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: isWithCustom ? "inline-block" : "",
                  cursor: isColumnDraggable ? "grab" : "auto",
                }}
                draggable={isColumnDraggable}
                onDragStart={(e) => handleColumnDragStart(e, column.key)}
                onDrop={(e) => handleColumnDrop(e, column.key)}
                onDragEnter={(e) => handleColumnDragEnter(e)}
                onDragLeave={(e) => handleColumnDragLeave(e)}
                onDragOver={(e) => handleColumnDragOver(e, column.key)}
                onDragEnd={(e) => handleColumnDragEnd(e)}
                onMouseEnter={() => sethoverColumnKey(column.key)}
                onMouseLeave={() => sethoverColumnKey(null)}
              >
                <div className="flex justify-between">
                  {/* ラベル */}
                  <div className="text-white">{column.header}</div>

                  {/* リサイズハンドル */}
                  {isColumnResizable && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-end w-[20px] relative"
                    >
                      {index < columns.length && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleMouseDown(e, index);
                          }}
                          className="h-full w-2 cursor-col-resize absolute -right-3"
                        />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((row, rowIndex) => {
            const isDraggableRow = draggableAccesor !== undefined;
            return (
              <tr
                key={rowIndex}
                draggable={isDraggableRow}
                onClick={() => handleRowClick(row)}
                onDragStart={(e) => handleDragStart(e, row["cd"])}
                onDrop={(e) => handleDrop(e, row["cd"])}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDragOver={(e) => handleDragOver(e, row["cd"])}
                onDragEnd={(e) => handleDragEnd(e)}
                className={`tbc ${
                  row["cd"]
                }-tr hover:bg-gray-200 transition-shadow ${
                  activeCd === row["cd"] ? "shadow-lg scale-[1.01]" : ""
                }`}
                style={{
                  cursor: isDraggableRow ? "grab" : "default",
                }}
              >
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.accessor];
                  return (
                    <td
                      key={colIndex + rowIndex}
                      className="px-3 py-2  border border-gray-400 border-t-0"
                      style={{
                        backgroundColor:
                          activeColumnCd === column.key ? "#c6d9e8" : "",

                        width:
                          column.accessor === "check"
                            ? "41px"
                            : isWithCustom
                            ? column.width
                            : "",
                        height: "40px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: isWithCustom ? "inline-block" : "",
                      }}
                      onClick={(e) => {
                        if (column.accessor !== "check") {
                          handleRowClick(row);
                        }
                      }}
                    >
                      {isReactNode(cellValue) ? cellValue : String(cellValue)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* control */}
      <div className=" my-2 flex justify-end">
        {/* pagination */}
        <div className="flex items-center p-2">
          <div className="mx-2">表示件数</div>
          <select
            onChange={(e) => onPaginationChange(Number(e.target.value))}
            value={pagination}
            className="p-1 border border-gray-400"
          >
            {paginatonOption.map((pag, i) => (
              <option key={i + "pagi-option"} value={pag}>
                {pag}
              </option>
            ))}
          </select>
        </div>

        {/* pagination */}
        <div className="flex items-center ml-5">
          <div className="mr-1 px-2 text-lg  hover:bg-gray-200">
            <button
              className="py-1"
              onClick={() => {
                currentPage !== 1
                  ? onCurrentPageChange(currentPage - 1)
                  : console.log("nothing happen");
                setallChecked({ checked: false, apply: false });
              }}
            >
              {"<"}
            </button>
          </div>
          {Array(Math.ceil(total / pagination))
            .fill(undefined)
            .map((num, i) => (
              <div className="mx-1">
                <AppButton
                  key={i + "pagination"}
                  type={i + 1 === currentPage ? "primary" : "normal"}
                  text={i + 1}
                  onClick={() => {
                    onCurrentPageChange(i + 1);
                    setallChecked({ checked: false, apply: false });
                  }}
                ></AppButton>
              </div>
            ))}
          <div className="ml-1 px-2 text-lg  hover:bg-gray-200">
            <button
              className="py-1"
              onClick={() => {
                currentPage !== Math.ceil(total / pagination)
                  ? onCurrentPageChange(currentPage + 1)
                  : console.log("nothing happen");
                setallChecked({ checked: false, apply: false });
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppTable;

const isReactNode = (value: any): value is ReactNode => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    React.isValidElement(value) ||
    value === null ||
    value === undefined
  );
};
