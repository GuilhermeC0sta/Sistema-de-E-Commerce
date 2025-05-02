import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; password: string; email: string; name: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check for stored user data on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await apiRequest("POST", "/api/users/login", {
        username,
        password
      });

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${userData.name}!`,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Falha ao fazer login",
        description: "Usuário ou senha inválidos. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { username: string; password: string; email: string; name: string }): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await apiRequest("POST", "/api/users/register", userData);

      const newUser = await response.json();
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      toast({
        title: "Registro bem-sucedido",
        description: `Bem-vindo ao ShopEasy, ${newUser.name}!`,
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Falha ao registrar",
        description: "Não foi possível criar sua conta. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logout bem-sucedido",
      description: "Você foi desconectado da sua conta.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
