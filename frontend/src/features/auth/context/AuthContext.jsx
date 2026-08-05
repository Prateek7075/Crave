import {createContext, useCallback, useEffect, useMemo, useState,} from 'react';
import {getCurrentCustomer, logoutCustomer,} from '../api/customerAuth.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function mapCustomerResponse(responseData) {
  if (!responseData || typeof responseData !== 'object' || !responseData.account || !responseData.customerProfile) {
    throw new Error('The server returned invalid customer data.',);
  }

  const {account, customerProfile,} = responseData;

  if (typeof account.role !== 'string' || typeof customerProfile.fullName !== 'string') {
    throw new Error('The server returned incomplete customer data.',);
  }

  /*
   * The top-level fields keep existing components working
   * while account and customerProfile preserve the new API shape.
   */
  return {
    id: account.id,
    username: customerProfile.fullName,
    role: account.role,
    mobile: account.mobile,
    account,
    customerProfile,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [status, setStatus] = useState('loading',);

  const [initializationError, setInitializationError] = useState(null);

  const login = useCallback((responseData) => {
    const authenticatedUser = mapCustomerResponse(responseData);
    setUser(authenticatedUser);
    setInitializationError(null);
    setStatus('authenticated');

    return authenticatedUser;
  }, []);

  const clearAuthentication = useCallback(() => {
    setUser(null);
    setInitializationError(null);
    setStatus('guest');
  }, []);

  const refreshAuthentication =
      useCallback(async () => {setStatus('loading');setInitializationError(null);

        try {
          const responseData = await getCurrentCustomer();
          return login(responseData);
        } catch (error) {
          if (error.code === 'UNAUTHENTICATED') {
            clearAuthentication();
            return null;
          }
          setUser(null);
          setInitializationError(error);
          setStatus('error');

          throw error;
        }
      }, [clearAuthentication, login,]);

  const logout = useCallback(async () => {
    try {
      await logoutCustomer();
      clearAuthentication();
    } catch (error) {
      /*
       * The backend may say unauthenticated when the
       * session already expired. The frontend should
       * still become a guest in that case.
       */
      if (error.code === 'UNAUTHENTICATED') {
        clearAuthentication();
        return;
      }
      throw error;
    }
  }, [clearAuthentication]);

  useEffect(() => {
    let isActive = true;

    /*
     * Cleanup values left by the old bearer-token
     * authentication implementation.
     */
    localStorage.removeItem('crave_token');
    localStorage.removeItem('crave_user');

    async function initializeAuthentication() {
      try {
        const responseData = await getCurrentCustomer();

        if (!isActive) {
          return;
        }

        login(responseData);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error.code === 'UNAUTHENTICATED') {
          clearAuthentication();

          return;
        }

        setUser(null);
        setInitializationError(error);
        setStatus('error');
      }
    }

    initializeAuthentication();

    return () => {
      isActive = false;
    };
  }, [clearAuthentication, login,]);

  const value = useMemo(
      () => ({
        user,
        status,
        initializationError,

        isLoading: status === 'loading',

        isAuthenticated: status === 'authenticated',

        isGuest: status === 'guest',

        login,
        logout,
        clearAuthentication,
        refreshAuthentication,
      }),
      [user, status, initializationError, login, logout, clearAuthentication, refreshAuthentication,],
  );

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};