import React, { ReactNode, useEffect, useState } from "react";
import AppModal from "../../AppModal/AppModal";
import AppDropDownList from "../../AppDropDownList/AppDropDownList";
import pclApi from "../../../api_dev/pcl.api";
import attrsApi, { CreateProductAttr } from "../../../api_dev/attrs.api";
import seriesApi from "../../../api_dev/series.api";
import AppButton from "../../AppButton/AppButton";
import AppAttrInput from "../../AppAttrInput/AppAttrInput";
import { useMessageContext } from "../../../providers/MessageContextProvider";
type Props = {
  open: boolean;
  onClose: () => void;
  updateList: () => void;
};

export type CreatedSeriesEntry = {
  pcl_cd: string;
  pcl_name: string;
  series_cd: string;
  series_name: string;
  attrs: { cd: string; value: string; name: string }[];
};
const SeriesCreateModal = ({ open, onClose, updateList }: Props) => {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [dropdownOptions, setdropdownOptions] = useState<
    { cd: string; label: string }[]
  >([]);
  const { getPclsApi } = pclApi;
  const { checkSeriesExists, createSeriesApi } = seriesApi;
  const { getProductCreateAttrPclListApi } = attrsApi;
  const { setMessage } = useMessageContext();
  const [selectedPcl, setselectedPcl] = useState<{
    cd: string;
    label: string;
  } | null>(null);
  const [attrList, setattrList] = useState<CreateProductAttr[]>([]);
  const [seriesList, setseriesList] = useState<CreatedSeriesEntry[]>([]);

  useEffect(() => {
    if (!selectedPcl) return;
    getAttrList(selectedPcl.cd);
  }, [selectedPcl]);

  const getAttrList = async (pcl_cd: string) => {
    const res = await getProductCreateAttrPclListApi({ pcl_cd });
    if (res.result !== "success") return;
    setattrList(res.data.filter((item) => item.is_common === "1"));
  };
  const handleSelectPcl = (cd) => {
    setdropdownOpen(false);
    const pcl = dropdownOptions.find((item) => item.cd === cd);
    if (!pcl) return;
    setselectedPcl(pcl);
  };
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const res = await getPclsApi();
    setdropdownOptions(
      res.data.map((item) => ({ cd: item.cd, label: item.pcl_name }))
    );
    setdropdownOpen(true);
  };
  const handleAddToSeriesList = async (
    e: React.FormEvent<HTMLFormElement>,
    seriesList: CreatedSeriesEntry[]
  ) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const series_cd = form.get("cd") as string;
    const series_name = form.get("name") as string;

    if (series_cd === "") {
      return setMessage("シリーズコードを入力してください");
    }

    if (series_name === "") {
      return setMessage("シリーズ名を入力してください");
    }
    const res = await checkSeries(series_cd, series_name, seriesList);

    if (res.result !== "success") return setMessage(res.message);
    const newSeriesEntry: CreatedSeriesEntry = {
      pcl_cd: selectedPcl.cd,
      pcl_name: selectedPcl.label,
      series_cd,
      series_name,
      attrs: attrList.map((attr, i) => {
        return {
          cd: attr.cd,
          value: form.get(attr.cd) as string,
          name: attr.name,
        };
      }),
    };
    setseriesList([...seriesList, newSeriesEntry]);
    setselectedPcl(null);
    setattrList([]);
  };

  const checkSeries = async (
    cd: string,
    name: string,
    list: CreatedSeriesEntry[]
  ) => {
    const res = await checkSeriesExists(cd, name);
    if (res.result !== "success") return res;
    const doubledNames = list.filter((item) => item.series_name === name);
    const doubeldCds = list.filter((item) => item.series_cd === cd);
    if (!!doubledNames.length)
      return { result: "failed", message: "シリーズ名が既に存在します" };
    if (!!doubeldCds.length)
      return { result: "failed", message: "シリーズコードが既に存在します" };
    return { result: "success" };
  };

  const handleCardClick = (series_cd: string) => {
    const newfilter = seriesList.filter((item) => item.series_cd !== series_cd);
    setseriesList(newfilter);
  };

  const handleCreateSeries = async () => {
    const res = await createSeriesApi({ body: seriesList });
    if (res.result !== "success") return;
    setMessage("シリーズが作成されました。");
    setseriesList([]);
    onClose();
    updateList();
  };
  return (
    <AppModal title={"シリーズ作成"} open={open} onClose={onClose}>
      <div className="flex h-[400px]">
        {/* input form */}
        <div className=" w-[400px] relative mx-5">
          <div className="flex justify-between w-full">
            <div className="p-1 font-bold w-1/2">商品分類</div>
            <AppDropDownList
              className="w-1/2"
              open={dropdownOpen}
              onClose={() => setdropdownOpen(false)}
              onSelect={handleSelectPcl}
              options={dropdownOptions}
            >
              <button
                className="w-full border border-slate-500 rounded-sm p-1 px-2 flex justify-between"
                onClick={(e) => handleClick(e)}
              >
                <div>{selectedPcl && selectedPcl.label}</div>
                <div className=" rotate-90 bg-white">＞</div>
              </button>
            </AppDropDownList>
          </div>
          <div>
            {selectedPcl && (
              <form
                className="w-full"
                onSubmit={(e) => handleAddToSeriesList(e, seriesList)}
              >
                <div className="w-full flex justify-between mt-2">
                  <label className="p-1 w-1/2 font-bold">シリーズコード</label>
                  <input
                    className="w-1/2 border border-slate-500"
                    type="text"
                    name="cd"
                  />
                </div>
                <div className="w-full flex justify-between mt-2">
                  <label className="p-1 w-1/2 font-bold">シリーズ名</label>
                  <input
                    className="w-1/2 border border-slate-500"
                    type="text"
                    name="name"
                  />
                </div>

                {attrList.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className="w-full flex justify-between mt-2"
                    >
                      <label className="p-1 w-1/2 font-bold">{item.name}</label>
                      <AppAttrInput
                        cd={item.cd}
                        className="w-1/2"
                        control_type={item.control_type}
                        value={item.default_value}
                        select_list={item.select_list}
                      />
                    </div>
                  );
                })}
                <div className="flex justify-end py-2 absolute bottom-0 right-0">
                  <AppButton
                    text={"追加"}
                    type="primary"
                    isForm={true}
                    onClick={() => console.log("object")}
                  ></AppButton>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* vertical line */}
        {!!seriesList.length && (
          <div className="border-r border-gray-300 h-full mx-5"></div>
        )}

        {/* created series preview */}
        {!!seriesList.length && (
          <div className=" overflow-auto h-[400px] w-[400px] p-2 mx-5">
            <div className="flex justify-end">
              <AppButton
                text={"＋ " + seriesList.length + "件のシリーズを作成する"}
                onClick={() => handleCreateSeries()}
                type={"primary"}
              />
            </div>
            {seriesList.map((series, i) => (
              <div
                key={i}
                className="rounded-md bg-gray-200 p-5 py-2 shadow-md my-3 w-full"
              >
                <div className="flex justify-end">
                  <button onClick={() => handleCardClick(series.series_cd)}>
                    ✕
                  </button>
                </div>
                <div className="flex w-full">
                  <div className="w-1/2 font-bold">シリーズ名</div>
                  <div>{series.series_name}</div>
                </div>
                <div className="border-b border-gray-300 my-1"></div>
                <div className="flex w-full">
                  <div className="w-1/2 font-bold">シリーズコード</div>
                  <div>{series.series_cd}</div>
                </div>
                <div className="border-b border-gray-300 my-1"></div>
                <div className="flex w-full">
                  <div className="w-1/2 font-bold">商品分類</div>
                  <div>{series.pcl_name}</div>
                </div>
                <div className="border-b border-gray-300 my-1"></div>
                {series.attrs.map((attr, i) => (
                  <>
                    <div key={i} className="flex w-full">
                      <div className="w-1/2 font-bold">{attr.name}</div>
                      <div>{attr.value}</div>
                    </div>
                    <div className="border-b border-gray-300 my-1"></div>
                  </>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppModal>
  );
};

export default SeriesCreateModal;
