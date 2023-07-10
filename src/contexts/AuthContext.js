import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children, tokenFetcher }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await tokenFetcher();

      setAccessToken(response.access_token);
      setLoading(false);
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
    setAccessToken,
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