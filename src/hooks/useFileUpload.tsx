import service from "../services/services";
import apiUrls from "../utils/apiUrls";

const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
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

        // Convert the resized image to a base64 string
        const resizedBase64 = canvas.toDataURL(file.type);
        resolve(resizedBase64);
      };

      img.onerror = (error) => reject(error);

      img.src = reader.result as string;
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const uploadFilesToVercel = async (files: File[]): Promise<string[]> => {
  const uploadedUrls: string[] = [];
  const maxSize = 50 * 1024 * 1024; // 50MB
  const maxWidth = 1024; // Resize images larger than 1024px width
  const maxHeight = 1024; // Resize images larger than 1024px height

  for (const file of files) {
    if (file.size > maxSize) {
      console.error(`File ${file.name} is too large.`);
      continue; // Skip uploading this file
    }

    // Resize the image if it's too large
    let base64File = await new Promise<string>((resolve, reject) => {
      if (file.type.startsWith("image/")) {
        resizeImage(file, maxWidth, maxHeight).then(resolve).catch(reject);
      } else {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(reader.result?.toString().split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    });

    try {
      const response: any = await service({
        method: "post",
        url: apiUrls.products.fileUpload,
        data: {
          file: base64File,
          fileName: file.name,
          contentType: file.type,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      uploadedUrls.push(response?.url); // Assuming response contains a `url` field
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  }

  return uploadedUrls;
};

export default uploadFilesToVercel;
