import Image, { type ImageProps } from "next/image";
import { productImageUsesBackend } from "@/lib/product-images";

type ProductImageProps = Omit<ImageProps, "unoptimized"> & {
  unoptimized?: boolean;
};

export function ProductImage({ src, unoptimized, ...props }: ProductImageProps) {
  const imageSrc = typeof src === "string" ? src : "";
  const fromBackend = imageSrc ? productImageUsesBackend(imageSrc) : false;

  return (
    <Image
      src={src}
      unoptimized={unoptimized ?? fromBackend}
      {...props}
    />
  );
}
