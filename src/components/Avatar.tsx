/* eslint-disable @next/next/no-img-element -- avatars are small data: URLs from this browser, not optimizable assets */

/** True when the avatar is an uploaded photo (a data: URL) rather than an emoji. */
export function isPhotoAvatar(avatar: string | null | undefined): avatar is string {
  return typeof avatar === "string" && avatar.startsWith("data:image/");
}

/**
 * The student's avatar: an uploaded photo or an emoji, in a circle.
 * `className` sizes the circle (e.g. "h-10 w-10 text-xl"); emoji size follows the text size.
 */
export function Avatar({ value, className = "h-10 w-10 text-xl", alt = "" }: { value: string; className?: string; alt?: string }) {
  if (isPhotoAvatar(value)) return <img src={value} alt={alt} className={`shrink-0 rounded-full object-cover ${className}`} />;
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-accent-soft leading-none ${className}`} aria-hidden={alt ? undefined : true}>
      {value}
    </span>
  );
}

const SIZE = 256;

/** Draws an image (URL) into a size×size square, center-cropped, and returns it as WebP/JPEG data. */
async function squareImage(src: string, size: number, quality: number): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Couldn't open that image. Try a JPG or PNG."));
    i.src = src;
  });
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser can't process images.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
  const webp = canvas.toDataURL("image/webp", quality);
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", quality);
}

/**
 * The avatar as other students see it (leaderboards): emoji as is, a photo shrunk to a 64×64 thumbnail
 * (a few KB) so boards with many photos stay light.
 */
export async function publicAvatar(avatar: string): Promise<string> {
  if (!isPhotoAvatar(avatar)) return avatar;
  try {
    return await squareImage(avatar, 64, 0.8);
  } catch {
    return "🙂";
  }
}

/**
 * Turns an image file into a small square avatar (center crop, 256×256) as a data URL, so it fits in this
 * browser's storage. Rejects files that aren't images or are too big to read comfortably.
 */
export async function fileToAvatar(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image. Pick a JPG, PNG or WebP.");
  if (file.size > 15 * 1024 * 1024) throw new Error("That image is over 15 MB. Pick a smaller one.");
  const url = URL.createObjectURL(file);
  try {
    return await squareImage(url, SIZE, 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
