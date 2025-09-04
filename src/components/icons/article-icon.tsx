import ImageWithFallback from "../ui/image-with-fallback";

export const BlogArticleIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/blog.png"
              alt="Blog"
              width={32}
              height={32}
            />
  );
};
