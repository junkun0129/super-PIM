export const AppRoutes = {
  serisListPage: "/main",
  seriesDetailPage: "/seriesdetail/:series_cd",
  seriesCreatePage: "/seriescreate",
  pclMainPage: "/pcl",
  pclDetailPage: "/pcl/detail/:pcl_cd",
  skuDetailPage: "/sku/detail/:sku_cd",
  settingPage: "/setting",
};

export const paramHolder = {
  pcl_cd: ":pcl_cd",
  sku_cd: ":sku_cd",
  series_cd: ":series_cd",
};

export const queryParamKey = {
  detailAttched: "da",
  tab: "tab",
  pclDetail: "pc",
  pclDetailMedia: "pm",
  mediaSelected: "ms",
};
