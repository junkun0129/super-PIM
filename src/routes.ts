export const paramHolder = {
  pcl_cd: ":pcl_cd",
  sku_cd: ":sku_cd",
  atr_cd: ":atr_cd",
  series_cd: ":series_cd",
};

export const AppRoutes = {
  serisListPage: "/main",
  seriesDetailPage: `/seriesdetail/${paramHolder.series_cd}`,
  seriesCreatePage: "/seriescreate",
  pclMainPage: "/pcl",
  pclDetailPage: `/pcl/detail/${paramHolder.pcl_cd}`,
  skuDetailPage: `/sku/detail/${paramHolder.sku_cd}`,
  settingPage: "/setting",
};

export const queryParamKey = {
  detailAttched: "da",
  tab: "tab",
  pclDetail: "pc",
  pclDetailMedia: "pm",
  mediaSelected: "ms",
};
