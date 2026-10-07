export async function compressImage(file: File, maxSize = 1600, quality = 0.8): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 400 * 1024) return file;
  const source = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  return blob ? new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" }) : file;
}
