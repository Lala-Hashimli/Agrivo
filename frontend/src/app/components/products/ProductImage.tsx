import { getProductImage, resolveProductImage } from "../../utils/productImages";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../ui/utils";

export function ProductImage({
  name,
  src,
  category,
  alt,
  className,
  wrapperClassName,
}: {
  name: string;
  src?: string | null;
  category?: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
}) {
  const resolved = resolveProductImage(name, src, category);
  const imageAlt = alt ?? `${name} product image`;

  return (
    <div className={cn("agrivo-product-image-frame", wrapperClassName)}>
      <ImageWithFallback
        src={resolved}
        alt={imageAlt}
        productName={name}
        category={category}
        fallbackSrc={getProductImage(name, category)}
        className={cn("agrivo-product-image-media h-full w-full object-cover", className)}
      />
    </div>
  );
}
