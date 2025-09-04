import ImageWithFallback from "../ui/image-with-fallback"

export const ServicesIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/services.png"
              alt="Games"
              width={32}
              height={32}
            />
  );
}
