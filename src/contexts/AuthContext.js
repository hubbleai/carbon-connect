import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ tokenUrl, userid, children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  // const createApiClient = async (access_token, refresh_token) => {
  //   const client = axios.create();

  //   client.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       console.log('01', error.response.status, error.config, error);
  //       const originalRequest = error.config;

  //       if (error.response.status === 401 && !originalRequest._retry) {
  //         console.log('01');
  //         originalRequest._retry = true;
  //         const refreshResponse = await axios.get(
  //           `${BASE_URL[environment]}/auth/v1/refresh_access_token`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${refresh_token}`,
  //             },
  //           }
  //         );
  //         if (refreshResponse.status === 200) {
  //           console.log('01');
  //           setAccessToken(refreshResponse.data.access_token);
  //           originalRequest.headers['Authorization'] =
  //             'Bearer ' + refreshResponse.data.access_token;
  //           return client(originalRequest);
  //         } else if (refreshResponse.status === 401) {
  //           console.log('01');
  //           fetchTokens();
  //         }
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return client;
  // };

  const fetchTokens = async (callbackMethod) => {
    try {
      const response = await axios.get(tokenUrl, {
        params: { customer_id: userid },
      });

      if (response.status === 200) {
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        if (typeof callbackMethod === 'function') {
          callbackMethod();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tokens when component first loads
  useEffect(() => {
    fetchTokens();
  }, []);

  const contextValues = {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCarbonAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCarbonAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
