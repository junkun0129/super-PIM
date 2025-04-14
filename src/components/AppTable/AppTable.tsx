import React, {
  DragEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Column, TableProps } from "./type";
import AppButton from "../AppButton/AppButton";
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
  selectedKeys: selectedKeysProps,
  onSelectedKeysChange,
}: TableProps<T>) {
  const [activeCd, setactiveCd] = useState<null | string>(null);
  const [overCd, setoverCd] = useState<null | string>(null);
  const [columns, setcolumns] = useState<Column<T>[]>([]);
  const [dataSource, setdataSource] = useState<T[]>([]);
  const [allChecked, setallChecked] = useState<{
    checked: boolean;
    apply: boolean;
  }>({
    checked: false,
    apply: false,
  });
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

  useEffect(() => {
    if (!onSelectedKeysChange) return;
    if (!allChecked.apply) return;
    console.log(allChecked);
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
          accessor: "check" as keyof T,
          header: (
            <input
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
        type="checkbox"
        checked={selectedKeysProps.includes(item["cd"])}
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

  const handleDragStart = (
    event: React.DragEvent<HTMLTableCellElement>,
    newActiveCd: string
  ) => {
    setactiveCd(newActiveCd);
  };
  const handleDragLeave = (
    event: React.DragEvent<HTMLTableCellElement>,
    cd: string
  ) => {
    const div = event.view.document.getElementsByClassName(cd);
    if (div && div.length > 0) {
      (div[0] as HTMLElement).style.backgroundColor = "";
    }
  };
  const handleDragEnter = (
    event: React.DragEvent<HTMLTableCellElement>,
    cd: string
  ) => {
    const div = event.view.document.getElementsByClassName(cd);
    if (div && div.length > 0) {
      (div[0] as HTMLElement).style.backgroundColor = "lightblue";
    }
  };
  const handleDrop = (
    event: React.DragEvent<HTMLTableCellElement>,
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
    event: React.DragEvent<HTMLTableCellElement>,
    newOverCd: string
  ) => {
    event.preventDefault();
    setoverCd(newOverCd);
  };

  return (
    <>
      <table
        key={key}
        className="shadow-md rounded-md w-full"
        style={{ border: "solid 1px black" }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                className="px-3 py-2 border border-gray-400 bg-slate-500 text-white text-left font-normal"
                key={index}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((row, rowIndex) => (
            <tr className={`${row["cd"]}-tr hover:bg-gray-200`} key={rowIndex}>
              {columns.map((column, colIndex) => {
                const cellValue = row[column.accessor];
                return (
                  <td
                    style={column.accessor === "check" ? { width: "0px" } : {}}
                    draggable={
                      draggableAccesor && draggableAccesor === column.accessor
                        ? true
                        : false
                    }
                    onClick={(e) => {
                      if (
                        draggableAccesor &&
                        draggableAccesor === column.accessor
                      ) {
                        e.stopPropagation();
                      }

                      if (column.accessor === "check") return;
                      handleRowClick(row);
                    }}
                    onDragStart={(e) => handleDragStart(e, row["cd"])}
                    onDrop={(e) => handleDrop(e, row["cd"])}
                    onDragEnter={(e) => handleDragEnter(e, row["cd"])}
                    onDragLeave={(e) => handleDragLeave(e, row["cd"])}
                    onDragOver={(e) => handleDragOver(e, row["cd"])}
                    className="px-3 py-2  border-gray-400 border "
                    key={colIndex + rowIndex}
                  >
                    {isReactNode(cellValue) ? cellValue : String(cellValue)}
                  </td>
                );
              })}
            </tr>
          ))}
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
    </>
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
