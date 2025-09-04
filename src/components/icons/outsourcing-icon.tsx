import ImageWithFallback from "../ui/image-with-fallback";

export const OutsourcingIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/outsourcing.png"
              alt="Outsourcing"
              width={32}
              height={32}
            />
  );
}
