/*
 * DESIGN: "Precision Finance" — Sidebar fixa navy + conteúdo em fundo gelo
 * Sidebar: 240px, dark navy (#0F1C2E), ícones + labels
 * Header: 56px, branco com breadcrumb e perfil de usuário
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import NotificationBell from "./NotificationBell";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileUp,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Empresas / Clientes", icon: Building2, href: "/empresas" },
  { label: "Upload de Documentos", icon: FileUp, href: "/upload", badge: "3" },
  { label: "Relatórios", icon: BarChart3, href: "/relatorios" },
  { label: "Usuários", icon: Users, href: "/usuarios" },
  { label: "Configurações", icon: Settings, href: "/configuracoes" },
];

import { AuthUser } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  breadcrumbs?: { label: string; href?: string }[];
  activeUser?: { name: string; role: "ADM" | "ANALISTA" | "CONTADOR" };
  userProfile?: AuthUser;
  onLogout?: () => void;
}

export default function AppLayout({
  children,
  pageTitle,
  breadcrumbs = [],
  activeUser,
  userProfile,
  onLogout,
}: AppLayoutProps) {
  const displayUser = userProfile ? { name: userProfile.nome, role: userProfile.perfil } : activeUser || { name: "Tessália Santos", role: "ADM" as const };
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleColors: Record<string, string> = {
    ADM: "badge-admin",
    ANALISTA: "badge-analyst",
    CONTADOR: "badge-accountant",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#0F1C2E" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: "#1A56DB" }}>
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">FinanceIA</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Propósito Partners</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="section-label px-2 mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            Menu Principal
          </div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer",
                        isActive
                          ? "text-white"
                          : "hover:text-white"
                      )}
                      style={{
                        backgroundColor: isActive ? "#1A56DB" : "transparent",
                        color: isActive ? "white" : "rgba(255,255,255,0.60)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLElement).style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)";
                        }
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: "#DC2626", color: "white", fontSize: "10px" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all"
            style={{ color: "rgba(255,255,255,0.70)" }}
            onClick={onLogout}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: "#1A56DB" }}
            >
              {displayUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{displayUser.name}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                {displayUser.role}
              </div>
            </div>
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href}>
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {crumb.label}
                    </span>
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: "#1A56DB" }}
              >
                {displayUser.name.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{displayUser.name.split(" ")[0]}</span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium hidden sm:block", roleColors[displayUser.role as keyof typeof roleColors])}>
                {displayUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F7F9FC" }}>
          <div className="px-4 lg:px-6 py-6">
            <h1 className="text-xl font-semibold text-foreground mb-6">{pageTitle}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
