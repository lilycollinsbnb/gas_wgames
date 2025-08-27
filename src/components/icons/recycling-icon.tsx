import ImageWithFallback from '../ui/image-with-fallback'

export const RecyclingIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <span className="godocik relative overflow-hidden">
      <ImageWithFallback
        width="22"
        height="22"
        alt={'Recycle assets'}
        layout="intrinsic"
        src={'/recycling-symbol.svg'}
      />
    </span>
  )
}
