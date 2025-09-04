import DiscordLoginButton from './login-discord-button'
import GoogleLoginButton from './login-google-button'
import LinkedInLoginButton from './login-linkedin-button'

const OAuthLoginPanel = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <DiscordLoginButton />
      {/* <LinkedInLoginButton /> */}
      {/* <GoogleLoginButton /> */}
    </div>
  )
}

export default OAuthLoginPanel
