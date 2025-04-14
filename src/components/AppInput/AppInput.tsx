import React from "react";
type AppInputProps = {
  type: "email" | "text" | "password" | "checkbox" | "textarea";
  name: string;
  label: string;
  require?: boolean;
};
const AppInput = ({ type, name, label, require = false }: AppInputProps) => {
  return (
    <div className="flex justify-between items-center">
      <label className="mx-10" htmlFor={name}>
        {label}
      </label>
      <input
        required={require}
        className="border border-gray-500 p-1 px-3"
        name={name}
        type={type}
        id={name}
      />
    </div>
  );
};

export default AppInput;
