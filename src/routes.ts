export const AppRoutes = {
  serisListPage: "/app/series",
  seriesDetailPage: "/app/seriesdetail/:series_cd",
  seriesCreatePage: "/app/seriescreate",
  pclMainPage: "/app/pcl",
  pclDetailPage: "/app/pcl/detail/:pcl_cd",
  skuDetailPage: "/app/sku/detail/:sku_cd",
  settingPage: "/app/setting",
};

export const paramHolder = {
  pcl_cd: ":pcl_cd",
  sku_cd: ":sku_cd",
  series_cd: ":series_cd",
};

export const queryParamKey = {
  detailAttched: "da",
  tab: "tab",
};
