import ImageWithFallback from "../ui/image-with-fallback";

export const DiscoverIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/explore.png"
              alt="Explore"
              width={32}
              height={32}
            />
  );
};
