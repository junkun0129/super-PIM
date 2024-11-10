import React, { useEffect, useRef, useState } from "react";
import labelsApis from "../../api_dev/labels.api";
import { LABEL_COLOR_OPTIONS } from "../../constant";
import { useMessageContext } from "../../providers/MessageContextProvider";
import { generateRandomString } from "../../util";
const LabelManage = () => {
  const { getAllLabelsApi, updateLabelsApi } = labelsApis;
  const [labels, setlabels] = useState<LabelsTable[]>([]);
  const [searchTerm, setsearchTerm] = useState<string>("");
  const [fiteredLabels, setfiteredLabels] = useState<LabelsTable[]>([]);
  const [deleted, setdeleted] = useState<LabelsTable[]>([]);
  const { setMessage } = useMessageContext();
  const updateLabels = async () => {
    const res = await getAllLabelsApi();
    if (res.result !== "success") return;
    setlabels(res.data);
  };
  useEffect(() => {
    updateLabels();
  }, []);

  useEffect(() => {
    const newFiltered = labels
      .filter((item) => item.name.includes(searchTerm))
      .filter((item) => item.cd !== "delete");

    setfiteredLabels(newFiltered);
  }, [searchTerm, labels]);

  const handleColorChange = (color: string, cd: string) => {
    const newLabels = labels.map((label, i) => {
      if (label.cd === cd) {
        return { ...label, color };
      }
      return label;
    });
    setlabels(newLabels);
  };

  const handleCreateLabel = () => {
    const num = generateRandomString(10);
    setlabels((pre) => {
      return [
        ...pre,
        { color: LABEL_COLOR_OPTIONS[0], cd: "new-" + num, name: "" },
      ];
    });
  };

  const handleDeleteLabel = (cd: string) => {
    const newLabels = labels.filter((item) => item.cd !== cd);

    setlabels(newLabels);
    const filteredDeleted = labels.filter((item) => item.cd === cd);
    if (!filteredDeleted.length) return;
    setdeleted((pre) => [...pre, filteredDeleted[0]]);
  };

  const handleSaveLabel = async () => {
    const res = await updateLabelsApi({
      body: {
        update: labels.filter((item) => !item.cd.includes("new-")),
        create: labels.filter((item) => item.cd.includes("new-")),
        delete: deleted,
      },
    });
    if (res.result !== "success") return;
    setMessage("ラベルの更新に成功しました");
  };

  const handleNameChange = (value: string, cd: string) => {
    const newLabels = labels.map((item) => {
      if (item.cd === cd) {
        return { ...item, name: value };
      }
      return item;
    });
    setlabels(newLabels);
  };

  return (
    <div>
      <input
        placeholder="ラベル名の検索"
        onChange={(e) => setsearchTerm(e.target.value)}
      />
      <div>
        {fiteredLabels.map((label, i) => {
          return (
            <div key={label.cd + i}>
              <div>
                <AppColorPicker
                  color={label.color}
                  onColorChange={(color: string) =>
                    handleColorChange(color, label.cd)
                  }
                />
              </div>
              <input
                value={label.name}
                onChange={(e) => handleNameChange(e.target.value, label.cd)}
              ></input>
              <button onClick={() => handleDeleteLabel(label.cd)}>✖</button>
            </div>
          );
        })}
        <button onClick={handleCreateLabel}>＋</button>
        <button onClick={handleSaveLabel}>保存</button>
      </div>
    </div>
  );
};

export default LabelManage;

const AppColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (color: string) => void;
}) => {
  const [open, setopen] = useState(false);
  const ref = useRef(null);
  const handleClose = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setopen(false);
    }
  };

  useEffect(() => {
    if (open) {
      window.addEventListener("mousedown", handleClose);
    } else {
      window.removeEventListener("mousedown", handleClose);
    }
  }, [open]);

  return (
    <div className="relative">
      <div
        onClick={() => setopen(true)}
        className="w-[50px] h-[50px]"
        style={{ backgroundColor: color }}
      ></div>
      <div ref={ref} className="absolute flex">
        {open &&
          LABEL_COLOR_OPTIONS.map((item) => (
            <div
              key={item}
              onClick={() => onColorChange(item)}
              style={{ backgroundColor: item }}
              className="w-[50px] h-[50px] p-4 "
            ></div>
          ))}
      </div>
    </div>
  );
};
