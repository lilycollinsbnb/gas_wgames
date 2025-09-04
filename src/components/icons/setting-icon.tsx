import ImageWithFallback from "../ui/image-with-fallback";

export const SettingIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/settings.png"
              alt="Settings"
              width={32}
              height={32}
            />
  );
};
