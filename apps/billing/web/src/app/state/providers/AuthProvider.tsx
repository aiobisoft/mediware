import { IUser } from '@billinglib';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Login from '../../pages/auth/Login';
import { HttpClient } from '../../utils/common';
import { useAlert } from './AlertProvider';

interface Props {
  children?: ReactNode | ReactNode[];
}

const AuthProvider = ({ children }: Props) => {
  const [activeUser, setActiveUser] = useState<IUser>();
  const { setAlert } = useAlert();

  const isLoggedIn = useMemo((): boolean => {
    if (activeUser && (activeUser?.username || activeUser.email)) {
      return true;
    }
    return false;
  }, [activeUser]);

  const loginUser = useCallback(
    async (userInfo: IUser) => {
      const loginResponse = (await HttpClient().post('/user/login', userInfo))
        .data;

      console.log(loginResponse);
      if (loginResponse?.message && setAlert) {
        setAlert({
          error: 'Error',
          message: loginResponse.message,
          shown: true,
        });
      } else {
        // TODO: save JWT that api will send
        setActiveUser(loginResponse);
      }
    },
    [activeUser]
  );

  const logoutUser = useCallback(async () => {}, [activeUser]);

  useEffect(() => {
    // TODO: login if session is intact
  }, [activeUser]);

  return (
    <AuthContext.Provider
      value={{ activeUser, setActiveUser, loginUser, logoutUser }}
    >
      {isLoggedIn ? children : <Login />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
