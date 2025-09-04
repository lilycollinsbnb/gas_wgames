const DiscordLoginButton = () => {
  const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ?? ''
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI ?? ''
  )
  const scopes = encodeURIComponent('identify email')
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${discordClientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`
  return (
    <button
      className="discord-login-btn justify-left flex h-12 w-full items-center px-3.5"
      onClick={() => (window.location.href = discordAuthUrl)}
    >
      <img
        src="/discord_white.svg"
        alt="Discord logo"
        className="discord-logo"
      />
      &nbsp;&nbsp;Sign in with Discord
    </button>
  )
}

export default DiscordLoginButton
