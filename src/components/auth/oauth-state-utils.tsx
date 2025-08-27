import { v4 as uuidv4 } from 'uuid';

// Define an interface for the OAuth state and expiration data
interface OAuthStateData {
    state: string;        // The state string generated for OAuth
    expiration: number;   // The expiration timestamp (in milliseconds)
  }

// Generate OAuth state with expiration date and store it in localStorage
export const generateOauthState = (): string => {
  const state = uuidv4();  // Generate a new state string (UUID)

  // Set expiration time to 10 minutes (600,000 milliseconds)
  const expirationTime = Date.now() + 600000; // 600,000 ms = 10 minutes

  // Create an object to store the state and expiration timestamp
  const stateData: OAuthStateData = { state, expiration: expirationTime };
  localStorage.setItem('oauth_state', JSON.stringify(stateData));

  return state;
};


export const verifyOauthState = (state: string): boolean => {
    const storedData = localStorage.getItem('oauth_state');
    
    if (!storedData) {
      throw new Error('No stored state found');
    }
  
    const parsedData: OAuthStateData = JSON.parse(storedData);
  
    if (Date.now() > parsedData.expiration) {
      throw new Error('OAuth state has expired');
    }
  
    const urlParams = new URLSearchParams(window.location.search);
  
    if (!state) {
      throw new Error('State parameter is missing in the URL');
    }
  
    if (state !== parsedData.state) {
      throw new Error('State mismatch, possible CSRF attack');
    }
  
    localStorage.removeItem('oauth_state');
  
    return true;  // OAuth state is valid, proceed with the flow
};

export const removeState = () => {
    localStorage.removeItem('oauth_state');
}