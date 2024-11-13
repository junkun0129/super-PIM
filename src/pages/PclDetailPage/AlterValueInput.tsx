import React, { useState } from "react";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import { generateRandomString } from "../../util";
type Props = {
  options: { label: string; cd: string }[];
  defaultValue: string;
};
const AlterValueInput = ({ options, defaultValue }: Props) => {
  const [value, setvalue] = useState(defaultValue);
  const handleSelect = (cd: string) => {
    if (cd === "text") {
      if (value === "") {
        setvalue("text");
        return;
      } else {
        let newVlaue = value;
        newVlaue += ";text";
        setvalue(newVlaue);
        return;
      }
    } else {
      if (value === "") {
        setvalue("0-" + cd);
        return;
      } else {
        let newValue = value;
        const key = generateRandomString(30);
        newValue += `;${key}-${cd}`;
        setvalue(newValue);
        return;
      }
    }
  };

  const handleDeleteLabel = (string: string) => {
    let newValue = value
      .split(";")
      .filter((item) => item !== string)
      .map((item, i) => {
        if (i === 0) {
          return item;
        } else {
          return ";" + item;
        }
      })
      .join("");
    setvalue(newValue);
  };

  const handleAddTextToLabel = (text: string) => {
    const newVlaue = value
      .split(";")
      .map((item, i) => {
        if (i === 0) {
          if (item === "text") {
            return text;
          } else {
            return item.replace(/;/g, "");
          }
        } else {
          if (item === "text") {
            return ";" + text;
          } else {
            return item.includes(";") ? item : ";" + item;
          }
        }
      })
      .join("");
    setvalue(newVlaue);
  };
  const handleInputBlur = (e, index: number) => {
    let newValue = value.includes(";")
      ? value.replace(/;text/g, "")
      : value.replace(/text/g, "");
    const inputvalue = e.target.value;
    const key = generateRandomString(30);
    if (newValue === "") {
      newValue = `${key}-text-${inputvalue}`;
    } else {
      newValue += `;${key}-text-${inputvalue}`;
    }
    setvalue(newValue);
  };
  return (
    <div className="flex">
      <div>
        {value !== "" &&
          value.split(";").map((item, i) => {
            const stringPros = item.split("-");
            if (item !== "text") {
              //textinput意外だった場合
              let tagLabel = "";
              if (stringPros[1] === "text") {
                //作成されたtextだった場合
                tagLabel = stringPros[2];
              } else {
                //項目だった場合
                const found = options.find(
                  (optionNode) => optionNode.cd === item.split("-")[1]
                );
                tagLabel = found ? found.label : "";
              }

              return (
                <div key={item + i} className="flex p-2 border border-black">
                  <div>{tagLabel}</div>
                  <div onClick={() => handleDeleteLabel(item)}>✕</div>
                </div>
              );
            } else {
              //textInputだった場合
              return (
                <input
                  key={item + i}
                  autoFocus
                  onBlur={(e) => handleInputBlur(e, i)}
                />
              );
            }
          })}
      </div>
      <input value={value} style={{ display: "none" }} />
      <AppDropDownList options={options} onSelect={handleSelect}>
        <button>＋</button>
      </AppDropDownList>
    </div>
  );
};

export default AlterValueInput;
