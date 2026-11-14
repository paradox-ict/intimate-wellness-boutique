/** Downscales an image file in the browser and returns base64 JPEG (no data: prefix). */
export async function compressImage(
  file: File,
  maxSide = 1600,
  quality = 0.82,
): Promise<{ base64: string; contentType: string; previewUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { base64: dataUrl.split(",")[1] ?? "", contentType: "image/jpeg", previewUrl: dataUrl };
}
