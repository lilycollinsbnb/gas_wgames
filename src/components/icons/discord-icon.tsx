import ImageWithFallback from '../ui/image-with-fallback'

export const DisocordIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <span className="godocik relative overflow-hidden">
      <ImageWithFallback
        width="32"
        height="32"
        alt={'Assets4Godot community server'}
        layout="intrinsic"
        src={'/discord_grey.svg'}
      />
    </span>
  )
}
