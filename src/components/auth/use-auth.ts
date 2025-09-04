import { atom, useAtom } from 'jotai';
import {
  checkHasAuthToken,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
  getAuthPermissions,
  addPermission
} from '@/data/client/token.utils';

const authorizationAtom = atom(checkHasAuthToken());
export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  return {
    setToken: setAuthToken,
    getToken: getAuthToken,
    addPermission: addPermission,
    getAuthPermissions: getAuthPermissions,
    isAuthorized,
    authorize(token: string, permissions: string []) {
      setAuthToken(token, permissions);
      setAuthorized(true);
    },
    unauthorize() {
      setAuthorized(false);
      removeAuthToken();
    },
  };
}
