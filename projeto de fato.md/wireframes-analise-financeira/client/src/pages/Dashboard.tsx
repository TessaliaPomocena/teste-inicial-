/*
 * TELA 2: Tela Principal do Fluxo — Dashboard
 * DESIGN: "Precision Finance" — KPIs + status de processos + gráficos + ações rápidas
 * RF04 - Controle de acesso por perfil (dados diferenciados)
 * RF20 - Status visual, RF21 - Barras de progresso, RF25/RF26 - Indicadores financeiros
 * RF10 - Busca e filtros, RF22 - Alertas automáticos
 */

import { useState } from "react";
import { useLocation } from "wouter";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ChevronRight,
  Building2,
  BarChart2,
  RefreshCw,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { cn } from "@/lib/utils";

// Data sets by profile
const dataByProfile = {
  ADM: {
    kpis: [
      {
        label: "Empresas Ativas",
        value: "34",
        sub: "+4 este mês",
        trend: "up",
        icon: Building2,
        color: "#1A56DB",
      },
      {
        label: "Documentos Processados",
        value: "127",
        sub: "Últimos 30 dias",
        trend: "up",
        icon: FileText,
        color: "#059669",
      },
      {
        label: "Pendentes de Envio",
        value: "12",
        sub: "3 com prazo vencido",
        trend: "down",
        icon: Clock,
        color: "#D97706",
      },
      {
        label: "Relatórios Gerados",
        value: "89",
        sub: "Mês atual: 18",
        trend: "up",
        icon: BarChart2,
        color: "#7C3AED",
      },
    ],
    processos: [
      { empresa: "Construtora Alpha Ltda", cnpj: "12.345.678/0001-90", periodo: "Fev/2026", status: "Concluído", progresso: 100, analista: "Tessália S.", docs: "3/3" },
      { empresa: "Comércio Beta S.A.", cnpj: "98.765.432/0001-10", periodo: "Fev/2026", status: "Em Processamento", progresso: 67, analista: "Alessandro W.", docs: "2/3" },
      { empresa: "Indústria Gamma ME", cnpj: "11.222.333/0001-44", periodo: "Fev/2026", status: "Pendente", progresso: 33, analista: "Samara M.", docs: "1/3" },
      { empresa: "Serviços Delta Eireli", cnpj: "55.666.777/0001-88", periodo: "Jan/2026", status: "Pendente", progresso: 0, analista: "Marlon P.", docs: "0/3" },
      { empresa: "Tech Epsilon Ltda", cnpj: "33.444.555/0001-22", periodo: "Fev/2026", status: "Concluído", progresso: 100, analista: "Gabriel R.", docs: "3/3" },
    ],
    alertas: [
      { tipo: "warning", msg: "Comércio Beta S.A. — DRE Fev/2026 pendente há 5 dias (RF22)", time: "2h atrás" },
      { tipo: "error", msg: "Indústria Gamma ME — Prazo de entrega vencido em 01/03 (RF22)", time: "1 dia atrás" },
      { tipo: "info", msg: "Construtora Alpha — Relatório gerado com sucesso (RF25)", time: "3h atrás" },
      { tipo: "warning", msg: "Serviços Delta — Nenhum documento enviado para Jan/2026 (RF20)", time: "2 dias atrás" },
    ],
  },
  ANALISTA: {
    kpis: [
      {
        label: "Minhas Empresas",
        value: "8",
        sub: "Atribuídas a mim",
        trend: "up",
        icon: Building2,
        color: "#1A56DB",
      },
      {
        label: "Documentos Processados",
        value: "34",
        sub: "Últimos 30 dias",
        trend: "up",
        icon: FileText,
        color: "#059669",
      },
      {
        label: "Pendentes de Análise",
        value: "5",
        sub: "Aguardando revisão",
        trend: "down",
        icon: Clock,
        color: "#D97706",
      },
      {
        label: "Relatórios Gerados",
        value: "12",
        sub: "Mês atual: 4",
        trend: "up",
        icon: BarChart2,
        color: "#7C3AED",
      },
    ],
    processos: [
      { empresa: "Construtora Alpha Ltda", cnpj: "12.345.678/0001-90", periodo: "Fev/2026", status: "Concluído", progresso: 100, analista: "Tessália S.", docs: "3/3" },
      { empresa: "Tech Epsilon Ltda", cnpj: "33.444.555/0001-22", periodo: "Fev/2026", status: "Em Processamento", progresso: 75, analista: "Tessália S.", docs: "2/3" },
      { empresa: "Saúde Eta Ltda", cnpj: "22.333.444/0001-55", periodo: "Fev/2026", status: "Pendente", progresso: 33, analista: "Tessália S.", docs: "1/3" },
    ],
    alertas: [
      { tipo: "warning", msg: "Tech Epsilon — Balancete Fev/2026 com baixa confiança OCR (62%)", time: "1h atrás" },
      { tipo: "info", msg: "Construtora Alpha — Análise concluída com sucesso", time: "4h atrás" },
      { tipo: "warning", msg: "Saúde Eta — Aguardando upload de DRE", time: "2 dias atrás" },
    ],
  },
  CONTADOR: {
    kpis: [
      {
        label: "Minhas Empresas",
        value: "3",
        sub: "Sob minha responsabilidade",
        trend: "up",
        icon: Building2,
        color: "#1A56DB",
      },
      {
        label: "Documentos Consultados",
        value: "18",
        sub: "Últimos 30 dias",
        trend: "up",
        icon: FileText,
        color: "#059669",
      },
      {
        label: "Relatórios Disponíveis",
        value: "6",
        sub: "Prontos para download",
        trend: "up",
        icon: BarChart2,
        color: "#7C3AED",
      },
      {
        label: "Acesso Restrito",
        value: "Leitura",
        sub: "Sem permissão de edição",
        trend: "up",
        icon: Clock,
        color: "#D97706",
      },
    ],
    processos: [
      { empresa: "Escritório Contabilidade Silva", cnpj: "44.555.666/0001-77", periodo: "Fev/2026", status: "Concluído", progresso: 100, analista: "João C.", docs: "3/3" },
      { empresa: "Consultoria Financeira Ltda", cnpj: "77.888.999/0001-33", periodo: "Fev/2026", status: "Concluído", progresso: 100, analista: "João C.", docs: "3/3" },
      { empresa: "Auditoria e Assessoria ME", cnpj: "33.444.555/0001-99", periodo: "Jan/2026", status: "Concluído", progresso: 100, analista: "João C.", docs: "3/3" },
    ],
    alertas: [
      { tipo: "info", msg: "Escritório Silva — Relatório Fev/2026 disponível para download", time: "2h atrás" },
      { tipo: "info", msg: "Consultoria Financeira — Análise concluída", time: "1 dia atrás" },
    ],
  },
};

const revenueData = [
  { mes: "Set", receita: 420, despesa: 310 },
  { mes: "Out", receita: 380, despesa: 290 },
  { mes: "Nov", receita: 510, despesa: 340 },
  { mes: "Dez", receita: 490, despesa: 320 },
  { mes: "Jan", receita: 560, despesa: 380 },
  { mes: "Fev", receita: 610, despesa: 410 },
];

const indicadoresData = [
  { mes: "Set", liquidez: 1.8, ebitda: 22 },
  { mes: "Out", liquidez: 1.6, ebitda: 19 },
  { mes: "Nov", liquidez: 2.1, ebitda: 25 },
  { mes: "Dez", liquidez: 1.9, ebitda: 23 },
  { mes: "Jan", liquidez: 2.3, ebitda: 28 },
  { mes: "Fev", liquidez: 2.5, ebitda: 31 },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  "Concluído": { label: "Concluído", className: "status-done" },
  "Em Processamento": { label: "Em Processamento", className: "status-processing" },
  "Pendente": { label: "Pendente", className: "status-pending" },
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { obterNotificacoesPorPerfil } = useNotifications();
  const [filter, setFilter] = useState("Todos");

  if (!user) {
    navigate("/login");
    return null;
  }

  const profileData = dataByProfile[user.perfil];
  const notificacoes = obterNotificacoesPorPerfil(user.perfil);
  const filtered = filter === "Todos" ? profileData.processos : profileData.processos.filter((p) => p.status === filter);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppLayout
      pageTitle={`Dashboard — ${user.perfil === "ADM" ? "Visão Geral" : user.perfil === "ANALISTA" ? "Minhas Análises" : "Consulta de Relatórios"}`}
      breadcrumbs={[{ label: "Dashboard" }]}
      userProfile={user}
      onLogout={handleLogout}
    >
      {/* Wireframe annotation */}
      <div className="wf-annotation mb-5 inline-block">
        Tela 2 — Fluxo Principal · RF04 (Perfil: {user.perfil}) · RF10 · RF20 · RF21 · RF22 · RF25 · RF26 · RF27
      </div>

      {/* User info banner */}
      <div
        className="mb-5 p-4 rounded-lg border flex items-center justify-between"
        style={{ backgroundColor: "#F0F9FF", borderColor: "#BFDBFE" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: "#1A56DB" }}
          >
            {user.nome.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{user.nome}</div>
            <div className="text-xs text-muted-foreground">
              Perfil: <span className="font-mono font-medium">{user.perfil}</span> · {user.empresas} empresa{user.empresas !== 1 ? "s" : ""} atribuída{user.empresas !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-white/50 transition-colors text-muted-foreground"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {profileData.kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="kpi-card">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${kpi.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" style={{ color: "#059669" }} />
                ) : (
                  <TrendingDown className="w-4 h-4" style={{ color: "#DC2626" }} />
                )}
              </div>
              <div className="font-mono text-2xl font-semibold text-foreground mb-0.5">
                {kpi.value}
              </div>
              <div className="text-xs font-medium text-foreground mb-0.5">{kpi.label}</div>
              <div className="text-xs text-muted-foreground">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Processos table — 2/3 width */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {user.perfil === "ADM" ? "Processos em Andamento" : user.perfil === "ANALISTA" ? "Minhas Análises" : "Relatórios Disponíveis"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">RF20 — Status visual por empresa</p>
            </div>
            <div className="flex items-center gap-2">
              {user.perfil !== "CONTADOR" && ["Todos", "Pendente", "Em Processamento", "Concluído"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-md font-medium transition-all",
                    filter === f
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  style={filter === f ? { backgroundColor: "#1A56DB" } : {}}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Empresa</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Período</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Progresso (RF21)</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Docs</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const sc = statusConfig[p.status];
                  return (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 table-row-hover cursor-pointer"
                      onClick={() => user.perfil !== "CONTADOR" && navigate("/upload")}
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground text-xs">{p.empresa}</div>
                        <div className="text-xs text-muted-foreground font-mono">{p.cnpj}</div>
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">{p.periodo}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", sc.className)}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <Progress value={p.progresso} className="h-1.5 flex-1" />
                          <span className="font-mono text-xs text-muted-foreground w-6">{p.progresso}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{p.docs}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <button className="p-1 rounded hover:bg-muted transition-colors">
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertas — 1/3 width */}

        {/* Alertas — 1/3 width */}
        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Alertas & Notificações</h2>
            <p className="text-xs text-muted-foreground mt-0.5">RF22 — Avisos automáticos por perfil</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notificacoes.length > 0 ? (
              notificacoes.map((notif) => {
                const bgColor = notif.tipo === "error"
                  ? "bg-red-50 text-red-700"
                  : notif.tipo === "warning"
                  ? "bg-amber-50 text-amber-700"
                  : notif.tipo === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-blue-50 text-blue-700";
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "px-5 py-3 border-b border-border last:border-0 text-xs leading-relaxed",
                      bgColor
                    )}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {notif.tipo === "error" && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                      {notif.tipo === "warning" && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                      {notif.tipo === "success" && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                      {notif.tipo === "info" && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-medium">{notif.titulo}</p>
                        <p className="mt-0.5">{notif.mensagem}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Nenhuma notificação no momento</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts — full width */}
      {/* Charts — full width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue chart */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Receita vs Despesa (RF26)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#F7F9FC", border: "1px solid #E5E7EB", borderRadius: "8px" }} />
              <Bar dataKey="receita" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Indicadores chart */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Indicadores Financeiros (RF25)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={indicadoresData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#F7F9FC", border: "1px solid #E5E7EB", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="liquidez" stroke="#1A56DB" strokeWidth={2} dot={{ fill: "#1A56DB", r: 4 }} />
              <Line type="monotone" dataKey="ebitda" stroke="#7C3AED" strokeWidth={2} dot={{ fill: "#7C3AED", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
