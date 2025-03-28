
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "admin" | "user";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>("user");

  // Check if user is already authenticated from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("wildlifeAuth");
    if (storedAuth) {
      const { authenticated, role } = JSON.parse(storedAuth);
      setIsAuthenticated(authenticated);
      setUserRole(role as UserRole);
    }
  }, []);

  const login = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("wildlifeAuth", JSON.stringify({ authenticated: true, role }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole("user");
    localStorage.removeItem("wildlifeAuth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
