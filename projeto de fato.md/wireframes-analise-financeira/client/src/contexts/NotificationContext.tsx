/*
 * CONTEXTO: NotificationContext
 * Gerencia notificações diferenciadas por perfil (ADM, ANALISTA, CONTADOR)
 * RF22 - Alertas automáticos com filtro por perfil
 */

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { UserProfile } from "./AuthContext";

export interface Notification {
  id: string;
  tipo: "error" | "warning" | "info" | "success";
  titulo: string;
  mensagem: string;
  timestamp: Date;
  lido: boolean;
  perfisAplicaveis: UserProfile[];
  acao?: {
    label: string;
    href?: string;
  };
}

interface NotificationContextType {
  notificacoes: Notification[];
  notificacoesNaoLidas: Notification[];
  adicionarNotificacao: (notif: Omit<Notification, "id" | "timestamp" | "lido">) => void;
  marcarComoLida: (id: string) => void;
  removerNotificacao: (id: string) => void;
  limparTodas: () => void;
  obterNotificacoesPorPerfil: (perfil: UserProfile) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Dados de notificações pré-carregadas por perfil
const notificacoesIniciais: Notification[] = [
  {
    id: "notif-adm-1",
    tipo: "warning",
    titulo: "Prazo Vencido",
    mensagem: "Indústria Gamma ME — Prazo de entrega vencido em 01/03 (RF22)",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["ADM"],
    acao: { label: "Ver empresa", href: "/empresas" },
  },
  {
    id: "notif-adm-2",
    tipo: "warning",
    titulo: "Documento Pendente",
    mensagem: "Comércio Beta S.A. — DRE Fev/2026 pendente há 5 dias",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["ADM"],
    acao: { label: "Revisar", href: "/upload" },
  },
  {
    id: "notif-adm-3",
    tipo: "info",
    titulo: "Relatório Gerado",
    mensagem: "Construtora Alpha — Relatório Fev/2026 gerado com sucesso",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["ADM"],
    acao: { label: "Download", href: "/relatorios" },
  },
  {
    id: "notif-adm-4",
    tipo: "warning",
    titulo: "Nenhum Documento Enviado",
    mensagem: "Serviços Delta — Nenhum documento enviado para Jan/2026",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lido: true,
    perfisAplicaveis: ["ADM"],
  },
  {
    id: "notif-analista-1",
    tipo: "warning",
    titulo: "Baixa Confiança OCR",
    mensagem: "Tech Epsilon — Balancete Fev/2026 com confiança OCR de 62%",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["ANALISTA"],
    acao: { label: "Revisar", href: "/upload" },
  },
  {
    id: "notif-analista-2",
    tipo: "success",
    titulo: "Análise Concluída",
    mensagem: "Construtora Alpha Ltda — Análise de Fev/2026 concluída com sucesso",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["ANALISTA"],
    acao: { label: "Ver relatório", href: "/relatorios" },
  },
  {
    id: "notif-analista-3",
    tipo: "warning",
    titulo: "Aguardando Upload",
    mensagem: "Saúde Eta Ltda — Aguardando upload de DRE para análise",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lido: true,
    perfisAplicaveis: ["ANALISTA"],
  },
  {
    id: "notif-contador-1",
    tipo: "info",
    titulo: "Relatório Disponível",
    mensagem: "Escritório Contabilidade Silva — Relatório Fev/2026 disponível para download",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["CONTADOR"],
    acao: { label: "Download", href: "/relatorios" },
  },
  {
    id: "notif-contador-2",
    tipo: "info",
    titulo: "Análise Concluída",
    mensagem: "Consultoria Financeira Ltda — Análise Fev/2026 concluída",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lido: true,
    perfisAplicaveis: ["CONTADOR"],
    acao: { label: "Consultar", href: "/relatorios" },
  },
  {
    id: "notif-todos-1",
    tipo: "info",
    titulo: "Manutenção Programada",
    mensagem: "Sistema em manutenção programada no próximo domingo às 22h",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    lido: false,
    perfisAplicaveis: ["ADM", "ANALISTA", "CONTADOR"],
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notification[]>(notificacoesIniciais);

  const adicionarNotificacao = useCallback(
    (notif: Omit<Notification, "id" | "timestamp" | "lido">) => {
      const novaNotif: Notification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        lido: false,
      };
      setNotificacoes((prev) => [novaNotif, ...prev]);
    },
    []
  );

  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lido: true } : n))
    );
  }, []);

  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const limparTodas = useCallback(() => {
    setNotificacoes([]);
  }, []);

  const obterNotificacoesPorPerfil = useCallback(
    (perfil: UserProfile) => {
      return notificacoes.filter((n) => n.perfisAplicaveis.includes(perfil));
    },
    [notificacoes]
  );

  const notificacoesNaoLidas = useMemo(
    () => notificacoes.filter((n) => !n.lido),
    [notificacoes]
  );

  const value: NotificationContextType = {
    notificacoes,
    notificacoesNaoLidas,
    adicionarNotificacao,
    marcarComoLida,
    removerNotificacao,
    limparTodas,
    obterNotificacoesPorPerfil,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications deve ser usado dentro de NotificationProvider");
  }
  return context;
}
