import React from "react";
type AppInputProps = {
  type: "email" | "text" | "password" | "checkbox" | "textarea" | "number";
  name: string;
  label?: string;
  require?: boolean;
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  autoFocus?: boolean;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const AppInput = ({
  type,
  name,
  value,
  label,
  require = false,
  defaultValue,
  placeholder,
  autoFocus = false,
  onBlur,
  onChange,
}: AppInputProps) => {
  let url = `border border-gray-500 p-1 px-3 my-2 `;
  if (label) {
    url += "mx-10";
  }
  if (type === "checkbox") {
    url += " w-[20px] h-[20px]";
  }

  return (
    <div className="flex justify-between items-center">
      {label && (
        <label className="mx-10" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
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
        onBlur={onBlur}
        className={url}
        name={name}
        type={type}
        id={name}
      />
    </div>
  );
};

export default AppInput;
