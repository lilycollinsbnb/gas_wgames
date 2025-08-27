import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function useCookieConsent() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [isConsentSet, setIsConsentSet] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('ga_consent');
    if (consent) {
      setCookiesAccepted(consent === 'true');
      setIsConsentSet(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('ga_consent', 'true', { expires: 365 });
    setCookiesAccepted(true);
    setIsConsentSet(true);
  };

  const declineCookies = () => {
    Cookies.set('ga_consent', 'false', { expires: 7 });
    setCookiesAccepted(false);
    setIsConsentSet(true);
  };

  return { cookiesAccepted, isConsentSet, acceptCookies, declineCookies };
}

export default useCookieConsent;