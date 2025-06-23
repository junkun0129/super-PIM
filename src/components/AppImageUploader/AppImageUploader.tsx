import { useEffect, useRef, useState } from "react";

type Props = {
  onFileSelect: (file: File) => void;
  acceptExtensions: string[]; // 例: ['.jpg', '.png', '.pdf']
  imagePath: string;
};

const AppImageUploader = ({
  onFileSelect,
  acceptExtensions,
  imagePath,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hover, sethover] = useState(false);
  const [imageSrc, setImageSrc] = useState(imagePath); // 初期の画像URLを保持する状態

  const handleClick = () => {
    inputRef.current?.click(); // ファイル選択ダイアログを開く
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isAccepted(file)) {
      // ファイルを読み込み、サムネイルとして表示
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string); // FileReaderで読み込んだ結果（画像URL）をセット
      };
      reader.readAsDataURL(file); // Base64の画像データとして読み込む

      onFileSelect(file); // 親コンポーネントへ選択されたファイルを通知
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // ドラッグオーバー時のデフォルト動作を防ぐ
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false); // ドラッグが領域から離れたとき
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // ドロップ時のデフォルト動作を防ぐ
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && isAccepted(file)) {
      // ファイルを読み込み、サムネイルとして表示
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string); // FileReaderで読み込んだ結果（画像URL）をセット
      };
      reader.readAsDataURL(file); // Base64の画像データとして読み込む

      onFileSelect(file); // 親コンポーネントへ選択されたファイルを通知
    }
  };

  const isAccepted = (file: File) => {
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    return acceptExtensions.includes(fileExt); // 拡張子が許可されたものか確認
  };
  const handleMouseOver = (e: React.MouseEvent) => {
    e.preventDefault();
    sethover(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    sethover(false);
  };
  useEffect(() => {
    console.log(imagePath);
    setImageSrc(imagePath);
  }, [imagePath]);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full h-full relative"
      style={{
        border: "1px solid gray",
        padding: "20px",
        textAlign: "center",
        backgroundColor: dragging ? "#f0f8ff" : "#fff",
        cursor: "pointer",
      }}
    >
      {hover && (
        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center ">
          <div className="relative w-full h-full">
            <div className="w-full h-full absolute bg-black opacity-70"></div>
            <div className="w-full h-full absolute flex justify-center items-center text-white">
              クリックして画像を挿入
            </div>
          </div>
        </div>
      )}
      {dragging && (
        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center ">
          <div className="relative w-full h-full">
            <div className="w-full h-full absolute bg-black opacity-70"></div>
            <div className="w-full h-full absolute flex justify-center items-center text-white">
              ここにドラッグしてください
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept={acceptExtensions.join(",")}
        onClick={(e) => e.stopPropagation()}
      />
      <img
        src={imageSrc}
        alt="選択された画像"
        onError={(e) => {
          // 画像の読み込み失敗時に代替画像を表示
          const target = e.currentTarget;
          target.onerror = null;
          target.src = "http://localhost:3000/nocontent.png";
        }}
        width={"100%"}
        className="w-full h-full"
        height={"100%"}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export default AppImageUploader;
