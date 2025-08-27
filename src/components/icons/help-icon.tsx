import ImageWithFallback from "../ui/image-with-fallback";

export const HelpIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/help.png"
              alt="Help"
              width={32}
              height={32}
            />
  );
};
