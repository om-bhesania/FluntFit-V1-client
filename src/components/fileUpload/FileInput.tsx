import React, { useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { FileInputIcon } from "lucide-react";

interface FileInputProps {
  onFilesChange: (files: File[]) => void;
  setFieldValue: (field: string, value: any) => void;
  acceptsVideos?: boolean;
  fieldName: string;
  isInvalid?: boolean;
  error?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  onFilesChange,
  setFieldValue,
  acceptsVideos = false,
  fieldName,
  isInvalid,
  error,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files: File[] = Array.from(event.target.files || []);
    updateFiles(files);
  };

  const updateFiles = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
    setFieldValue(fieldName, newFiles); // Set Formik field value
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files);
    updateFiles(files);
  };

  const removeFile = (index: number, e: any) => {
    e.preventDefault();
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
    setFieldValue(fieldName, newFiles); // Update Formik field value
    resetFileInput();
  };

  const removeAllFiles = (e: any) => {
    e.preventDefault();
    setSelectedFiles([]);
    onFilesChange([]);
    setFieldValue(fieldName, []); // Clear Formik field value
    resetFileInput();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImageFile = (file: File) =>
    /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file.name);
  const isVideoFile = (file: File) =>
    /\.(mp4|avi|mov|mkv|wmv|flv|webm)$/i.test(file.name);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <div
        className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label htmlFor="file-upload" className="cursor-pointer">
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptsVideos ? "image/*,video/*" : "image/*"}
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            className={`flex ${
              selectedFiles.length > 0 ? "justify-end" : "justify-center"
            } gap-3 mb-4`}
          >
            {selectedFiles.length === 0 && (
              <FileInputIcon className="text-accent/50" />
            )}
            {selectedFiles.length > 4 && (
              <Button
                variant="solid"
                color="danger"
                onClick={removeAllFiles}
                className="bg-primary text-white"
              >
                Remove All
              </Button>
            )}

            <div>
              {selectedFiles.length === 0 && acceptsVideos && (
                <>
                  Upload Videos or GIF by drag and drop or{" "}
                  <span className="text-primary font-semibold">browse</span> to
                  upload{" "}
                </>
              )}
              {selectedFiles.length === 0 && !acceptsVideos && (
                <>
                  Drag and drop files here, or{" "}
                  <span className="text-primary font-semibold">browse</span> to
                  upload
                </>
              )}
            </div>
          </div>

          <div className="file-list flex flex-wrap items-center space-y-2 gap-6">
            {selectedFiles.map((file, index) => (
              <div
                className="flex flex-col items-center relative w-[100px] h-[150px]"
                key={index}
              >
                {isImageFile(file) && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="!w-[80px] h-[120px] mb-3 object-cover mr-2"
                  />
                )}

                {!isImageFile(file) && acceptsVideos && isVideoFile(file) && (
                  <video
                    className="w-[80px] h-w-[80px] object-cover mr-2"
                    controls
                    src={URL.createObjectURL(file)}
                  />
                )}
                <div className="truncate flex-grow break-all max-w-[100px] mt-auto">
                  {file.name}
                </div>
                <Button
                  variant="solid"
                  color="warning"
                  onClick={(e: any) => removeFile(index, e)}
                  className="absolute bg-primary text-white top-[-12px] right-[12px] rounded-full h-8 min-h-8 w-5 min-w-5"
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
        </label>
      </div>
      {isInvalid && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default FileInput;
