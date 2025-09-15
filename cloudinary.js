export const uploadImageToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg", // or image/png depending on file
    name: "upload.jpg",
  });
  data.append("upload_preset", "eterna"); // ⚡ replace
  data.append("cloud_name", "dmhn8f3al"); // ⚡ replace

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmhn8f3al/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    if (result.secure_url) {
      return result.secure_url;
    } else {
      throw new Error(result.error?.message || "Cloudinary upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};
