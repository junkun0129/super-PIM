import React, { ReactNode, useEffect, useState } from "react";
import AppModal from "../../components/AppModal/AppModal";
import AppDropDownList from "../../components/AppDropDownList/AppDropDownList";

import AppButton from "../../components/AppButton/AppButton";
import AppAttrInput from "../../components/AppAttrInput/AppAttrInput";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { getPclAttrEntriesApi, GetPclEntriesApi } from "../../api/pcl.api";
import { checkProductApi, createProductApi } from "../../api/product.api";
import { runWithConcurrency } from "../../util";
type Props = {
  isSeries: boolean;
  open: boolean;
  onClose: () => void;
  updateList: () => void;
};

export type CreatedSeriesEntry = {
  pcl_cd: string;
  pcl_name: string;
  series_hinban: string;
  series_name: string;
  attrs: { cd: string; value: string; name: string; unit?: string }[];
};

type CreateProductAttr = {
  cd: string;
  name: string;
  is_with_unit: string;
  unit: string;
  control_type: string;
  not_null: string;
  max_length: number | null;
  selected_list: string;
  default_value: string;
  is_common: string;
};
const ProductCreateModal = ({ open, onClose, updateList, isSeries }: Props) => {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [dropdownOptions, setdropdownOptions] = useState<
    { cd: string; label: string }[]
  >([]);

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

  useEffect(() => {
    if (!open) {
      setdropdownOptions([]);
      setselectedPcl(null);
      setattrList([]);
      setseriesList([]);
    }
  }, [open]);

  const getAttrList = async (pcl_cd: string) => {
    const res = await getPclAttrEntriesApi({ pcl_cd });
    if (res.result !== "success") return;
    setattrList(
      res.data
        .filter((item) => item.atp_is_common === "1")
        .map((item) => ({
          cd: item.attr.atr_cd,
          is_common: item.atp_is_common,
          name: item.attr.atr_name,
          is_with_unit: item.attr.atr_is_with_unit,
          unit: item.attr.atr_unit,
          not_null: item.attr.atr_not_null,
          control_type: item.attr.atr_control_type,
          default_value: item.attr.atr_default_value,
          max_length: item.attr.atr_max_length,
          selected_list: item.attr.atr_select_list,
        }))
    );
  };

  const handleSelectPcl = (cd) => {
    const pcl = dropdownOptions.find((item) => item.cd === cd);
    if (!pcl) return;
    setselectedPcl(pcl);
    setdropdownOpen(false);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const res = await GetPclEntriesApi();
    if (res.result !== "success") return;
    setdropdownOptions(
      res.data.map((item) => ({
        cd: item.pcl_cd,
        label: item.pcl_name,
      }))
    );
    setdropdownOpen(true);
  };

  const handleAddToSeriesList = async (
    e: React.FormEvent<HTMLFormElement>,
    seriesList: CreatedSeriesEntry[]
  ) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const series_hinban = form.get("cd") as string;
    const series_name = form.get("name") as string;

    if (series_hinban === "") {
      return setMessage("シリーズコードを入力してください");
    }

    if (series_name === "") {
      return setMessage("シリーズ名を入力してください");
    }
    const res = await checkSeries(series_hinban, series_name, seriesList);

    if (res.result !== "success") return setMessage(res.message);
    const newSeriesEntry: CreatedSeriesEntry = {
      pcl_cd: selectedPcl.cd,
      pcl_name: selectedPcl.label,
      series_hinban,
      series_name,
      attrs: attrList.map((attr, i) => {
        return {
          cd: attr.cd,
          value: form.get(attr.cd) as string,
          name: attr.name,
          unit: attr.unit ?? "",
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
  ): Promise<{ result: string; message?: string }> => {
    const res = await checkProductApi({
      body: {
        pr_hinban: cd,
        pr_name: name,
      },
    });
    if (res.result !== "success") return res;
    const doubledNames = list.filter((item) => item.series_name === name);
    const doubeldCds = list.filter((item) => item.series_hinban === cd);
    if (!!doubledNames.length)
      return { result: "failed", message: "シリーズ名が既に存在します" };
    if (!!doubeldCds.length)
      return { result: "failed", message: "シリーズコードが既に存在します" };
    return { result: "success" };
  };

  const handleCardClick = (series_cd: string) => {
    const newfilter = seriesList.filter(
      (item) => item.series_hinban !== series_cd
    );
    setseriesList(newfilter);
  };

  const handleCreateSeries = async () => {
    const createPromises = seriesList.map((item) => () => {
      return createProductApi({
        body: {
          is_series: !!isSeries ? "1" : "0",
          pr_name: item.series_name,
          pr_hinban: item.series_hinban,
          ctg_cd: "",
          pcl_cd: item.pcl_cd,
          attrvalues: item.attrs.map((attr) => ({
            atr_cd: attr.cd,
            atv_value: attr.value,
          })),
        },
      });
    });
    const res = await runWithConcurrency(createPromises, 10);
    if (res.some((item) => item.result === "failed")) return;
    setMessage("シリーズが作成されました。");
    setseriesList([]);
    onClose();
    updateList();
  };
  return (
    <AppModal
      title={isSeries ? "シリーズ作成" : "SKU作成"}
      open={open}
      onClose={onClose}
    >
      <div className="flex h-[400px] ">
        {/* input form */}
        <form
          className=" flex flex-col justify-between"
          onSubmit={(e) => handleAddToSeriesList(e, seriesList)}
        >
          <div className=" w-[400px]  mx-5 overflow-auto h-full">
            <div className="flex justify-between w-full">
              <div className="p-1 font-bold w-1/2 ">属性セット</div>
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

            {selectedPcl && (
              <>
                <div className="w-full flex justify-between mt-2">
                  <label className="p-1 w-1/2 font-bold">商品コード</label>
                  <input
                    className="w-1/2 border border-slate-500"
                    type="text"
                    name="cd"
                  />
                </div>
                <div className="w-full flex justify-between mt-2">
                  <label className="p-1 w-1/2 font-bold">
                    {isSeries ? "シリーズ名" : "SKU名"}
                  </label>
                  <input
                    className="w-1/2 border border-slate-500"
                    type="text"
                    name="name"
                  />
                </div>

                <div>
                  {attrList.map((item) => {
                    return (
                      <div
                        key={item.cd}
                        className="w-full flex justify-between mt-2"
                      >
                        <label className="p-1 w-1/2 font-bold">
                          {item.name}
                        </label>
                        <AppAttrInput
                          cd={item.cd}
                          className="w-1/2"
                          control_type={item.control_type}
                          required={item.not_null === "1" ? true : false}
                          {...(!!item.max_length
                            ? { maxLength: item.max_length }
                            : {})}
                          default_value={item.default_value}
                          select_list={item.selected_list}
                          unit={item.unit}
                          is_with_unit={item.is_with_unit}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <AppButton
            text={"追加"}
            type="primary"
            className="w-[100%] mt-5"
            isForm={true}
            disabled={!selectedPcl}
            onClick={() => console.log("object")}
          ></AppButton>
        </form>
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
                  <button onClick={() => handleCardClick(series.series_hinban)}>
                    ✕
                  </button>
                </div>
                <div className="flex w-full">
                  <div className="w-1/2 font-bold">シリーズ名</div>
                  <div>{series.series_name}</div>
                </div>
                <div className="border-b border-gray-300 my-1"></div>
                <div className="flex w-full">
                  <div className="w-1/2 font-bold">商品コード</div>
                  <div>{series.series_hinban}</div>
                </div>
                <div className="border-b border-gray-300 my-1"></div>
                <div className="flex w-full">
                  <div className="w-1/2 font-bold">属性セット</div>
                  <div>{series.pcl_name}</div>
                </div>
                <div className="border-b border-gray-300 my-1"></div>
                {series.attrs.map((attr, i) => (
                  <>
                    <div key={i} className="flex w-full">
                      <div className="w-1/2 font-bold">{attr.name}</div>
                      <div>
                        {attr.value} {attr.unit}
                      </div>
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

export default ProductCreateModal;
