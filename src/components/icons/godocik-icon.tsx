import ImageWithFallback from '../ui/image-with-fallback'

export const GodocikIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <span className="godocik relative overflow-hidden">
      {
        <ImageWithFallback
          width="32"
          height="32"
          src={'/godocik.svg'}
          alt={'Polish community Godocik server'}
          layout="intrinsic"
        />
      }
    </span>
  )
}
