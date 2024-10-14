import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userID, setUserID] = useState(null);

  return (
    <AuthContext.Provider value={{
      accessToken, setAccessToken,
      refreshToken, setRefreshToken,
      userID, setUserID,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;