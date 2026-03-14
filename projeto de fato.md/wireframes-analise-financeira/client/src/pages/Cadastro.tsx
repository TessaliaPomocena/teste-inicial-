/*
 * TELA 3: Tela de Cadastro / Registro
 * DESIGN: "Precision Finance" — Formulário multi-step com validação e feedback
 * RF01 - Cadastro de Usuários, RF06 - Registro de Empresa, RF04 - Hierarquia de Perfis
 * RF07 - Vinculação Analista-Empresa, RF11 - Responsável Técnico, RF23 - LGPD
 * Tabs: Cadastro de Empresa | Cadastro de Usuário
 */

import { useState } from "react";
import { useLocation } from "wouter";
import {
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

// Multi-step form for company registration
const empresaSteps = [
  { id: 1, label: "Dados da Empresa" },
  { id: 2, label: "Responsável Técnico" },
  { id: 3, label: "Configurações" },
  { id: 4, label: "Confirmação" },
];

// Multi-step form for user registration
const usuarioSteps = [
  { id: 1, label: "Dados Pessoais" },
  { id: 2, label: "Acesso e Perfil" },
  { id: 3, label: "Confirmação" },
];

function StepIndicator({ steps, current }: { steps: { id: number; label: string }[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                step.id < current
                  ? "text-white"
                  : step.id === current
                  ? "text-white"
                  : "bg-muted text-muted-foreground"
              )}
              style={
                step.id < current
                  ? { backgroundColor: "#059669" }
                  : step.id === current
                  ? { backgroundColor: "#1A56DB" }
                  : {}
              }
            >
              {step.id < current ? <CheckCircle2 className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={cn(
                "text-xs mt-1 font-medium hidden sm:block text-center",
                step.id === current ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-0.5 flex-1 mx-2 transition-all"
              style={{ backgroundColor: step.id < current ? "#059669" : "#E5E7EB" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function EmpresaForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    razaoSocial: "",
    cnpj: "",
    segmento: "",
    nomeResponsavel: "",
    cpfResponsavel: "",
    emailResponsavel: "",
    analista: "",
    fechamento: "manual",
    lgpd: false,
  });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#059669" }}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Empresa cadastrada com sucesso!</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          <strong>{form.razaoSocial || "Nova Empresa"}</strong> foi registrada no sistema.
          O analista vinculado receberá uma notificação.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); }}>
            Cadastrar outra empresa
          </Button>
          <Button style={{ backgroundColor: "#1A56DB" }} onClick={() => navigate("/empresas")}>
            Ver lista de empresas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={empresaSteps} current={step} />

      {step === 1 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF06 — Dados obrigatórios: Razão Social, CNPJ, Segmento</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Razão Social <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Ex.: Construtora Alpha Ltda"
                value={form.razaoSocial}
                onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>CNPJ <span className="text-red-500">*</span></Label>
              <Input
                placeholder="00.000.000/0001-00"
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">RF02 — CNPJ deve ser único no sistema</p>
            </div>

            <div className="space-y-1.5">
              <Label>Segmento de Atuação <span className="text-red-500">*</span></Label>
              <Select value={form.segmento} onValueChange={(v) => setForm({ ...form, segmento: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comercio">Comércio</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="construcao">Construção Civil</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="agronegocio">Agronegócio</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              RF09 — Ao inativar uma empresa, documentos e relatórios são preservados para consulta futura.
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF11 — Responsável Técnico: pessoa física que responde pela empresa</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Nome Completo do Responsável <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Ex.: João da Silva"
                value={form.nomeResponsavel}
                onChange={(e) => setForm({ ...form, nomeResponsavel: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>CPF do Responsável <span className="text-red-500">*</span></Label>
              <Input
                placeholder="000.000.000-00"
                value={form.cpfResponsavel}
                onChange={(e) => setForm({ ...form, cpfResponsavel: e.target.value })}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label>E-mail do Responsável <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                placeholder="responsavel@empresa.com.br"
                value={form.emailResponsavel}
                onChange={(e) => setForm({ ...form, emailResponsavel: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label>Analista Responsável <span className="text-red-500">*</span></Label>
              <Select value={form.analista} onValueChange={(v) => setForm({ ...form, analista: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Vincular analista interno (RF07)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tessalia">Tessália Santos (ANALISTA)</SelectItem>
                  <SelectItem value="alessandro">Alessandro Bucker (ANALISTA)</SelectItem>
                  <SelectItem value="samara">Samara Malta (ANALISTA)</SelectItem>
                  <SelectItem value="marlon">Marlon Mendes (ANALISTA)</SelectItem>
                  <SelectItem value="gabriel">Gabriel Duglokinski (ANALISTA)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">RF07 — O analista visualizará apenas as empresas sob sua responsabilidade</p>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF28 · RF33 · RF35 — Configurações de fechamento e período contábil</div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Tipo de Fechamento de Período (RF28)</Label>
              <div className="grid grid-cols-2 gap-3">
                {["manual", "automatico"].map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setForm({ ...form, fechamento: tipo })}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all",
                      form.fechamento === tipo
                        ? "border-blue-500 bg-blue-50"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <div className="font-medium text-sm capitalize mb-1">{tipo === "manual" ? "Manual" : "Automático"}</div>
                    <div className="text-xs text-muted-foreground">
                      {tipo === "manual"
                        ? "O analista define quando fechar cada período"
                        : "O sistema fecha automaticamente na data configurada"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Documentos Obrigatórios por Período</Label>
              <div className="space-y-2">
                {["DRE (Demonstração de Resultado do Exercício)", "Balanço Patrimonial", "Balancete de Verificação"].map((doc) => (
                  <div key={doc} className="flex items-center gap-2.5 p-3 rounded-md bg-muted/30 border border-border">
                    <Checkbox defaultChecked />
                    <span className="text-sm">{doc}</span>
                    <span className="ml-auto text-xs text-muted-foreground">RF12</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF23 — Aceite LGPD obrigatório antes de salvar</div>

          {/* Summary */}
          <div className="bg-muted/30 rounded-lg border border-border p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Resumo do Cadastro</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Razão Social", form.razaoSocial || "—"],
                ["CNPJ", form.cnpj || "—"],
                ["Segmento", form.segmento || "—"],
                ["Responsável", form.nomeResponsavel || "—"],
                ["E-mail Resp.", form.emailResponsavel || "—"],
                ["Analista", form.analista || "—"],
                ["Fechamento", form.fechamento === "manual" ? "Manual" : "Automático"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="font-medium text-foreground font-mono text-xs">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LGPD consent */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Checkbox
              id="lgpd-empresa"
              checked={form.lgpd}
              onCheckedChange={(v) => setForm({ ...form, lgpd: !!v })}
              className="mt-0.5"
            />
            <label htmlFor="lgpd-empresa" className="text-sm text-blue-800 leading-relaxed cursor-pointer">
              Confirmo que obtive o consentimento formal do responsável pela empresa para o tratamento
              dos dados cadastrais conforme a <strong>LGPD (Lei 13.709/2018)</strong>. O registro
              de consentimento será armazenado no sistema. (RF23)
            </label>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <span className="text-xs text-muted-foreground">
          Etapa {step} de {empresaSteps.length}
        </span>

        {step < empresaSteps.length ? (
          <Button
            className="gap-2"
            style={{ backgroundColor: "#1A56DB" }}
            onClick={() => setStep((s) => Math.min(empresaSteps.length, s + 1))}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            className="gap-2"
            style={{ backgroundColor: "#059669" }}
            onClick={handleSubmit}
            disabled={!form.lgpd}
          >
            <CheckCircle2 className="w-4 h-4" />
            Salvar Empresa
          </Button>
        )}
      </div>
    </div>
  );
}

function UsuarioForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    perfil: "",
    senha: "",
    confirmaSenha: "",
    lgpd: false,
  });

  const senhaMatch = form.senha === form.confirmaSenha && form.confirmaSenha.length > 0;
  const senhaError = form.confirmaSenha.length > 0 && !senhaMatch;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#059669" }}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Usuário cadastrado com sucesso!</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          <strong>{form.nome || "Novo Usuário"}</strong> foi registrado com perfil <strong>{form.perfil}</strong>.
          Um e-mail de boas-vindas foi enviado para <strong>{form.email}</strong>.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); }}>
            Cadastrar outro usuário
          </Button>
          <Button style={{ backgroundColor: "#1A56DB" }} onClick={() => navigate("/usuarios")}>
            Ver lista de usuários
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={usuarioSteps} current={step} />

      {step === 1 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF01 — Cadastro com e-mail e senha · RF02 — E-mail único</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Nome Completo <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Ex.: João da Silva"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label>E-mail <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                placeholder="usuario@empresa.com.br"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">RF02 — Este e-mail não pode estar em uso por outro cadastro ativo</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF04 — Hierarquia de Perfis: ADM / ANALISTA / CONTADOR</div>

          <div className="space-y-1.5">
            <Label>Perfil de Acesso <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  value: "ADM",
                  label: "Administrador",
                  desc: "Acesso total ao sistema, incluindo configurações e gestão de usuários. (RF35)",
                  className: "badge-admin",
                },
                {
                  value: "ANALISTA",
                  label: "Analista Interno",
                  desc: "Acessa empresas vinculadas, valida documentos e gera relatórios. (RF07)",
                  className: "badge-analyst",
                },
                {
                  value: "CONTADOR",
                  label: "Contador Externo",
                  desc: "Faz upload de documentos e acompanha status de pendências. (RF12)",
                  className: "badge-accountant",
                },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setForm({ ...form, perfil: p.value })}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    form.perfil === p.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className={cn("text-xs px-2 py-0.5 rounded font-semibold", p.className)}>
                    {p.label}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Senha <span className="text-red-500">*</span></Label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">RNF04 — Armazenada com hash criptográfico seguro</p>
            </div>

            <div className="space-y-1.5">
              <Label>Confirmar Senha <span className="text-red-500">*</span></Label>
              <Input
                type="password"
                placeholder="Repita a senha"
                value={form.confirmaSenha}
                onChange={(e) => setForm({ ...form, confirmaSenha: e.target.value })}
                className={senhaError ? "border-red-400" : senhaMatch ? "border-emerald-400" : ""}
              />
              {senhaError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> As senhas não coincidem
                </p>
              )}
              {senhaMatch && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Senhas coincidem
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="wf-annotation mb-4">RF23 — Aceite LGPD e confirmação de dados</div>

          <div className="bg-muted/30 rounded-lg border border-border p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Resumo do Cadastro</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Nome", form.nome || "—"],
                ["E-mail", form.email || "—"],
                ["Perfil", form.perfil || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="font-medium text-foreground font-mono text-xs">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Checkbox
              id="lgpd-user"
              checked={form.lgpd}
              onCheckedChange={(v) => setForm({ ...form, lgpd: !!v })}
              className="mt-0.5"
            />
            <label htmlFor="lgpd-user" className="text-sm text-blue-800 leading-relaxed cursor-pointer">
              Declaro que li e aceito os <strong>Termos de Uso e Política de Privacidade</strong>,
              autorizando o tratamento dos meus dados pessoais conforme a <strong>LGPD</strong>.
              Este consentimento será registrado com data e hora. (RF23)
            </label>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <span className="text-xs text-muted-foreground">
          Etapa {step} de {usuarioSteps.length}
        </span>

        {step < usuarioSteps.length ? (
          <Button
            className="gap-2"
            style={{ backgroundColor: "#1A56DB" }}
            onClick={() => setStep((s) => Math.min(usuarioSteps.length, s + 1))}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            className="gap-2"
            style={{ backgroundColor: "#059669" }}
            onClick={() => setSubmitted(true)}
            disabled={!form.lgpd}
          >
            <CheckCircle2 className="w-4 h-4" />
            Criar Usuário
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Cadastro() {
  return (
    <AppLayout
      pageTitle="Cadastro"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Cadastro" },
      ]}
    >
      <div className="wf-annotation mb-5 inline-block">
        Tela 3 — Cadastro · RF01 · RF02 · RF04 · RF06 · RF07 · RF11 · RF23
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        <Tabs defaultValue="empresa">
          <TabsList className="mb-6">
            <TabsTrigger value="empresa" className="gap-2">
              <Building2 className="w-4 h-4" />
              Cadastro de Empresa
            </TabsTrigger>
            <TabsTrigger value="usuario" className="gap-2">
              <User className="w-4 h-4" />
              Cadastro de Usuário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="empresa">
            <EmpresaForm />
          </TabsContent>

          <TabsContent value="usuario">
            <UsuarioForm />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
