import AnchorLink from './links/anchor-link';
import { DisocordIcon } from '../icons/discord-icon';

export default function DiscordButton({ className }: { className?: string }) {
  return (
    <AnchorLink
      aria-label="Discord"
      href='https://discord.gg/tCkUkkDu64'
      target="_blank"
      
      className={className}
    >
      <span className="relative flex items-center">
        <DisocordIcon className="h-5 w-5" />
      </span>
    </AnchorLink>
  );
}
