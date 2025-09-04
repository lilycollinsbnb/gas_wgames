import ImageWithFallback from "../ui/image-with-fallback";

export const CartIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/cart.png"
              alt="Cart"
              width={32}
              height={32}
            />
  );
};
