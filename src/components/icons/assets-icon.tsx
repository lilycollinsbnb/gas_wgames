import ImageWithFallback from "../ui/image-with-fallback";

export const AssetsIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/assets.png"
              alt="Home (assets)"
              width={32}
              height={32}
            />
  );
};
