import { CategoryTable } from "./type";

export const categoriesData: CategoryTable[] = [
  {
    cd: "001",
    name: "Electronics",
    description: "All kinds of electronic items",
    order: 1,
    parent_cd: "",
  },
  {
    cd: "002",
    name: "Mobile Phones",
    description: "Smartphones and mobile devices",
    order: 2,
    parent_cd: "001",
  },
  {
    cd: "003",
    name: "Laptops",
    description: "Portable computers and accessories",
    order: 3,
    parent_cd: "001",
  },
  {
    cd: "004",
    name: "Gaming",
    description: "Gaming consoles and accessories",
    order: 4,
    parent_cd: "001",
  },
  {
    cd: "005",
    name: "Smartphones",
    description: "Latest smartphones from top brands",
    order: 1,
    parent_cd: "002",
  },
  {
    cd: "006",
    name: "Feature Phones",
    description: "Basic mobile phones",
    order: 2,
    parent_cd: "002",
  },
  {
    cd: "007",
    name: "Gaming Consoles",
    description: "Console systems for gaming",
    order: 1,
    parent_cd: "004",
  },
  {
    cd: "008",
    name: "Accessories",
    description: "Gaming accessories like controllers",
    order: 2,
    parent_cd: "004",
  },
  {
    cd: "009",
    name: "Software",
    description: "All kinds of software",
    order: 1,
    parent_cd: "",
  },
  {
    cd: "010",
    name: "Operating Systems",
    description: "OS for computers and mobile devices",
    order: 1,
    parent_cd: "009",
  },
];
