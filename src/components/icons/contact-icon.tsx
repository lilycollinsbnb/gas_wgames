import ImageWithFallback from "../ui/image-with-fallback";

export const ContactIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/contact.png"
              alt="Contact"
              width={32}
              height={32}
            />
  )
};
