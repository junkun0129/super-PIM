export type AttrPclTable = {
  cd: string;
  order: string;
  is_show: string;

  alter_name: string;
  alter_value: string;
  //AttributeTableのFK
  attr_cd: string;

  //PclTableのFK
  pcl_cd: string;
};
