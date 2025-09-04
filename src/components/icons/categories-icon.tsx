import ImageWithFallback from "../ui/image-with-fallback";

export const CategoriesIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/categories.png"
              alt="Categories"
              width={32}
              height={32}
            />
  );
};
