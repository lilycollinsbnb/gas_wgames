import AnchorLink from './links/anchor-link';
import { GodotIcon } from '../icons/godot-icon';

export default function DiscordButton({ className }: { className?: string }) {
  return (
    <AnchorLink
      aria-label="Godot download web page"
      href='https://godotengine.org/download'
      target="_blank"
      
      className={className}
    >
      <span className="relative flex items-center">
        <GodotIcon className="h-5 w-5" />
      </span>
    </AnchorLink>
  );
}
