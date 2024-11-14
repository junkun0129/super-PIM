import React, { ReactNode, useEffect, useRef, useState } from "react";
type Props = {
  children: JSX.Element[];

  layerCd: string;
  onDrop?: ({ activeCd, overCd }: { activeCd: string; overCd: string }) => void;
};
const AppSortable = ({ children, layerCd, onDrop }: Props) => {
  const [activeCd, setactiveCd] = useState<string | null>(null);
  const [overCd, setoverCd] = useState<string | null>(null);

  const dragstart_handler = (
    event: React.DragEvent<HTMLTableCellElement>,
    newActiveCd: string
  ) => {
    setactiveCd(newActiveCd);
  };

  function dragover_handler(
    event: React.DragEvent<HTMLTableCellElement>,
    newOverCd: string
  ) {
    event.preventDefault();
    setoverCd(newOverCd);
  }

  const drop_handler = (
    event: React.DragEvent<HTMLTableCellElement>,
    cd: string
  ) => {
    const div = event.view.document.getElementsByClassName(cd);
    if (div && div.length > 0) {
      (div[0] as HTMLElement).style.backgroundColor = "";
      const isOk = (div[0] as HTMLElement).className.includes(layerCd);
      if (activeCd && overCd && isOk) {
        onDrop({ activeCd, overCd });
      }
    }

    setactiveCd(null);
    setoverCd(null);
  };

  const dragenter_handler = (
    event: React.DragEvent<HTMLTableCellElement>,
    cd: string
  ) => {
    const div = event.view.document.getElementsByClassName(cd);
    if (div && div.length > 0) {
      const isOk = (div[0] as HTMLElement).className.includes(layerCd);
      if (!isOk) return;
      (div[0] as HTMLElement).style.backgroundColor = "lightblue";
    }
  };

  const dragleave_handler = (
    event: React.DragEvent<HTMLTableCellElement>,
    cd: string
  ) => {
    const div = event.view.document.getElementsByClassName(cd);
    if (div && div.length > 0) {
      const isOk = (div[0] as HTMLElement).className.includes(layerCd);
      if (!isOk) return;
      (div[0] as HTMLElement).style.backgroundColor = "";
    }
  };

  return (
    <div>
      {children.map((Item, i) => {
        return (
          <div
            className={`sortable ${layerCd} ${Item.key}`}
            draggable="true"
            onDragStart={(e: any) => dragstart_handler(e, Item.key)}
            onDrop={(e: any) => drop_handler(e, Item.key)}
            onDragOver={(e: any) => dragover_handler(e, Item.key)}
            onDragEnter={(e: any) => dragenter_handler(e, Item.key)}
            onDragLeave={(e: any) => dragleave_handler(e, Item.key)}
          >
            {Item}
          </div>
        );
      })}
    </div>
  );
};

export default AppSortable;
