const GoogleLoginButton = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? '');
    const scopes = encodeURIComponent('openid email profile');
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&access_type=offline`;
  
    return (
      <button
        className="google-login-btn flex items-center justify-center w-full h-12 mt-5 border border-gray-300 rounded-md"
        onClick={() => window.location.href = googleAuthUrl} 
      >
        <img src="/google-g-logo.svg" alt="Google logo" className="google-logo w-6 h-6 mr-2" />
        Login with Google
      </button>
    );
  };
  
  export default GoogleLoginButton;
  