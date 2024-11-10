import { AttributeTable } from "./attribute";

export const attributeData: AttributeTable[] = [
  {
    cd: "ATTR0011111111111",
    name: "Weight",
    is_delete: "0",
    is_with_unit: "1",
    control_type: "0",
    not_null: "1",
    max_length: 5,
    select_list: "",
    default_value: "",
    unit: "kg",
    created_at: "2023-01-05",
    updated_at: "2023-06-15",
  },
  {
    cd: "ATTR0011111111112",
    name: "Color",
    is_delete: "0",
    is_with_unit: "0",
    control_type: "3",
    not_null: "0",
    max_length: 10,
    select_list: "Red;Blue;Green",
    default_value: "Red",
    unit: "",
    created_at: "2023-01-06",
    updated_at: "2023-06-16",
  },
  {
    cd: "ATTR0011111111113",
    name: "Power Consumption",
    is_delete: "0",
    is_with_unit: "1",
    control_type: "3",
    not_null: "1",
    max_length: 4,
    select_list: "Red;Blue;Green",
    default_value: "",
    unit: "W",
    created_at: "2023-01-07",
    updated_at: "2023-06-17",
  },
];
