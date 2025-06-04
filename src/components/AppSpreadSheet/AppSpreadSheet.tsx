import React, { useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { getObjectFromRowFormData } from "../../util";

const AppSpreadSheet = () => {
  const data = [
    [
      { value: "", readOnly: true },
      { value: "Chocolate", readOnly: true },
    ],
    [
      { value: "Strawberry", readOnly: true },
      { value: "Cookies", readOnly: true },
    ],
  ];
  const [cell, setcell] = useState<{ value: string; readonly: boolean }[][]>(
    []
  );
  const handleSubmit = (e) => {
    const values = getObjectFromRowFormData(e);
    console.log(values);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Spreadsheet
        Table={(e) => {
          return <div tabIndex={-1}>{e.children}</div>;
        }}
        className=" animate-none"
        DataViewer={({ column, row, setCellData, cell }, i) => {
          return (
            <input
              name={data[column][row].value}
              className=" z-10 py-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              defaultValue={"default"}
            />
          );
        }}
        data={data}
      />
      <button type="submit">HOZON</button>
    </form>
  );
};

export default AppSpreadSheet;
