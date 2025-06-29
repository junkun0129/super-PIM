export const WORKSPACE_MODE = Object.freeze({
  TABLE_MODE: 1,
  IMAGE_MODE: [2, 5, 6],
  NEW_IMAGE_MODE: 6,
});

export const mainType = {
  proposed: "proposed",
  approved: "includes_approved",
  accepted: "includes_accepted",
};

export const prdcdPattern = /^[A-Za-z0-9-_. ]*$/;
export const halfNumPattern = /^[0-9]*$/;

export const COOKIES = {
  TOKEN: "tk",
  EMAIL: "em",
  CD: "cd",
  NAME: "un",
  ISLOGGEDIN: "il",
};

export const URL = {
  LOGIN: "/auth/signin",
  SIGNUP: "/auth/signup",
  MAIN: "/main",
};

export const ATTR_DISPLAY_MODE = {
  COMMON: "1",
  UNIQUE: "0",
  BOTH: "2",
};

export const layout = {
  header: 40,
  sidebar: {
    expand: 190,
    collapsed: 60,
  },
  setting: {
    header: 100,
  },
  workspace: {
    header: 40,
  },
  blockManage: {
    header: 40,
    mainTab: 70,
  },
  searchCardHeight: 47,
  filterDrawerWidth: 300,
};

export const paramKey = {
  setting: {
    tab: "tab",
    tag: "tag",
  },
  media: {
    tag: "tag",
  },
  blockManage: {
    tab: "tab",
  },
  blockDetail: {
    id: "id",
    tab: "tab",
  },
  skuDetail: {
    id: "id",
    tab: "tab",
  },
};

export const param_keys = {
  search: "search",
  is_delete: "delete",
  mainTab: "mt",
  seriesAttached: "deailed",
};
export const windowSize = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export const localStrageKeys = {
  book_mark: "book_mark",
};

const userState = {
  userAccess: null,
  refreshRetryCount: 0,
  registerBottonView: false,
};

const LOGIN_URL = "login";
const REFRESH_TOKEN_URL = "refresh";
const SKU_DATA_FILTER_URL = "filter_data";
const MAKERS_DATA_URL = "product_makers";
const CANCEL_CSV_UPLOAD_URL = "cancel_csv_upload";
const SERIES_URL = "prdnew_srs";
const PRODUCT_URL = "prdnew_prd";
const UPDATE_SERIES_URL = "prdupd_srs/savedata";
const UPDATE_PRODUCT_URL = "prdupd_prd/savedata";

const MAKERS_SEARCH_URL = "mksch";
const SUPLIER_SEARCH_URL = "spsch";
const PRODUCT_SEARCH_URL = "prdsch";
const SERIES_SEARCH_URL = "srssch";
const GET_PRODUCT_ATTRIBUTES_URL = "prdupd_srs/getform";

const BASIC_CHANNEL_CODE = 0;
const PRODUCT_SKU_CODE = "PRD_CD";
const ACCESS_TOKEN_STRING = "xcms-pim-tkn";
const REFRESH_TOKEN_STRING = "xcms-pim-refresh-tkn";
const LOAD_STEP = 50;

const COMMON_PRODUCT_CLASSIFICATION = {
  cd: "00000000000000000000000000",
  name: "全分類共通",
};

export const operandsLabelForNumberAndDate = {
  より大きい: "0",
  より小さい: "1",
  以上: "2",
  以下: "3",
  等しい: "4",
  等しくない: "5",
  含まれている: "6",
  含まれていない: "7",
  から始まる: "8",
  で終わる: "9",
};

export const operandsLabelForComboAndRadio = {
  等しい: "4",
  等しくない: "5",
  含まれている: "6",
  含まれていない: "7",
};

export const operandsLabelForCheck = {
  含まれている: "6",
  含まれていない: "7",
};

export const operandsLabelForText = {
  等しい: "4",
  等しくない: "5",
  含まれている: "6",
  含まれていない: "7",
  から始まる: "8",
  で終わる: "9",
};

export const operands = {
  greaterThan: "0",
  lessThan: "1",
  greaterThanOrEqual: "2",
  lessThanOrEqual: "3",
  equal: "4",
  notEqual: "5",
  contains: "6",
  notContains: "7",
  startsWith: "8",
  endsWith: "9",
};

export const SERIES_ATTRIBUTE = {
  id: 999999,
  attribute: "PRD_SERIES",
  is_deleted: "0",
  is_fixed: "1",
  is_common: "0",
  is_with_unit: "0",
  is_private: "",
  order: -50,
  name: "シリーズ名",
  alternative_name: "",
  control_type: "0",
  not_null: "0",
  max_length: 256,
  select_list: null,
  default_value: "",
  unit: "",
  option1: "",
  option2: "",
  option3: "",
  transformation: null,
};
export const master_media_cd = "0";

const DEFAULT_SYSTEM_CATEGORY_CODE = "00000000000000000000000000";

export const TAX_VALUES_MAP = {
  "00": "課税(10%)",
  "01": "軽減税(8%)",
  "99": "非課税(0%)",
};
const TAX_VALUE_TO_CODE_MAP = new Map([
  ["課税(10%)", "00"],
  ["軽減税(8%)", "01"],
  ["非課税(0%)", "99"],
]);

const RESPONSES = Object.freeze({
  OK: "OK",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  SUCCESS: "SUCCESS",
});

const UPLOAD_STATES = Object.freeze({
  IN_PROGRESS: 0,
  FINISHED: 1,
  CANCELLED: 2,
  ERROR: 3,
});

const MNG_TABS = Object.freeze({
  WORKSPACE: 1,
  GROUP: 2,
  USER: 3,
});

const WORKSPACE_TABS = Object.freeze({
  USERS: 0,
  ROLES: 1,
});

const TABS = Object.freeze({
  HOME: 0,
  MEDIA_LIST: 1,
  MEDIA_ANALYSIS: 2,
  PRODUCT_LIST: 3,
  PRODUCT_LIST_APPROVAL: 4,
  SERIES_LIST: 5,
  CATEGORY_LIST: 6,
  PRODUCT_LIST_MANAGE: 15,
  CATEGORY_IMPORT: 7,
  CATEGORY_DIVISIONS: 8,
  USER_MANAGEMENT: 9,
  PRODUCT_REGISTER: 10,
  SETTINGS: 11,
  ATTRIBUTE_LIST: 12,
  //SP_BAITAI_LIST: 20,
});

export const PCL_ATTRS_SHOW_STATUS = {
  SHOW: null,
  NOT_SHOW: "D",
  ALL: "",
};

const SETTINGS_TABS = Object.freeze({
  CATEGORY: 0,
  SERIES: 1,
  ATTRIBUTE: 2,
  MAKER: 3,
  SUPLIER: 4,
  PRODUCT_CLASSIFICATION: 5,
  CHANNEL: 6,
  LABEL: 7,
  //SP_BAITAI: 8,
});

const CATEGORY_TYPES = {
  BIG: 0,
  MEDIUM: 1,
  SMALL: 2,
  X_SMALL: 3,
  ATTRIBUTES: 4,
};

const PRODUCT_VIEW_STYLES = Object.freeze({
  LIST: 0,
  BLOCK: 1,
});

const SUPLIER_CODE_CD = "SP";
const MAKER_CD = "MK";
const MAKER_CODE_CD = "MK_CD";
const PER_UNIT_CD = "PER_UNIT_V";
export const PER_UNIT_V = "PER_UNIT_V";
export const PER_UNIT_U = "PER_UNIT_U";

const COMMON_ATTRIBUTE_TO_STRING = new Map([
  ["PRD_MNG_ID", "商品ID"],
  ["PRD_CD", "商品コード"],
  ["NAME", "商品名"],
  ["KANA", "商品名「カナ」"],
  ["NAME_EN", "商品名「英語」"],
  ["MK", "メーカーコード"],
  ["MK_CD", "メーカー品番"],
  ["BRAND", "ブランド"],
  ["JAN", "JANコード"],
  ["SP", "サプライヤーコード"],
  ["PER_UNIT_V", "入数"],
  ["PER_UNIT_U", "入数単位"],
  ["TAX", "税率"],
  ["M_PRICE_INC", "小売価格価"],
  ["M_PRICE", "メーカー希望小売価格"],
  ["M_TAX", "メーカー希望税率"],
  ["M_CLS", "価格区分"],
]);

const categoryHistoryBuffer = [];

const CSV_EXTENTION = "CSV";
const IMAGE_EXTENTIONS = new Set(["PNG", "JPG", "JPEG"]);

const SAIYOUS = [
  "全て",
  "採用待ち",
  "採用",
  "非採用",
  "差戻し",
  "仮登録",
  "廃番",
];
export const PRODUCT_SAIYOUS = {
  0: "仮登録",
  1: "採用待ち",
  2: "差戻し",
  4: "非採用",
  9: "採用",
  11: "廃番",
};

export const SAIYOUS_TO_ID = {
  全て: "",
  仮登録: "0",
  採用待ち: "1",
  差戻し: "2",
  非採用: "4",
  採用: "9",
  廃番: "11",
};

export const INPUT_TYPES = Object.freeze({
  SINGLE_LINE: "0",
  MULTI_LINE: "1",
  COMBO_INPUT: "2",
  RADIO_INPUT: "3",
  CHECKBOX_INPUT: "4",
  NUMBER_INPUT: "5",
  DATE_INPUT: "6",
});

export const INPUT_TYPE_TO_STRING = new Map([
  [INPUT_TYPES.SINGLE_LINE, "単数行テキスト"],
  [INPUT_TYPES.MULTI_LINE, "複数行テキスト"],
  [INPUT_TYPES.COMBO_INPUT, "コンボ選択"],
  [INPUT_TYPES.RADIO_INPUT, "ラジオ選択"],
  [INPUT_TYPES.CHECKBOX_INPUT, "チェック選択"],
  [INPUT_TYPES.NUMBER_INPUT, "数値"],
  [INPUT_TYPES.DATE_INPUT, "日付"],
]);

export const INPUT_STRING_TO_TYPE = new Map([
  ["単数行テキスト", INPUT_TYPES.SINGLE_LINE],
  ["複数行テキスト", INPUT_TYPES.MULTI_LINE],
  ["コンボ選択", INPUT_TYPES.COMBO_INPUT],
  ["ラジオ選択", INPUT_TYPES.RADIO_INPUT],
  ["チェック選択", INPUT_TYPES.CHECKBOX_INPUT],
  ["数値", INPUT_TYPES.NUMBER_INPUT],
  ["日付", INPUT_TYPES.DATE_INPUT],
]);

const PRODUCT_STATES = Object.freeze({
  GENERAL: 0,
  APPROVAL: 1,
  MANAGE: 2,
});
const IMAGE_FALLBACK_IMG_SRC = "../static/app/resources/images/error-image.svg";
const EMPTY_SEARCH_IMG_SRC = "../static/app/resources/search-not-found.png";
const LOCK_CLOSED_IMG_SRC = "../static/app/resources/images/lock.svg";
const LOCK_OPEN_IMG_SRC = "../static/app/resources/images/lock_open.svg";

const LOADING_STATUSES = Object.freeze({
  SUCCESS: 0,
  ERROR: 1,
});
const FILTER_TABS = Object.freeze({
  ROAD: 0,
  SAVE: 1,
  CREATE: 2,
});
const SEARCH_COUNT_PER_PAGE = 25;
const PER_PAGE_SELECT_VALUES = [10, 25, 50, 100];

/*
  Maps 
*/
const FIXED_COLUMNS = Object.freeze({
  NAME: "name",
  CODE: "cd",
  PRICE: new Set(["m_price", "m_price_inc"]),
  IMAGE: "img",
  ACCEPTANCE: "acpt_status",
  CATEGORY: new Set(["sdc_nm", "slc_nm", "ssc_nm", "stc_nm"]),
});

const LOCAL_STORAGE_IDS = Object.freeze({
  SEARCH_KEY_HISTORY: "pim-search-history",
  SAVED_FILTERS: "pim-saved-filters",
  PRODUCT_LIST_ADDED_COLUMNS: "product-list-added-columns",
});
export const C_REQ_HEADER_SKU_LIST = {
  hinban: "商品コード",
  name: "商品名",
  status: "ステータス",
  pcl_name: "商品分類名",
};

const COLUMN_TO_HEADER = new Map([
  ["name", "商品名"],
  ["cd", "商品コード"],
  ["m_price", "小売価格価"],
  ["img", "画像"],
  ["category", "カテゴリ"],
  ["jan", "JANコード"],
  ["mk_nm", "メーカー"],
  ["mk_hinban", "メーカー品番"],
  ["acpt_status", "採用状況"],
  ["brand", "ブランド"],
]);

const DETAILED_PRODUCT_CALLER = Object.freeze({
  PRODUCT_LIST: 0,
  PRODUCT_CLASSIFICATION: 1,
  SERIES_DETAILS: 2,
});

const VIEW_TYPES = Object.freeze({
  LIST: 0,
  BLOCK: 1,
  TREE: 2,
});

const VIEW_TYPE_TO_URL = new Map([
  [VIEW_TYPES.LIST, "../static/app/resources/images/list.svg"],
  [VIEW_TYPES.BLOCK, "../static/app/resources/images/grid_view.svg"],
  [VIEW_TYPES.TREE, "../static/app/resources/images/tree_view.svg"],
]);

const VIEW_TYPE_TO_TEXT = new Map([
  [VIEW_TYPES.LIST, "表示：リスト"],
  [VIEW_TYPES.BLOCK, "表示：グリッド"],
  [VIEW_TYPES.TREE, "表示：ツリー"],
]);

const CONTENT_EDIT_STATES = Object.freeze({
  NON_EDITABLE: 0,
  EDITABLE: 1,
});

const DEFAULT_ATTRIBUTE_SPEC_OBJECT = {
  lbl: "",
  ctrl: "0",
  nn: "",
  max_len: 0,
  select_list: "",
  default_value: "",
  unit: "",
  op1: "",
  op2: "",
  op3: "",
  wtunit: "0",
  common: 0,
  name: "入数単位",
};

const DEFAULT_TAX_ATTRIBUTE_SPEC_OBJECT = {
  cd: "TAX",
  lbl: "",
  ctrl: "2",
  nn: "",
  max_len: 0,
  select_list: "非課税(0%);軽減税(8%);課税(10%)",
  default_value: "",
  unit: "",
  op1: "",
  op2: "",
  op3: "",
  wtunit: "0",
  common: 0,
  name: "税率",
};

const TAX_TO_CODE = new Map([
  ["課税(10%)", "00"],
  ["軽減税(8%)", "01"],
  ["非課税(0%)", "99"],
]);

const TAX_TO_VALUE = new Map([
  ["課税(10%)", 10],
  ["軽減税(8%)", 8],
  ["非課税(0%)", 0],
]);

const TAX_CODE_TO_TAX = new Map([
  ["00", "課税(10%)"],
  ["01", "軽減税(8%)"],
  ["99", "非課税(0%)"],
]);

/* State */

const pimState = {
  categoryTree: null,
  categoryMap: null,
  hot: null,
  imageDefinitions: null,
  labels: null,
  isTotalSelectOn: false,
  search: "",
  categoryCode: "",
  series: null,
  selectedCodes: new Set(),
  isSeries: false,
  currentSPBaitai: null,
};

const categorySettingTab = {
  currentViewType: VIEW_TYPES.TREE,
  currentCategoryCode: null,
  currentChannelCode: null,
};
/*
const spCategorySettingTab = {
    currentViewType: VIEW_TYPES.TREE,
    currentCategoryCode: null,
    currentSPBaitaiCode: null,
  }
  */
const DETAILED_SERIES_TABS = Object.freeze({
  PRODUCTS: 0,
  ATTRIBUTES: 1,
  CATEGORIES: 2,
  ASSETS: 3,
  SP_CATEGORIES: 4,
});

const IMAGE_EXTENSIONS = Object.freeze([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "eps",
]);
const VIDEO_EXTENSIONS = Object.freeze([
  "mp4",
  "mov",
  "wmv",
  "avi",
  "flv",
  "ogv",
  "webm",
]);
const AUDIO_EXTENSIONS = Object.freeze([
  "mp3",
  "wav",
  "wma",
  "m4a",
  "ogg",
  "flac",
]);
const OFFICE_EXTENSIONS = Object.freeze([
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
]);
const PPT_EXTENSIONS = Object.freeze(["ppt", "pptx"]);
const EXCEL_EXTENSIONS = Object.freeze(["xls", "xlsx"]);
const WORD_EXTENSIONS = Object.freeze(["doc", "docx"]);

export const ASSET_TABS = Object.freeze({
  IMAGE: "0",
  PDF: "1",
  VIDEO: "2",
  AUDIO: "3",
  OFFICE: "4",
  OTHER: "5",
});

export const ASSET_TAB_TO_TEXT = Object.freeze({
  IMAGE: "画像",
  PDF: "PDF",
  VIDEO: "動画",
  AUDIO: "音声",
  OFFICE: "Office",
  OTHER: "その他",
});

// const ASSET_TAB_TO_TEXT = new Map([
//   [ASSET_TABS.IMAGE, '画像'],
//   [ASSET_TABS.PDF, 'PDF'],
//   [ASSET_TABS.VIDEO, '動画'],
//   [ASSET_TABS.AUDIO, '音声'],
//   [ASSET_TABS.OFFICE, 'Office'],
//   [ASSET_TABS.OTHER, 'その他']
// ]);

let lastVisited = "";

const DETAILED_IMAGE_MAP = new Map([
  ["rsl", "解像度"],
  ["clspc", "色空間"],
  ["fmt", "最終更新者"],
  ["name", "ファイル名"],
]);

const BASIC_DETAIL = {
  cap: "-",
  clspc: "-",
  fmt: "-",
  h: "-",
  img: "-",
  name: "-",
  no: "-",
  rsl: "-",
  w: "-",
};

const productHeader = {
  prd_id: "商品ID",
  cd: "商品コード",
  name: "商品名",
  mk_hinban: "メーカー品番",
  mk_nm: "メーカー名",
  brand: "ブランド",
  jan: "JANコード",
  sp_nm: "サプライヤー",
  m_price: "メーカー希望小売価格",
  m_price_inc: "小売価格価",
  acpt_status: "採用状況",
  sdc_nm: "大カテゴリ",
  stc_nm: "中カテゴリ",
  ssc_nm: "小カテゴリ",
  slc_nm: "詳細カテゴリ",
  img: "画像",
  maker: {
    name: "メーカー名",
  },
};
export const PRODUCT_HEADER_LIST = {
  series: "所属シリーズ",
  label: "ラベル",
  product_classification: "商品分類",
  acpt_status: "ステータス",
  img: "画像",
  category: "所属カテゴリー",
};

const defaultProductSearchData = {
  free_word: "",
  acpt_status: "",
  prd_cd: "",
  prd_name: "",
  sdc_cd: "",
  stc_cd: "",
  ssc_cd: "",
  slc_cd: "",
  mk_hinban: "",
  jan: "",
  mk_name: "",
  sp_name: "",
  offset: 0,
  limit: 100,
  sort_item: "cd",
  sort_odr: "A",
};

const MAKER_SUPLIER_KEYS = new Set([
  "name",
  "kana",
  "name_en",
  "zip",
  "addr1",
  "addr2",
  "addr3",
  "addr4",
  "addr5",
  "tel",
  "fax",
  "mail",
  "url",
  "note",
]);

const emptyMakerSupplier = {
  name: "",
  kana: "",
  name_en: "",
  zip: "",
  addr1: "",
  addr2: "",
  addr3: "",
  addr4: "",
  addr5: "",
  tel: "",
  fax: "",
  mail: "",
  url: "",
  note: "",
};

const isManager = true;

//const ROLES = {
//  商品: {
//    提案: 1,
//    採用: 2,
//    商品提案一覧: 3,
//    商品承認一覧: 4,
//    商品登録: 12,
//    商品編集: 6,
//    商品削除: 7,
//    商品データインポート: 8,
//    商品データエクスポート: 10,
//    チャネル出力: 11,
//    プライベート項目アクセス: 9,
//  },
//  管理: {
//    ユーザー: 41,
//    ロール: 43,
//    アクセス: 101,
//  },
//  設定: {
//    メーカー: 44,
//    サプライヤー: 45,
//    カテゴリー: 46,
//    商品分類: 47,
//    ラベル: 48,
//    項目: 49,
//    チャネル: 50,
//  },
//}

const ROLES = {
  "商品提案（画面）": {
    画面へのアクセス: 1,
    商品編集: 2,
    商品削除: 3,
    商品データインポート: 4,
    商品データエクスポート: 5,
    商品提案: 6,
    プライベート項目アクセス: 7,
  },
  "商品承認（画面）": {
    画面へのアクセス: 15,
    商品編集: 16,
    商品削除: 17,
    商品承認: 18,
    プライベート項目アクセス: 19,
  },
  管理: {
    ユーザー: 25,
    ロール: 26,
    アクセス: 27,
  },
  設定: {
    カテゴリー: 35,
    項目: 36,
    商品分類: 37,
    メーカー: 38,
    サプライヤー: 39,
    メディア: 40,
    ラベル: 41,
  },
};

const CHANNEL_ROLES = {
  画面へのアクセス: 1,
  商品編集: 2,
  商品削除: 3,
  商品データインポート: 4,
  商品データエクスポート: 5,
  プライベート項目アクセス: 6,
  チャンネルへの書き出し: 7,
};

const CHANNEL_ROLE_BIT_START = 51;

// checks for correctness of date dd/mm/YYYY, dd-mm-YYYY, dd.mm.YYYY,
// together with number of days in a certain month
const dateRegex =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
const dateRegexYear =
  /(((20[012]\d|19\d\d)|(1\d|2[0123]))-((0[0-9])|(1[012]))-((0[1-9])|([12][0-9])|(3[01])))|(((0[1-9])|([12][0-9])|(3[01]))-((0[0-9])|(1[012]))-((20[012]\d|19\d\d)|(1\d|2[0123])))|(((20[012]\d|19\d\d)|(1\d|2[0123]))\/((0[0-9])|(1[012]))\/((0[1-9])|([12][0-9])|(3[01])))|(((0[0-9])|(1[012]))\/((0[1-9])|([12][0-9])|(3[01]))\/((20[012]\d|19\d\d)|(1\d|2[0123])))|(((0[1-9])|([12][0-9])|(3[01]))\/((0[0-9])|(1[012]))\/((20[012]\d|19\d\d)|(1\d|2[0123])))|(((0[1-9])|([12][0-9])|(3[01]))\.((0[0-9])|(1[012]))\.((20[012]\d|19\d\d)|(1\d|2[0123])))|(((20[012]\d|19\d\d)|(1\d|2[0123]))\.((0[0-9])|(1[012]))\.((0[1-9])|([12][0-9])|(3[01])))/g;
const alphaNumericRegex = /^([a-zA-Z0-9\-_ ]+)$/;
const katakanaRegex = /^([ァ-ヶー0-9０-９ ]+)$/;
const numericRegex = /^[0-9]*$/;
const minusNumericRegex = /^-?[0-9]*$/;

const NUMBER_DEFAULT_SETTING = {
  cd: "",
  lbl: "",
  ctrl: "5",
  nn: "0",
  max_len: 0,
  select_list: "",
  default_value: "",
  unit: "",
  op1: "",
  op2: "",
  op3: "",
  name: "",
  wtunit: "0",
};

const emptyCategory = {
  code: "new",
  order: 99999,
  name: "",
  note: null,
  labels: null,
  is_deleted: "0",
  is_leaf: "1",
  created_by: null,
  updated_by: null,
  parent: null,
  img: "",
  isNew: true,
};

const emptyProductionClassification = {
  name: "",
};

const newCategoryState = {
  selectedCategory: null,
  selectedCategoryBlock: null,
};

/* Modal controls */

const MODAL_ACTIVE_CLASS = "active";
const MODAL_TRANSITION_CLASS = "modal-transition";

// Filters

export const FILTER_OPERATIONS = {
  EQUAL_TO: "0",
  NOT_EQUAL_TO: "1",
  IS_DEFINED: "2",
  IS_NOT_DEFINED: "3",
  LESS_THAN: "4",
  LESS_THAN_OR_EQUAL_TO: "5",
  GREATER_THAN: "6",
  GREATER_THAN_OR_EQUAL_TO: "7",
  CONTAINS_ANY_OF: "8",
  DOES_NOT_CONTAINS_ANY_OF: "9",
};

export const FILTER_RELATIONS = {
  AND: "0",
  OR: "1",
};

export const LABEL_COLOR_OPTIONS = [
  "#c7c4c4",
  "#f06a6a",
  "#ec8d71",
  "#f1bd6c",
  "#f8df72",
  "#aecf55",
  "#5da283",
  "#4ecbc4",
  "#9ee7e3",
  "#4573d2",
  "#8d84c8",
  "#b36bd4",
  "#f9aaef",
  "#f26fb2",
  "#fc979a",
  "#6d6e6f",
];
const FILTER_TAX_VALUE = [
  { cd: "0", name: "課税(10%)" },
  { cd: "8", name: "軽減税(8%)" },
  { cd: "10", name: "非課税(0%)" },
];
export const FILTER_CONDITION_CONTENT = [
  { value: "0", label: "等しい" },
  { value: "1", label: "等しくない" },
  { value: "2", label: "設定されている" },
  { value: "3", label: "設定されていない" },
  { value: "8", label: "含む" },
  { value: "9", label: "含まない" },
];
export const FILTER_CONDITION_NUMBER_CONTENT = [
  { value: "0", label: "等しい" },
  { value: "1", label: "等しくない" },
  { value: "2", label: "設定されている" },
  { value: "3", label: "設定されていない" },
  { value: "4", label: "より小さい" },
  { value: "5", label: "以下" },
  { value: "6", label: "より大きい" },
  { value: "7", label: "以上" },
  { value: "8", label: "含む" },
  { value: "9", label: "含まない" },
];
export const FILTER_CONDITION_LABEL_CONTENT = [
  { value: "2", label: "設定されている" },
  { value: "3", label: "設定されていない" },
];
