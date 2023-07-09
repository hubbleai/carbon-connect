import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ tokenUrl, userid, children, tokenFetcher }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await tokenFetcher();

      if (response.status === 200) {
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(true);
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
    fetchTokens,
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
