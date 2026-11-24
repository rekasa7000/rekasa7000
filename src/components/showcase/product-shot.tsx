import Image from "next/image";

/** A real product screenshot in the same frame the illustrated scenes use. */
export function ProductShot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <div className="plot-scene product-shot">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 1400px, 200vw"
        className="product-shot-img"
      />
      <span className="plot-caption product-shot-caption">{caption}</span>
    </div>
  );
}

export const OneixShot = () => (
  <ProductShot
    src="/images/works/oneix.png"
    alt="The ONEix customer support demo: a banking fraud case with the call widget open"
    caption="ONEix customer demo, sample data"
  />
);
