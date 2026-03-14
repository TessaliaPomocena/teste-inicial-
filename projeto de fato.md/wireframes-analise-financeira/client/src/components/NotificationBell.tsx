/*
 * COMPONENTE: NotificationBell
 * Sino de notificações com dropdown mostrando alertas por perfil
 * RF22 - Alertas automáticos diferenciados
 */

import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, Trash2, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const { user } = useAuth();
  const { obterNotificacoesPorPerfil, marcarComoLida, removerNotificacao, notificacoesNaoLidas } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const notificacoes = obterNotificacoesPorPerfil(user.perfil);
  const naoLidas = notificacoes.filter((n) => !n.lido);
  const lidas = notificacoes.filter((n) => n.lido);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBgByTipo = (tipo: string) => {
    switch (tipo) {
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      case "success":
        return "bg-emerald-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  const formatarTempo = (data: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return "Agora";
    if (minutos < 60) return `${minutos}m atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-muted transition-colors"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        {naoLidas.length > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#DC2626" }}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-96 rounded-lg border border-border bg-white shadow-lg z-50 max-h-[500px] flex flex-col overflow-hidden"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {naoLidas.length} não lida{naoLidas.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Notificações não lidas */}
          <div className="flex-1 overflow-y-auto">
            {naoLidas.length > 0 ? (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30">
                  Novas
                </div>
                {naoLidas.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn("px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors", getBgByTipo(notif.tipo))}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIconByTipo(notif.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{notif.titulo}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {notif.mensagem}
                            </p>
                          </div>
                          <button
                            onClick={() => removerNotificacao(notif.id)}
                            className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{formatarTempo(notif.timestamp)}</span>
                          {notif.acao && (
                            <button
                              onClick={() => {
                                marcarComoLida(notif.id);
                                setIsOpen(false);
                              }}
                              className="text-xs font-medium px-2 py-1 rounded transition-colors"
                              style={{ color: "#1A56DB", backgroundColor: "rgba(26, 86, 219, 0.1)" }}
                            >
                              {notif.acao.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Notificações lidas */}
            {lidas.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30">
                  Anteriores
                </div>
                {lidas.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIconByTipo(notif.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{notif.titulo}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {notif.mensagem}
                            </p>
                          </div>
                          <button
                            onClick={() => removerNotificacao(notif.id)}
                            className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2 block">{formatarTempo(notif.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {notificacoes.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notificacoes.length > 0 && (
            <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
              <button
                onClick={() => {
                  naoLidas.forEach((n) => marcarComoLida(n.id));
                }}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Marcar tudo como lido
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
