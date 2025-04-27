import { INPUT_TYPES } from "../../constant";
import AppSelect from "../AppSelect/AppSelect";

const AppAttrInput = ({
  cd,
  control_type,
  select_list,
  className,
  maxLength,
  is_with_unit,
  unit,
  default_value,
  required = false,
}: {
  cd: string;
  control_type: string;
  select_list: string;
  is_with_unit: string;
  unit: string;
  default_value: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}) => {
  return (
    <div className="flex">
      {/* Single line input */}
      {control_type === INPUT_TYPES.SINGLE_LINE && (
        <input
          className={"input border border-slate-500 w-full" + className}
          name={cd} // Unique name for the attribute
          defaultValue={default_value}
          {...(!!maxLength ? { maxLength } : {})}
          required={required}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      )}

      {/* Multi line input */}
      {control_type === INPUT_TYPES.MULTI_LINE && (
        <textarea
          className={className + " w-full border border-slate-500"}
          required={required}
          {...(!!maxLength ? { maxLength } : {})}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          name={cd}
          defaultValue={default_value}
        />
      )}

      {/* Radio input */}
      {control_type === INPUT_TYPES.RADIO_INPUT && (
        <fieldset className={className}>
          {select_list.split(";").map((item, index) => (
            <div key={index}>
              <input
                type="radio"
                name={cd} // Group radios by attribute `cd`
                id={`${cd}-${index}`} // Unique id for each radio
                value={item} // Value for each radio option
                defaultChecked={item === default_value} // Check if it matches current value
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              />
              <label htmlFor={`${cd}-${index}`}>{item}</label>
            </div>
          ))}
        </fieldset>
      )}

      {/* Combo box (select input) */}
      {control_type === INPUT_TYPES.COMBO_INPUT && (
        <div className="w-full">
          <AppSelect
            options={select_list
              .split(";")
              .map((item) => ({ cd: item, label: item }))}
            required={required}
            label={""}
            name={cd}
          />
        </div>
      )}

      {/* Number input */}
      {control_type === INPUT_TYPES.NUMBER_INPUT && (
        <input
          className={className}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          {...(!!maxLength ? { maxLength } : {})}
          required={required}
          defaultValue={default_value}
          name={cd}
          type="number"
        />
      )}

      {/* Date input */}
      {control_type === INPUT_TYPES.DATE_INPUT && (
        <input
          className={className}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          required={required}
          type="date"
          defaultValue={default_value}
          name={cd}
        />
      )}

      {/* CheckBox input */}
      {control_type === INPUT_TYPES.CHECKBOX_INPUT && (
        <input
          className={className}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="checkbox"
          defaultChecked={default_value === "1"}
          name={cd}
        />
      )}
      {is_with_unit === "1" && (
        <div className="flex items-center ml-2">{unit}</div>
      )}
    </div>
  );
};
export default AppAttrInput;
