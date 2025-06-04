import React, { useEffect, useState } from "react";
import skuApis from "../../api_dev/sku.api";
import skuApi from "../../api_dev/sku.api";
import { Column } from "../../components/AppTable/type";
import AppTable from "../../components/AppTable/AppTable";
import { Flag } from "../../common";
import { C_REQ_HEADER_SKU_LIST, PRODUCT_SAIYOUS } from "../../constant";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppRoutes, paramHolder, queryParamKey } from "../../routes";
import { getProductListApi } from "../../api/product.api";
import {
  addHeaderApi,
  getHeadersApi,
  updateHeaderOrderApi,
  updateWidthApi,
} from "../../api/header.api";
import SkuTableHeader from "./SkuTableHeader";
type Row = {
  [key: string]: string;
};

const SkuListPage = () => {
  const [columns, setcolumns] = useState<Column<Row>[]>([]);
  let { series_cd } = useParams();
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
  const [total, settotal] = useState(0);
  const [selectedKeys, setselectedKeys] = useState<string[]>([]);
  const [order, setorder] = useState<"asc" | "desc">("asc");
  const [orderAttr, setorderAttr] = useState("pr_hinban");
  const [isDeleted, setisDeleted] = useState<Flag>("0");
  const [categoryKeys, setcategoryKeys] = useState<string[]>([]);
  const [workspace, setworkspace] = useState("");
  const [keywords, setkeywords] = useState("");

  const [options, setoptions] = useState<{ cd: string; label: string }[]>([]);
  const [seaerchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    updateSkuList();
  }, [
    pagination,
    currentPage,
    keywords,
    isDeleted,
    order,
    orderAttr,
    categoryKeys,
    workspace,
  ]);

  const updateSkuList = async () => {
    const productPromise = getProductListApi({
      is: "0",
      pg: currentPage,
      ps: pagination,
      ws: workspace,
      ob: orderAttr,
      or: order,
      kw: keywords,
      ct: categoryKeys.length ? categoryKeys[categoryKeys.length - 1] : "",
      id: isDeleted,
    });

    const headerPromise = getHeadersApi({
      wks_cd: workspace,
    });
    const [productRes, headerRes] = await Promise.all([
      productPromise,
      headerPromise,
    ]);
    if (headerRes.result !== "success" || productRes.result !== "success")
      return;

    const { attrList, headers } = headerRes.data;
    const { data: skuList, total } = productRes;

    const newRows: Row[] = skuList.map((sku) => {
      const newRow: Row = {};
      Object.entries(attrList).map(([key, value]) => {
        newRow[key] = "";
      });

      if (sku.attrvalue.length) {
        sku.attrvalue.map((attr) => {
          conbinedRow[attr.atr_cd] = attr.atv_value;
        });
      }

      const constRows = {
        cd: sku.pr_cd,
        hinban: sku.pr_hinban,
        name: sku.pr_name,
        status:
          sku.pr_is_discontinued === "1"
            ? "廃番"
            : PRODUCT_SAIYOUS[sku.pr_acpt_status],
        pcl_name: sku.pr_name,
      };
      const conbinedRow = { ...newRow, ...constRows };

      conbinedRow["action"] = "";
      return conbinedRow;
    });

    const newColumn: {
      key: string;
      accessor: string;
      header: string;
      width?: number;
    }[] = headers.map((header) => {
      return {
        accessor: header.hdr_cd,
        header: attrList[header.attr_cd],
        width: header.hdr_width,
        key: header.hdr_cd,
      };
    });
    newColumn.push({
      key: "add",
      accessor: "action",
      header: (<ColumnAddButton updateSkuList={updateSkuList} />) as any,
      width: 40,
    });

    settotal(total);
    setcolumns(newColumn);
    setdataSource(newRows);
  };
  const handleRowClick = (sku_cd: any) => {
    let url = AppRoutes.skuDetailPage.replace(paramHolder.sku_cd, sku_cd);

    if (series_cd) {
      url += `?${queryParamKey.detailAttched}=${series_cd}`;
    }
    navigate(url);
  };
  const handleWidthChange = async (cd: string, width: number) => {
    await updateWidthApi({
      body: { hdr_cd: cd, hdr_width: width, wks_cd: "" },
    });
  };

  const handleColumnDrop = async (active_cd: string, over_cd: string) => {
    const res = await updateHeaderOrderApi({
      body: {
        active_cd,
        over_cd,
        wks_cd: "",
      },
    });
  };
  return (
    <div>
      <SkuTableHeader
        updateList={() => {}}
        selectedCategoryKeys={categoryKeys}
        keyword={keywords}
        setSelectedCategoryKeys={setcategoryKeys}
        setKeyword={setkeywords}
      />
      <AppTable
        key="sku"
        data={dataSource}
        columns={columns}
        onRowClick={handleRowClick}
        currentPage={currentPage}
        pagination={pagination}
        selectedKeys={selectedKeys}
        total={total}
        isColumnResizable={true}
        isColumnDraggable={true}
        isWithCustom={true}
        onRowClickKey={"cd"}
        onWidthChange={handleWidthChange}
        onColumnDrop={handleColumnDrop}
        onCurrentPageChange={(page) => setcurrentPage(page)}
        onPaginationChange={(pagenation) => setpagination(pagenation)}
      />
    </div>
  );
};

export default SkuListPage;

type buttonProps = {
  updateSkuList: () => void;
};
const ColumnAddButton = ({ updateSkuList }: buttonProps) => {
  const [isOpen, setisOpen] = useState(false);
  const [options, setoptions] = useState<{ cd: string; label: string }[]>([]);

  const handleAddColumn = async (cd: string) => {
    const res = await addHeaderApi({ body: { atr_cd: cd, wks_cd: "" } });

    updateSkuList();
    setisOpen(false);
  };

  const handleClick = async () => {
    const res = await getHeadersApi({ wks_cd: "" });
    if (res.result !== "success") return;
    const { attrList, headers } = res.data;

    const rowOptions = { ...attrList };

    headers.map((item) => {
      delete rowOptions[item.attr_cd];
    });
    const newOptions = Object.entries(rowOptions).map(([key, value]) => ({
      cd: key,
      label: value,
    }));

    setoptions(newOptions);
    setisOpen(true);
  };

  return (
    <AppDropDownList
      onClose={() => setisOpen(false)}
      onSelect={handleAddColumn}
      open={isOpen}
      options={options}
    >
      <button className="text-white" onClick={handleClick}>
        ＋
      </button>
    </AppDropDownList>
  );
};
