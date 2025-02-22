import { Button } from "@nextui-org/react"; // NextUI Button component
import React, { useRef, useState } from "react";
import service from "../../services/services"; // Adjust path as needed
import apiUrls from "../../utils/apiUrls"; // Adjust path as needed
import useToast from "../../hooks/useToast";

interface FileInputProps {
  onFilesChange: (files: string[]) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFilesChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle drag over events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle files dropped into the drop area
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files: File[] = Array.from(e.dataTransfer.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove selected file by index
  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  // Convert file to base64 string
  // const convertToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => resolve(reader.result as string); // Convert to base64
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // Function to handle form submission and file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }
const {notify} = useToast();
    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file); // Directly append the file

        // Send to backend
        const response: any = await service({
          method: "post",
          url: apiUrls.products.fileUpload, // Ensure this URL is correct
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure content type is correct
          },
        });

        if (response.status === 200) {
          alert(`File "${file.name}" uploaded successfully!`);
          const uploadedUrl = response.data.data.url;
          onFilesChange([
            ...selectedFiles.map((file) => file.name),
            uploadedUrl,
          ]); // Append the new URL
        } else {
          alert(`Failed to upload file "${file.name}".`);
        }
      } catch (error) { 
        notify(`Error uploading file "${file.name}":`, { type: "error" });
      }
    }

    // Clear the selected files after upload
    setSelectedFiles([]);
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-950">
      <div
        className="flex justify-center items-center h-40 border-2 border-dashed border-gray-300 p-4 mb-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-0 text-base text-gray-500 cursor-pointer"
        >
          <span className="underline">Click Me</span> or Drag and Drop Here
        </div>
      </div>

      <div className="file-list flex flex-wrap gap-4">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center gap-2 p-2 border border-gray-300 rounded"
          >
            {file.type.startsWith("image") && (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-24 h-24 object-cover mb-2 rounded"
              />
            )}
            <span className="text-sm line-clamp-1 max-w-[150px]">
              {file.name}
            </span>
            <Button
              color="danger"
              onClick={() => removeFile(index)}
              className="absolute top-[-8px] right-[-8px] p-1 rounded-full"
            >
              &times;
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0}
          className="text-gray-300"
          variant="bordered"
        >
          Submit Media
        </Button>
      </div>
    </div>
  );
};

export default FileInput;
