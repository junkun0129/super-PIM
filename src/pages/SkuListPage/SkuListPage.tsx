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
type Row = {
  [key: string]: string;
};

const SkuListPage = () => {
  const [columns, setcolumns] = useState<Column<Row>[]>([]);
  let { series_cd } = useParams();
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
  const [order, setorder] = useState<"asc" | "desc">("asc");
  const [isDeleted, setisDeleted] = useState<Flag>("0");
  const [total, settotal] = useState(0);
  const { getHeadersApi, getSkuListApi } = skuApi;
  const [options, setoptions] = useState<{ cd: string; label: string }[]>([]);
  const [seaerchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    updateSkuList();
  }, []);

  const updateSkuList = async () => {
    const offset = (currentPage - 1) * pagination;
    const skuListRes = await getSkuListApi({
      pagination,
      offset,
      order,
      deleted: isDeleted,
      series_cd: series_cd ?? "",
    });
    if (skuListRes.result !== "success") return;
    const headerRes = await getHeadersApi();
    if (headerRes.result !== "success") return;
    const { data, total } = skuListRes;
    const { addList, headers } = headerRes;

    const newRows: Row[] = data.map((sku) => {
      const newRow: Row = {};
      Object.entries(addList).map(([key, value]) => {
        newRow[key] = "";
      });

      const constRows = {
        cd: sku.cd,
        hinban: sku.hinban,
        name: sku.name,
        status:
          sku.is_discontinued === "1"
            ? "廃番"
            : PRODUCT_SAIYOUS[sku.acpt_status],
        pcl_name: sku.pcl_name,
      };
      const conbinedRow = { ...newRow, ...constRows };
      if (sku.attrs.length) {
        sku.attrs.map((attr) => {
          conbinedRow[attr.cd] = attr.value;
        });
      }
      conbinedRow["action"] = "";
      return conbinedRow;
    });

    const newColumn = headers.map((header) => {
      return {
        accessor: header.cd,
        header: header.name,
      };
    });
    newColumn.push({
      accessor: "action",
      header: (<ColumnAddButton updateSkuList={updateSkuList} />) as any,
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
  return (
    <div>
      <AppTable
        data={dataSource}
        columns={columns}
        onRowClick={handleRowClick}
        currentPage={currentPage}
        pagination={pagination}
        total={total}
        onRowClickKey={"cd"}
        onCurrentPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
        onPaginationChange={function (pagination: number): void {
          throw new Error("Function not implemented.");
        }}
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
  const { getHeadersApi, addHeaderApi } = skuApis;
  const handleAddColumn = async (cd: string) => {
    const res = await addHeaderApi({ body: { attr_cd: cd } });
    if (res.result !== "success") return;
    updateSkuList();
    setisOpen(false);
  };

  const handleClick = async () => {
    const res = await getHeadersApi();
    if (res.result !== "success") return;
    const { addList, headers } = res;
    const rowOptions = { ...addList, ...C_REQ_HEADER_SKU_LIST };
    headers.map((item) => {
      delete rowOptions[item.cd];
    });
    const newOptions = Object.entries(rowOptions).map(([key, value]) => ({
      cd: key,
      label: value,
    }));
    setoptions(newOptions);
    setisOpen(true);
  };

  return (
    <AppDropDownList onSelect={handleAddColumn} open={isOpen} options={options}>
      <button onClick={handleClick}>＋</button>
    </AppDropDownList>
  );
};
