import type { ReactNode } from 'react';

import React, { useMemo, useState, useContext, createContext } from 'react';

interface AuthContextType {
  hasNewApplications: boolean;
  setHasNewApplications: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderNotification = ({ children }: { children: ReactNode }) => {
  const [hasNewApplications, setHasNewApplications] = useState<boolean>(false);

  // 🧠 Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ hasNewApplications, setHasNewApplications }),
    [hasNewApplications]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
