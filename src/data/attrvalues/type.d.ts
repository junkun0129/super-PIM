export type AttrValueTable = {
  cd: string;
  value: string;
  //ProductTableのFK
  product_cd: string;
  //AttributeTableのFK
  attr_cd: string;
};
