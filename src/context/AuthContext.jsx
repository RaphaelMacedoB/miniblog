import { useContext, createContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children, value }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthValue = () => {
  const user = useContext(AuthContext);
  return user;
};
