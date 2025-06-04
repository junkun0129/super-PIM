export type ProductTable = {
  cd: string;
  name: string;
  is_discontinued: string;
  acpt_status: string;
  acpt_last_updated_at: string;
  labels: string;
  created_at: string;
  updated_at: string;
  hinban: string;
  medias: string;
  is_deleted: string;
  is_series: string;
  series_cd: string;
  description: string;
  
  //PclTableのFK
  pcl_cd: string;
};
