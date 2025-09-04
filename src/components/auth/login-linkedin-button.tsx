import { generateOauthState } from "./oauth-state-utils";


const LinkedInLoginButton = () => {
    const linkedInClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID ?? ''; // Your LinkedIn Client ID
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ?? ''); // Your redirect URI
    const scopes = encodeURIComponent('openid profile email'); // Permissions to request
    const state = encodeURIComponent(generateOauthState());
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${linkedInClientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;
  
    return (
      <button className="linkedin-login-btn w-full bg-linkedin-blue hover:bg-linkedin-darkblue text-white font-bold py-1 px-1 rounded justify-center"
      onClick={() => (window.location.href = linkedInAuthUrl)}
    >
      <div className="sig flex items-center ">
        <div className="ico-wrapper mr-2">
          <svg
            className="ico"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g fill="#FFFFFF">
                <g transform="translate(6, 5)">
                  <path
                    d="M3.44222222,0 C5.34,0 6.88,1.54111111 6.88,3.44 C6.88,5.34 5.34,6.88111111 3.44222222,6.88111111 C1.53666667,6.88111111 0,5.34 0,3.44 C0,1.54111111 1.53666667,0 3.44222222,0 Z M0.471111111,9.48888889 L6.41,9.48888889 L6.41,28.5777778 L0.471111111,28.5777778 L0.471111111,9.48888889 Z"
                    id="Fill-6"
                  ></path>
                  <path
                    d="M10,9.47333333 L15.6866667,9.47333333 L15.6866667,12.0833333 L15.7688889,12.0833333 C16.56,10.5822222 18.4955556,9 21.3811111,9 C27.3888889,9 28.4988889,12.9522222 28.4988889,18.0933333 L28.4988889,28.5622222 L22.5666667,28.5622222 L22.5666667,19.2788889 C22.5666667,17.0655556 22.5288889,14.2177778 19.4844444,14.2177778 C16.3966667,14.2177778 15.9255556,16.63 15.9255556,19.1211111 L15.9255556,28.5622222 L10,28.5622222 L10,9.47333333"
                    id="Fill-7"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
        Sign in with LinkedIn
      </div>
    </button>
    );
  };
  
  export default LinkedInLoginButton;
  