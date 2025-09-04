import ImageWithFallback from "../ui/image-with-fallback";

export const SearchIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/search.png"
              alt="Search"
              width={32}
              height={32}
            />
  );
};
