export type AttrPclTable = {
  cd: string;
  order: number;
  is_show: string;
  is_common: string;
  alter_name: string;

  //AttributeTableのFK
  attr_cd: string;

  //PclTableのFK
  pcl_cd: string;
};
