export type AttrPclTable = {
  cd: string;
  order: string;
  default_order: number;
  is_show: string;
  alter_name: string;
  //AttributeTableのFK
  attr_cd: string;
  alter_value: string;
  //PclTableのFK
  pcl_cd: string;
};
