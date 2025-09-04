import ImageWithFallback from "../ui/image-with-fallback";

export const PeopleIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/authors.png"
              alt="Top Authors"
              width={32}
              height={32}
            />
  );
};
