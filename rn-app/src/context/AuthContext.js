import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [referenceFace, setReferenceFace] = useState(null); // { uri, bounds }

  const signIn = (userData) => setUser(userData);
  const signOut = () => { setUser(null); setReferenceFace(null); };
  const saveReferenceFace = (faceData) => setReferenceFace(faceData);
  const updateUser = (partial) => setUser(prev => ({ ...(prev || {}), ...partial }));

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, referenceFace, saveReferenceFace, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
