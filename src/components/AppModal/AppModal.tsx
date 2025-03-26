import { ReactNode } from "react";
type Props = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
};
const AppModal = ({ children, open, onClose, title }: Props) => {
  if (!open) {
    return null;
  }

  return (
    <div
      onClick={(e) => onClose()}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      {/* 中身の白い部分 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white p-4 rounded-md "
      >
        <div className="flex justify-between mb-3">
          <div className="text-lg font-bold">{title}</div>
          <button onClick={() => onClose()} className="  ">
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AppModal;
