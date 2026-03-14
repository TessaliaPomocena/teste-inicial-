/*
 * TELA 1: Tela Inicial (Login)
 * DESIGN: "Precision Finance" — Split layout: imagem escura à esquerda, formulário branco à direita
 * RF01 - Cadastro de Usuários, RF03 - Recuperação de Senha, RNF01 - Bloqueio após 5 tentativas
 * RF04 - Controle de acesso por perfil com modo demo interativo
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, BarChart3, Lock, Mail, AlertCircle, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, type UserProfile } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Login() {
  const [, navigate] = useLocation();
  const { loginDemo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lgpdAccepted) {
      setError("Você precisa aceitar os Termos de Uso e Política de Privacidade (LGPD) para continuar.");
      return;
    }
    if (attempts >= 4) {
      setError("Conta temporariamente bloqueada após 5 tentativas inválidas. (RNF01)");
      return;
    }
    // Simulate login — any credentials go to dashboard
    if (email && password) {
      navigate("/dashboard");
    } else {
      setAttempts((a) => a + 1);
      setError(`E-mail ou senha inválidos. Tentativa ${attempts + 1}/5. (RF01)`);
    }
  };

  const handleDemoLogin = (perfil: UserProfile) => {
    loginDemo(perfil);
    navigate("/dashboard");
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  const demoProfiles = [
    {
      perfil: "ADM" as UserProfile,
      nome: "Samara Malta",
      descricao: "Acesso total · 34 empresas",
      cor: "badge-admin",
      icon: "👤",
    },
    {
      perfil: "ANALISTA" as UserProfile,
      nome: "Tessália Santos",
      descricao: "Análise de dados · 8 empresas",
      cor: "badge-analyst",
      icon: "📊",
    },
    {
      perfil: "CONTADOR" as UserProfile,
      nome: "João Contador",
      descricao: "Consulta · 3 empresas",
      cor: "badge-accountant",
      icon: "📋",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark navy with background image */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 overflow-hidden"
        style={{ backgroundColor: "#0F1C2E" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663410722340/WQtpETfEPXRPhmUBms2Ywx/hero-finance-bg-Ld6DFM6Not69sTSpKCvery.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,28,46,0.85) 0%, rgba(26,86,219,0.15) 100%)" }} />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1A56DB" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg leading-tight">FinanceIA</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>Propósito Partners</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Análise Financeira<br />
            <span style={{ color: "#3B82F6" }}>Automatizada com IA</span>
          </h1>
          <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            Extraia, analise e gere relatórios financeiros de forma automática.
            Reduza o tempo de análise de 2 dias para poucas horas.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: "📄", text: "Upload de DRE, Balanço e Balancete" },
              { icon: "🔍", text: "Extração automática via OCR" },
              { icon: "📊", text: "Indicadores financeiros calculados automaticamente" },
              { icon: "📋", text: "Relatórios em PDF com governança" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <div className="relative z-10 flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: "rgba(255,255,255,0.40)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
            Dados protegidos conforme LGPD — TLS + criptografia em repouso (RNF03/RNF04)
          </span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1A56DB" }}>
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-foreground">FinanceIA</div>
              <div className="text-xs text-muted-foreground">Propósito Partners</div>
            </div>
          </div>

          {!showForgot ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-1">Entrar na plataforma</h2>
                <p className="text-sm text-muted-foreground">Use seu e-mail e senha cadastrados</p>
              </div>

              {/* Wireframe annotation */}
              <div className="wf-annotation mb-4 text-center">
                RF01 · RF02 · RF03 · RF04 · RNF01 · RF23 (LGPD)
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com.br"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <button
                      type="button"
                      className="text-xs font-medium transition-colors"
                      style={{ color: "#1A56DB" }}
                      onClick={() => setShowForgot(true)}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* LGPD consent — RF23 */}
                <div className="flex items-start gap-2.5 p-3 rounded-md bg-blue-50 border border-blue-100">
                  <Checkbox
                    id="lgpd"
                    checked={lgpdAccepted}
                    onCheckedChange={(v) => setLgpdAccepted(!!v)}
                    className="mt-0.5"
                  />
                  <label htmlFor="lgpd" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    Li e aceito os{" "}
                    <span className="font-medium" style={{ color: "#1A56DB" }}>
                      Termos de Uso e Política de Privacidade
                    </span>
                    , autorizando o tratamento dos meus dados conforme a{" "}
                    <span className="font-medium">LGPD</span>. (RF23)
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full font-medium"
                  style={{ backgroundColor: "#1A56DB" }}
                >
                  Entrar
                </Button>
              </form>

              {/* Attempt counter */}
              {attempts > 0 && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  {5 - attempts} tentativa{5 - attempts !== 1 ? "s" : ""} restante{5 - attempts !== 1 ? "s" : ""} antes do bloqueio
                </p>
              )}

              {/* Demo access — RF04 */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
                  <p className="text-xs font-semibold text-muted-foreground">Modo Demonstração (RF04)</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Clique em um perfil para simular o acesso com dados diferenciados:</p>
                <div className="grid grid-cols-1 gap-2">
                  {demoProfiles.map((profile) => (
                    <button
                      key={profile.perfil}
                      onClick={() => handleDemoLogin(profile.perfil)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-left hover:shadow-md",
                        profile.cor
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{profile.perfil}</div>
                          <div className="text-xs mt-0.5 opacity-75">{profile.nome}</div>
                          <div className="text-xs mt-1 opacity-60">{profile.descricao}</div>
                        </div>
                        <span className="text-lg">{profile.icon}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Forgot password flow — RF03 */
            <>
              <div className="mb-8">
                <button
                  className="text-sm font-medium mb-4 flex items-center gap-1 transition-colors"
                  style={{ color: "#1A56DB" }}
                  onClick={() => { setShowForgot(false); setForgotSent(false); }}
                >
                  ← Voltar ao login
                </button>
                <h2 className="text-2xl font-semibold text-foreground mb-1">Recuperar senha</h2>
                <p className="text-sm text-muted-foreground">Informe seu e-mail para receber instruções de recuperação</p>
              </div>

              {forgotSent ? (
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#ECFDF5" }}
                  >
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">E-mail enviado!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { setShowForgot(false); setForgotSent(false); }}
                  >
                    Voltar ao login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="forgot-email" className="text-sm font-medium">
                      E-mail cadastrado
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="seu@email.com.br"
                        className="pl-9"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-medium"
                    style={{ backgroundColor: "#1A56DB" }}
                  >
                    Enviar instruções
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
