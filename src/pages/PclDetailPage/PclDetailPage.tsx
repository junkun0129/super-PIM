import React, { Attributes, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppTable from "../../components/AppTable/AppTable";
import { Column } from "../../components/AppTable/type";
import AppModal from "../../components/AppModal/AppModal";
import pclApis from "../../api_dev/pcl.api";
import attrApis from "../../api_dev/attrs.api";

import { useMessageContext } from "../../providers/MessageContextProvider";
import { AttrPclTable } from "../../data/attrpcls/type";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";
import { arrayMove, getObjectFromRowFormData } from "../../util";
import mediaApi from "../../api_dev/media.api";
import { MediaTable } from "../../data/medias/medias";
import AppTab from "../../components/AppTab/AppTab";
import { queryParamKey } from "../../routes";
import AlterValueInput from "./AlterValueInput";
type Row = {
  cd: string;
  name: string;
  alter_name: JSX.Element;
  alter_value: JSX.Element;
  order: JSX.Element;
  is_show: JSX.Element;
};
const attrColumnData: Column<Row>[] = [
  { accessor: "order", header: "順番" },
  { accessor: "name", header: "項目名" },
  { accessor: "alter_name", header: "表示名" },
  { accessor: "alter_value", header: "表示値" },
  { accessor: "is_show", header: "表示・非表示設定" },
];
const dropdownOption: { cd: string; label: string }[] = [
  { cd: "0", label: "編集" },
  { cd: "1", label: "削除" },
];
const PclDetailPage = () => {
  const { getPclsAttrsApi, addAttrToPclApi, updatePclAttrApi } = pclApis;

  const { setMessage } = useMessageContext();
  const [currentPage, setcurrentPage] = useState(1);
  const [pagination, setpagination] = useState(10);
  const [total, settotal] = useState(0);
  const [dataSource, setdataSource] = useState<Row[]>([]);
  const [searchParams, setSearchPrams] = useSearchParams();
  const pcl_cd = searchParams.get(queryParamKey.pclDetail);
  const { getAllMediaApi } = mediaApi;
  const [alterValueOptions, setalterValueOptions] = useState<
    { cd: string; label: string }[]
  >([]);

  const [mediaList, setmediaList] = useState<MediaTable[]>([]);
  useEffect(() => {
    getMedialist();
  }, []);

  useEffect(() => {
    const media_cd = searchParams.get(queryParamKey.pclDetailMedia);
    if (!media_cd) return;
    getPclDetail(media_cd, pcl_cd);
  }, [searchParams]);

  const getMedialist = async () => {
    const res = await getAllMediaApi();
    if (res.result !== "success") return;

    setmediaList([{ cd: "0", name: "商品管理" }, ...res.data]);
  };

  const getPclDetail = async (media_cd: string, pcl_cd: string) => {
    const res = await getPclsAttrsApi({ body: { media_cd, pcl_cd } });
    if (res.result !== "success") setMessage("失敗しました");
    const newAlterValueOptions = res.data.map((item) => ({
      cd: item.attr_cd,
      label: item.name,
    }));
    setalterValueOptions(newAlterValueOptions);
    const newDataSource: Row[] = res.data
      .sort((a, b) => parseInt(a.order) - parseInt(b.order))
      .map((item) => ({
        cd: item.cd,
        name: item.name,
        alter_name: (
          <AlterNameCell
            key={item.cd + media_cd}
            cd={item.cd}
            defaultValue={item.alter_name}
          />
        ),
        alter_value: (
          <AlterValueInput
            inputName={item.cd + "-alter_value"}
            options={[
              ...newAlterValueOptions,
              { cd: "text", label: "テキスト" },
            ]}
            defaultValue={item.alter_value}
          />
        ),
        order: <OrderCell order={item.order} cd={item.cd} />,
        is_show: (
          <input
            defaultChecked={item.is_show === "1" ? true : false}
            name={item.cd + "-is_show"}
            key={item.cd + media_cd}
            type="checkbox"
          />
        ),
      }));
    setdataSource(newDataSource);
  };

  const handleDrop = ({
    activeCd,
    overCd,
    dataArray,
  }: {
    activeCd: string;
    overCd: string;
    dataArray: Row[];
  }) => {
    const activeIndex = dataArray.findIndex((item) => item.cd === activeCd);
    const overIndex = dataArray.findIndex((item) => item.cd === overCd);

    if (activeIndex !== -1 && overIndex !== -1) {
      const sortedDataSource: Row[] = arrayMove(
        dataArray,
        activeIndex,
        overIndex
      );
      setdataSource(
        sortedDataSource.map((item, i) => {
          console.log(item.alter_name.props);
          return {
            ...item,
            order: <OrderCell cd={item.cd} order={i.toString()} />,
          };
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    const media_cd = searchParams.get(queryParamKey.pclDetailMedia);
    const values = getObjectFromRowFormData(e);
    const attrMap = {};
    console.log(values);
    dataSource.forEach((item) => {
      attrMap[item.cd] = { cd: item.cd };
    });
    Object.entries(values).map(([key, value]) => {
      const attrpclCd = key.split("-")[0];
      const attribute = key.split("-")[1];

      attrMap[attrpclCd][attribute] = value;
    });

    const attrpcls = Object.values(attrMap).map((item: Object) => {
      if (!("is_show" in item)) {
        return { ...item, is_show: "0" };
      } else {
        return { ...item, is_show: "1" };
      }
    });
    const res = await updatePclAttrApi({
      body: {
        attrpcls: attrpcls as AttrPclTable[],
        media_cd,
      },
    });

    if (res.result !== "success") return;
    setMessage("項目情報が更新されました");
    getPclDetail(media_cd, pcl_cd);
  };

  const OrderCell = ({ order, cd }: { order: string; cd: string }) => {
    return (
      <div style={{ cursor: "pointer" }}>
        <div>::</div>
        <input value={order} style={{ display: "none" }} name={cd + "-order"} />
      </div>
    );
  };

  const AlterNameCell = ({
    cd,
    defaultValue,
  }: {
    cd: string;
    defaultValue: string;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.value = defaultValue;
      }
    }, [defaultValue]);
    const handleBlur = (e) => {
      if (inputRef.current) {
        inputRef.current.value = e.target.value;
      }
    };

    return (
      <input
        ref={inputRef}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleBlur(e);
          }
        }}
        name={cd + "-alter_name"}
      />
    );
  };

  return (
    <div>
      <button
        onClick={() => {
          setSearchPrams({});
        }}
      >
        戻る
      </button>

      <AppTab
        onChange={(e) => {
          searchParams.set(queryParamKey.pclDetailMedia, e);
          setSearchPrams(searchParams);
        }}
        data={mediaList.map((item) => ({
          key: item.cd,
          label: item.name,
          content: "",
        }))}
      />
      {!!dataSource.length &&
        searchParams.get(queryParamKey.pclDetailMedia) && (
          <form onSubmit={handleSubmit}>
            <div>商品分類CD:{pcl_cd}</div>
            <button type={"submit"}>更新</button>
            <div>
              <AppTable
                data={dataSource}
                columns={attrColumnData}
                onRowClick={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
                onDrop={({ activeCd, overCd }) =>
                  handleDrop({ activeCd, overCd, dataArray: dataSource })
                }
                draggableAccesor="order"
                currentPage={currentPage}
                pagination={pagination}
                total={total}
                onCurrentPageChange={() => console.log("")}
                onPaginationChange={() => console.log("")}
              />
            </div>
          </form>
        )}
      {!searchParams.get(queryParamKey.pclDetailMedia) && (
        <div>メディアを選択してください</div>
      )}
    </div>
  );
};

export default PclDetailPage;

const ATTRPCL_TO_LABEL = {
  is_show: "表示",
  is_common: "必須項目",
  alter_name: "表示名称",
};
