/*
 * AuthContext — Gerenciamento de autenticação e perfil de usuário
 * Suporta modo de demonstração com 3 perfis: ADM, ANALISTA, CONTADOR
 * RF04 — Controle de acesso por perfil
 */

import React, { createContext, useContext, useState } from "react";

export type UserProfile = "ADM" | "ANALISTA" | "CONTADOR";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  perfil: UserProfile;
  empresa?: string;
  empresas: number;
  ultimoAcesso: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginDemo: (perfil: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const loginDemo = (perfil: UserProfile) => {
    const demoUsers: Record<UserProfile, AuthUser> = {
      ADM: {
        id: "adm-001",
        nome: "Samara Malta de Faria da Silva",
        email: "samara@propósito.com.br",
        perfil: "ADM",
        empresa: "Propósito Partners",
        empresas: 34,
        ultimoAcesso: "Agora",
      },
      ANALISTA: {
        id: "analyst-001",
        nome: "Tessália Pomocena Dos Santos",
        email: "tessalia@propósito.com.br",
        perfil: "ANALISTA",
        empresa: "Propósito Partners",
        empresas: 8,
        ultimoAcesso: "Agora",
      },
      CONTADOR: {
        id: "accountant-001",
        nome: "João da Silva Contador",
        email: "joao@escritorio.com.br",
        perfil: "CONTADOR",
        empresa: "Escritório de Contabilidade Silva",
        empresas: 3,
        ultimoAcesso: "Agora",
      },
    };

    setUser(demoUsers[perfil]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
