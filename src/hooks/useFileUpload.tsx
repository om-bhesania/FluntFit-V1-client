import service from "../services/services";
import apiUrls from "../utils/apiUrls";

// Resize image if necessary
const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  maxSize: number = 4 * 1024 * 1024 // 4MB by default
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      reject("Invalid file type. Please upload an image.");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        // Calculate the new dimensions while maintaining the aspect ratio
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Set the canvas size to the new image size
        canvas.width = width;
        canvas.height = height;

        // Draw the resized image on the canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress image by reducing the quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              const imageSize = blob.size;
              if (imageSize > maxSize) {
                reject("Image is still too large after resizing.");
              } else {
                resolve(resizedFile);
              }
            } else {
              reject("Error in compressing image.");
            }
          },
          file.type,
          0.7
        ); // Compress to 70% quality
      };

      img.onerror = (error) => reject(error);

      // Ensure file is passed correctly as a Blob
      const fileURL = reader.result as string;
      img.src = fileURL;
    };

    reader.onerror = (error) => reject(error);

    // Ensure file is passed correctly as a Blob
    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    } else {
      reject("Invalid file type passed to FileReader");
    }
  });
};

// Upload files directly to Imgur
const uploadFilesToImgur = async (files: File[]): Promise<string[]> => {
  const uploadedUrls: string[] = [];
  const maxSize = 4 * 1024 * 1024; // 4MB
  const maxWidth = 1024; // Resize images larger than 1024px width
  const maxHeight = 1024; // Resize images larger than 1024px height

  for (const file of files) {
    // Check if the file size is larger than the max size
    if (file.size > maxSize) {
      console.error(`Image ${file.name} is too large.`);
      continue; // Skip uploading this image
    }

    try {
      // Resize image if it's larger than maxWidth or maxHeight
      const resizedFile = await resizeImage(file, maxWidth, maxHeight);

      // Upload the resized file to Imgur
      const formData = new FormData();
      formData.append("image", resizedFile);

      const response: any = await service({
        method: "post",
        url: apiUrls.products.fileUpload, // Replace with your actual backend API URL
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Client-ID 865426e7f41e850`, // Use your Imgur Client ID
        },
      });

      uploadedUrls.push(response?.data?.link); // Assuming response contains a `link` field
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  }

  return uploadedUrls;
};

export default uploadFilesToImgur;
