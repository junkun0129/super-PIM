import { INPUT_TYPES } from "../../constant";

const AppAttrInput = ({
  cd,
  control_type,
  value,
  select_list,
  className,
}: {
  cd: string;
  control_type: string;
  value: string;
  select_list: string;
  className?: string;
}) => {
  return (
    <>
      {/* Single line input */}
      {control_type === INPUT_TYPES.SINGLE_LINE && (
        <input
          className={"input border border-slate-500 " + className}
          name={cd} // Unique name for the attribute
          defaultValue={value}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      )}

      {/* Multi line input */}
      {control_type === INPUT_TYPES.MULTI_LINE && (
        <textarea
          className={className}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          name={cd}
          defaultValue={value}
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
                defaultChecked={item === value} // Check if it matches current value
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
        <div className="custom-select">
          <select
            className={className + " hidden"}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            name={cd}
            defaultValue={value}
          >
            {select_list.split(";").map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Number input */}
      {control_type === INPUT_TYPES.NUMBER_INPUT && (
        <input
          className={className}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          defaultValue={value}
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
          type="date"
          defaultValue={value}
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
          defaultChecked={value === "1"}
          name={cd}
        />
      )}
    </>
  );
};
export default AppAttrInput;
