import { ConfigValue } from '@/config';
import Cookies from 'js-cookie';


export const AUTH_TOKEN_KEY = ConfigValue.AUTH_TOKEN_KEY;
export const AUTH_PERMISSIONS_KEY = ConfigValue.AUTH_PERMISSIONS_KEY;

export const getAuthToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const addPermission = (permission: string) => {
  const permissions = [...getAuthPermissions(), permission];
  Cookies.set(AUTH_PERMISSIONS_KEY, JSON.stringify(permissions), { expires: 1, secure: true, sameSite: 'Strict' });
}

export const getAuthPermissions = () => {
  if (typeof window === undefined) {
    return [];
  }
  let permissionsJson = Cookies.get(AUTH_PERMISSIONS_KEY)
  if(permissionsJson){
    return JSON.parse(permissionsJson)
  }
  return []
}

function shouldUseSecure(){
  const isDev = process.env.NODE_ENV === 'development';
  const secureFlag = !isDev;
  return secureFlag
}

export function setAuthToken(token: string, permissions: string []) {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 1, secure: shouldUseSecure(), sameSite: 'Strict' });
  Cookies.set(AUTH_PERMISSIONS_KEY, JSON.stringify(permissions), { expires: 1, secure: shouldUseSecure(), sameSite: 'Strict' });
}

export function removeAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY, { secure: shouldUseSecure(), sameSite: 'Strict' });
  Cookies.remove(AUTH_PERMISSIONS_KEY, { secure: shouldUseSecure(), sameSite: 'Strict' });
}

export function checkHasAuthToken() {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (!token) return false;
  return true;
}
