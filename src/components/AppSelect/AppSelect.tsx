import React from "react";
type Props = {
  options: { cd: string; label: string }[];
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
const AppSelect = ({
  options,
  name,
  label,
  onChange,
  defaultValue,
  required = false,
}: Props) => {
  return (
    <div className="flex justify-between items-center">
      <label className="mx-10" htmlFor={name}>
        {label}
      </label>
      <select
        className="border border-gray-500 p-1 px-3 w-[48%] mx-10 my-2"
        onChange={(e) => onChange(e)}
        name={name}
        required={required}
        defaultValue={defaultValue}
      >
        {options.map((option, i) => {
          return (
            <option key={i + option.cd} value={option.cd}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default AppSelect;
