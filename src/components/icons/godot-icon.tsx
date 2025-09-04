import ImageWithFallback from '../ui/image-with-fallback'

export const GodotIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <span className="godocik relative overflow-hidden">
      <ImageWithFallback
        width="32"
        height="32"
        src={'/godot.svg'}
        alt={'Godot download'}
        layout="intrinsic"
      />
    </span>
  )
}
