import ImageWithFallback from "../ui/image-with-fallback"

export const GameDiscIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/games.png"
              alt="Games"
              width={32}
              height={32}
            />
  )
}
