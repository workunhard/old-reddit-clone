import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  displayName: string | null;
  setDisplayName: (displayName: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [displayName, setDisplayName] = useState<string | null>(
    localStorage.getItem("displayName")
  );

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  useEffect(() => {
    if (displayName) {
      localStorage.setItem("displayName", displayName);
    } else {
      localStorage.removeItem("displayName");
    }
  }, [displayName]);

  return (
    <AuthContext.Provider
      value={{ authToken, setAuthToken, displayName, setDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
