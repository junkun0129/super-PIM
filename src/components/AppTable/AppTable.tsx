import React, { DragEventHandler, ReactNode, useEffect, useState } from "react";
import { TableProps } from "./type";
const paginatonOption = [10, 25, 50, 100];
function AppTable<T extends Object>({
  data,
  columns,
  onRowClick,
  currentPage,
  pagination,
  onCurrentPageChange,
  onPaginationChange,
  total,
  onRowClickKey,
  draggableAccesor,
  onDrop,
}: TableProps<T>) {
  const [activeCd, setactiveCd] = useState<null | string>(null);
  const [overCd, setoverCd] = useState<null | string>(null);
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
    <table style={{ border: "solid 1px black" }}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th className="px-2" key={index}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            className={row["cd"]}
            onClick={() => handleRowClick(row)}
            key={rowIndex}
          >
            {columns.map((column, colIndex) => {
              const cellValue = row[column.accessor];
              return (
                <td
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
                  }}
                  onDragStart={(e) => handleDragStart(e, row["cd"])}
                  onDrop={(e) => handleDrop(e, row["cd"])}
                  onDragEnter={(e) => handleDragEnter(e, row["cd"])}
                  onDragLeave={(e) => handleDragLeave(e, row["cd"])}
                  onDragOver={(e) => handleDragOver(e, row["cd"])}
                  className="px-2"
                  key={colIndex}
                >
                  {isReactNode(cellValue) ? cellValue : String(cellValue)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="flex">
          <div className="flex items-center">
            <div>
              <button
                onClick={() =>
                  currentPage !== 1
                    ? onCurrentPageChange(currentPage - 1)
                    : console.log("nothing happen")
                }
              >
                {"<"}
              </button>
            </div>
            {Array(Math.ceil(total / pagination))
              .fill(undefined)
              .map((num, i) => (
                <button
                  style={i + 1 === currentPage ? { color: "blue" } : {}}
                  key={i + "-page-button"}
                  onClick={() => onCurrentPageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            <div>
              <button
                onClick={() =>
                  currentPage !== Math.ceil(total / pagination)
                    ? onCurrentPageChange(currentPage + 1)
                    : console.log("nothing happen")
                }
              >
                {">"}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <div>表示件数</div>
            <select
              onChange={(e) => onPaginationChange(Number(e.target.value))}
              value={pagination}
            >
              {paginatonOption.map((pag, i) => (
                <option key={i + "pagi-option"} value={pag}>
                  {pag}
                </option>
              ))}
            </select>
          </div>
        </tr>
      </tfoot>
    </table>
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
