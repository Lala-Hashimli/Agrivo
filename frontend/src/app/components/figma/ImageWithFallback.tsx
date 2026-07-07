import React, { useEffect, useMemo, useState } from "react";
import {
  getProductImage,
  getProductImageFallbackChain,
} from "../../utils/productImages";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    fallbackSrc?: string;
    productName?: string;
    category?: string;
  },
) {
  const { src, alt, style, className, fallbackSrc, productName, category, ...rest } = props;

  const label = productName ?? alt ?? "Product";
  const fallbacks = useMemo(
    () => getProductImageFallbackChain(label, category, fallbackSrc),
    [label, category, fallbackSrc],
  );

  const preferredSrc = src?.trim() || fallbacks[0] || getProductImage(label, category);
  const [currentSrc, setCurrentSrc] = useState(preferredSrc);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    setCurrentSrc(preferredSrc);
    setFallbackIndex(0);
  }, [preferredSrc]);

  const handleError = () => {
    const nextIndex = fallbackIndex + 1;
    const nextSrc = fallbacks[nextIndex];
    if (nextSrc && nextSrc !== currentSrc) {
      setFallbackIndex(nextIndex);
      setCurrentSrc(nextSrc);
      return;
    }
    setCurrentSrc(getProductImage(label, category));
  };

  return (
    <img
      src={currentSrc}
      alt={alt ?? `${label} product image`}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
