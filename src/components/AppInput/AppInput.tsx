import React from "react";
type AppInputProps = {
  type: "email" | "text" | "password" | "checkbox" | "textarea" | "number";
  name: string;
  label: string;
  require?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const AppInput = ({
  type,
  name,
  label,
  require = false,
  defaultValue,
  onChange,
}: AppInputProps) => {
  let url = `border border-gray-500 p-1 px-3 my-2 mx-10`;
  if (type === "checkbox") {
    url += " w-[20px] h-[20px]";
  }
  console.log(defaultValue);
  console.log(type);
  return (
    <div className="flex justify-between items-center">
      <label className="mx-10" htmlFor={name}>
        {label}
      </label>
      <input
        defaultValue={defaultValue}
        defaultChecked={
          defaultValue && defaultValue === "1"
            ? true
            : (defaultValue === "0" || !defaultValue) && false
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Enterで送信されないようにする
          }
        }}
        required={require}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
        className={url}
        name={name}
        type={type}
        id={name}
      />
    </div>
  );
};

export default AppInput;
