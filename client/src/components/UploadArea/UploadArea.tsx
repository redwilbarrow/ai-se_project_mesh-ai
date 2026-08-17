import "./UploadArea.css";
import uploadIcon from "../../assets/images/upload-icon.svg";

type Props = {
  onFileSelect: (file: File) => void;
};

export default function UploadArea({ onFileSelect }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      className="upload-area"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="upload-area__label">
        <img
          src={uploadIcon}
          alt=""
          aria-hidden="true"
          className="upload-area__upload-icon"
        />
        <span className="upload-area__hint">Drag and drop a PDF, or </span>
        <span className="underline">Upload</span>
        <input
          type="file"
          accept=".pdf"
          className="upload-area__input"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
