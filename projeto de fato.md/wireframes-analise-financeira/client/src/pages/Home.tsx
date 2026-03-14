/*
 * HOME: Página de apresentação dos wireframes
 * DESIGN: "Precision Finance" — Índice visual das telas do MVP
 * Apresenta o projeto, as 4 telas principais e links de navegação
 */

import { useLocation } from "wouter";
import { BarChart3, ArrowRight, FileText, LayoutDashboard, UserPlus, List, Upload, Shield, Cpu, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const telas = [
  {
    numero: "01",
    titulo: "Tela Inicial — Login",
    descricao: "Autenticação segura com e-mail e senha, aceite LGPD, recuperação de senha e acesso por perfil (ADM, ANALISTA, CONTADOR).",
    icon: Shield,
    href: "/login",
    requisitos: ["RF01", "RF02", "RF03", "RF04", "RF23", "RNF01"],
    cor: "#1A56DB",
  },
  {
    numero: "02",
    titulo: "Dashboard — Fluxo Principal",
    descricao: "Visão geral com KPIs, status de processos por empresa, alertas automáticos, gráficos de indicadores financeiros e ações rápidas.",
    icon: LayoutDashboard,
    href: "/dashboard",
    requisitos: ["RF10", "RF20", "RF21", "RF22", "RF25", "RF26", "RF27"],
    cor: "#059669",
  },
  {
    numero: "03",
    titulo: "Cadastro — Empresa e Usuário",
    descricao: "Formulário multi-step para registro de empresas (CNPJ, segmento, responsável técnico, analista vinculado) e criação de usuários com perfis de acesso.",
    icon: UserPlus,
    href: "/cadastro",
    requisitos: ["RF01", "RF04", "RF06", "RF07", "RF11", "RF23", "RF28"],
    cor: "#7C3AED",
  },
  {
    numero: "04",
    titulo: "Listagem — Consulta e Gestão",
    descricao: "Tabelas com filtros, busca, paginação e ações contextuais para Empresas, Documentos, Relatórios e Usuários. Histórico de auditoria completo.",
    icon: List,
    href: "/empresas",
    requisitos: ["RF05", "RF08", "RF09", "RF10", "RF18", "RF30", "RF31"],
    cor: "#D97706",
  },
  {
    numero: "05",
    titulo: "Upload e Processamento OCR",
    descricao: "Drag & drop de documentos financeiros com processamento OCR assíncrono, score de confiança por campo e revisão humana para dados com baixa precisão.",
    icon: Upload,
    href: "/upload",
    requisitos: ["RF12", "RF13", "RF14", "RF15", "RF16", "RF17", "RF18", "RF19"],
    cor: "#DC2626",
  },
];

const stats = [
  { label: "Telas do MVP", value: "5" },
  { label: "Requisitos Funcionais", value: "35" },
  { label: "Requisitos Não Funcionais", value: "26" },
  { label: "Perfis de Acesso", value: "3" },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FC" }}>
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0F1C2E" }}>
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">FinanceIA — Wireframes MVP</div>
              <div className="text-xs text-muted-foreground">Propósito Partners · Grupo 2 · TIC 55</div>
            </div>
          </div>
          <Button
            size="sm"
            style={{ backgroundColor: "#1A56DB" }}
            onClick={() => navigate("/login")}
          >
            Acessar Sistema
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0F1C2E" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663410722340/WQtpETfEPXRPhmUBms2Ywx/hero-finance-bg-Ld6DFM6Not69sTSpKCvery.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: "rgba(26,86,219,0.25)", color: "#93C5FD", border: "1px solid rgba(26,86,219,0.4)" }}
            >
              <Cpu className="w-3.5 h-3.5" />
              Wireframes de Alta Fidelidade — MVP
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Sistema de Análise Financeira<br />
              <span style={{ color: "#3B82F6" }}>com Inteligência Artificial</span>
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              Protótipo interativo das telas do MVP desenvolvido pelo Grupo 2 do Projeto TIC 55 (Brisa/Fulbra)
              para a empresa parceira <strong style={{ color: "rgba(255,255,255,0.85)" }}>Propósito Partners</strong>.
              O sistema automatiza a extração e análise de documentos financeiros via OCR.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-mono text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="gap-2"
                style={{ backgroundColor: "#1A56DB" }}
                onClick={() => navigate("/login")}
              >
                Explorar Wireframes
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4" />
                Ver Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Telas grid */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-8">
          <div className="section-label">Telas do MVP</div>
          <h2 className="text-2xl font-semibold text-foreground">Protótipos Interativos</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Cada tela é navegável e contém dados representativos, anotações de requisitos e interações funcionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {telas.map((tela) => {
            const Icon = tela.icon;
            return (
              <div
                key={tela.numero}
                className="bg-white rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(tela.href)}
              >
                {/* Color bar */}
                <div className="h-1" style={{ backgroundColor: tela.cor }} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${tela.cor}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: tela.cor }} />
                    </div>
                    <span
                      className="font-mono text-xs font-semibold px-2 py-1 rounded"
                      style={{ backgroundColor: `${tela.cor}10`, color: tela.cor }}
                    >
                      Tela {tela.numero}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground text-sm mb-2">{tela.titulo}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tela.descricao}</p>

                  {/* Requisitos */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tela.requisitos.map((r) => (
                      <span
                        key={r}
                        className="text-xs px-1.5 py-0.5 rounded font-mono"
                        style={{ backgroundColor: `${tela.cor}10`, color: tela.cor, border: `1px solid ${tela.cor}25` }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>

                  <button
                    className="flex items-center gap-1.5 text-xs font-medium transition-all group-hover:gap-2"
                    style={{ color: tela.cor }}
                  >
                    Abrir tela
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team section */}
      <section className="border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="section-label mb-4">Equipe</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { nome: "Alessandro Werner Bucker", papel: "Frontend / Testes" },
              { nome: "Gabriel Rodrigo M. Duglokinski", papel: "Backend / BD" },
              { nome: "Marlon Pires Mendes", papel: "Backend / Requisitos" },
              { nome: "Samara Malta de Faria da Silva", papel: "Backend / PO / OCR" },
              { nome: "Tessália Pomocena Dos Santos", papel: "Frontend / UX/UI" },
            ].map((m) => (
              <div key={m.nome} className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-2"
                  style={{ backgroundColor: "#0F1C2E" }}
                >
                  {m.nome.charAt(0)}
                </div>
                <div className="text-xs font-medium text-foreground leading-tight">{m.nome.split(" ").slice(0, 2).join(" ")}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.papel}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Projeto TIC 55 — Brisa / Fulbra · Orientadora: Caroline Pacheco da Rosa</span>
            <span>Período: Fevereiro a Julho de 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
}
