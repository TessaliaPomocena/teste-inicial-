/*
 * TELA 4: Tela de Listagem / Consulta
 * DESIGN: "Precision Finance" — Tabela com filtros, busca, paginação e ações em linha
 * RF08 - Atualização de Dados, RF09 - Inativação, RF10 - Busca e Filtros
 * RF05 - Gestão de Status, RF31 - Histórico de Relatórios
 * Tabs: Empresas | Documentos | Relatórios | Usuários
 */

import { useState } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Edit,
  Power,
  FileText,
  Building2,
  Users,
  BarChart2,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

// ---- DATA ----
const empresas = [
  { id: 1, razao: "Construtora Alpha Ltda", cnpj: "12.345.678/0001-90", segmento: "Construção Civil", analista: "Tessália S.", status: "Ativo", docs: 18, relatorios: 6, progresso: 100 },
  { id: 2, razao: "Comércio Beta S.A.", cnpj: "98.765.432/0001-10", segmento: "Comércio", analista: "Alessandro W.", status: "Ativo", docs: 14, relatorios: 4, progresso: 67 },
  { id: 3, razao: "Indústria Gamma ME", cnpj: "11.222.333/0001-44", segmento: "Indústria", analista: "Samara M.", status: "Ativo", docs: 9, relatorios: 3, progresso: 33 },
  { id: 4, razao: "Serviços Delta Eireli", cnpj: "55.666.777/0001-88", segmento: "Serviços", analista: "Marlon P.", status: "Ativo", docs: 6, relatorios: 2, progresso: 0 },
  { id: 5, razao: "Tech Epsilon Ltda", cnpj: "33.444.555/0001-22", segmento: "Tecnologia", analista: "Gabriel R.", status: "Ativo", docs: 21, relatorios: 7, progresso: 100 },
  { id: 6, razao: "Agro Zeta S.A.", cnpj: "77.888.999/0001-33", segmento: "Agronegócio", analista: "Tessália S.", status: "Inativo", docs: 12, relatorios: 4, progresso: 100 },
  { id: 7, razao: "Saúde Eta Ltda", cnpj: "22.333.444/0001-55", segmento: "Saúde", analista: "Alessandro W.", status: "Ativo", docs: 15, relatorios: 5, progresso: 100 },
  { id: 8, razao: "Logística Theta ME", cnpj: "44.555.666/0001-77", segmento: "Serviços", analista: "Samara M.", status: "Ativo", docs: 8, relatorios: 2, progresso: 67 },
];

const documentos = [
  { id: 1, empresa: "Construtora Alpha Ltda", tipo: "DRE", periodo: "Fev/2026", status: "Processado", confianca: 98, enviado: "05/03/2026", analista: "Tessália S." },
  { id: 2, empresa: "Construtora Alpha Ltda", tipo: "Balanço Patrimonial", periodo: "Fev/2026", status: "Processado", confianca: 95, enviado: "05/03/2026", analista: "Tessália S." },
  { id: 3, empresa: "Comércio Beta S.A.", tipo: "DRE", periodo: "Fev/2026", status: "Em Processamento", confianca: null, enviado: "06/03/2026", analista: "Alessandro W." },
  { id: 4, empresa: "Comércio Beta S.A.", tipo: "Balancete", periodo: "Fev/2026", status: "Revisão Necessária", confianca: 62, enviado: "06/03/2026", analista: "Alessandro W." },
  { id: 5, empresa: "Indústria Gamma ME", tipo: "DRE", periodo: "Jan/2026", status: "Processado", confianca: 91, enviado: "15/02/2026", analista: "Samara M." },
  { id: 6, empresa: "Tech Epsilon Ltda", tipo: "Balanço Patrimonial", periodo: "Fev/2026", status: "Processado", confianca: 99, enviado: "04/03/2026", analista: "Gabriel R." },
  { id: 7, empresa: "Serviços Delta Eireli", tipo: "DRE", periodo: "Jan/2026", status: "Pendente", confianca: null, enviado: "—", analista: "Marlon P." },
];

const relatorios = [
  { id: 1, empresa: "Construtora Alpha Ltda", periodo: "Fev/2026", gerado: "06/03/2026", analista: "Tessália S.", validado: true, disclaimer: false },
  { id: 2, empresa: "Tech Epsilon Ltda", periodo: "Fev/2026", gerado: "05/03/2026", analista: "Gabriel R.", validado: true, disclaimer: false },
  { id: 3, empresa: "Indústria Gamma ME", periodo: "Jan/2026", gerado: "20/02/2026", analista: "Samara M.", validado: true, disclaimer: false },
  { id: 4, empresa: "Comércio Beta S.A.", periodo: "Jan/2026", gerado: "18/02/2026", analista: "Alessandro W.", validado: false, disclaimer: true },
  { id: 5, empresa: "Saúde Eta Ltda", periodo: "Fev/2026", gerado: "06/03/2026", analista: "Alessandro W.", validado: true, disclaimer: false },
];

const usuarios = [
  { id: 1, nome: "Tessália Santos", email: "tessalia@propósito.com.br", perfil: "ANALISTA", status: "Ativo", empresas: 8, ultimo: "Hoje" },
  { id: 2, nome: "Alessandro Bucker", email: "alessandro@propósito.com.br", perfil: "ANALISTA", status: "Ativo", empresas: 7, ultimo: "Hoje" },
  { id: 3, nome: "Samara Malta", email: "samara@propósito.com.br", perfil: "ADM", status: "Ativo", empresas: 34, ultimo: "Hoje" },
  { id: 4, nome: "Marlon Mendes", email: "marlon@propósito.com.br", perfil: "ANALISTA", status: "Ativo", empresas: 5, ultimo: "Ontem" },
  { id: 5, nome: "Gabriel Duglokinski", email: "gabriel@propósito.com.br", perfil: "ANALISTA", status: "Ativo", empresas: 6, ultimo: "Hoje" },
  { id: 6, nome: "João Contador", email: "joao@escritorio.com.br", perfil: "CONTADOR", status: "Ativo", empresas: 3, ultimo: "03/03/2026" },
  { id: 7, nome: "Maria Contadora", email: "maria@escritorio.com.br", perfil: "CONTADOR", status: "Inativo", empresas: 2, ultimo: "01/02/2026" },
];

// ---- HELPERS ----
const docStatusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  "Processado": { label: "Processado", className: "status-done", icon: CheckCircle2 },
  "Em Processamento": { label: "Em Processamento", className: "status-processing", icon: Clock },
  "Revisão Necessária": { label: "Revisão Necessária", className: "status-pending", icon: AlertTriangle },
  "Pendente": { label: "Pendente", className: "status-error", icon: XCircle },
};

function Pagination({ total, page, perPage, onPage }: { total: number; page: number; perPage: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
      <span className="text-xs text-muted-foreground">
        Mostrando {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} de {total} registros
      </span>
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={cn(
              "w-7 h-7 text-xs rounded font-medium transition-all",
              p === page ? "text-white" : "hover:bg-muted text-muted-foreground"
            )}
            style={p === page ? { backgroundColor: "#1A56DB" } : {}}
          >
            {p}
          </button>
        ))}
        <button
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Listagem() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filteredEmpresas = empresas.filter((e) => {
    const matchSearch = e.razao.toLowerCase().includes(search.toLowerCase()) || e.cnpj.includes(search);
    const matchStatus = statusFilter === "Todos" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pagedEmpresas = filteredEmpresas.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AppLayout
      pageTitle="Listagem e Consulta"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Listagem" },
      ]}
    >
      <div className="wf-annotation mb-5 inline-block">
        Tela 4 — Listagem · RF05 · RF08 · RF09 · RF10 · RF18 · RF31
      </div>

      <Tabs defaultValue="empresas">
        <TabsList className="mb-5">
          <TabsTrigger value="empresas" className="gap-2">
            <Building2 className="w-4 h-4" />
            Empresas ({empresas.length})
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-2">
            <FileText className="w-4 h-4" />
            Documentos ({documentos.length})
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="gap-2">
            <BarChart2 className="w-4 h-4" />
            Relatórios ({relatorios.length})
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <Users className="w-4 h-4" />
            Usuários ({usuarios.length})
          </TabsTrigger>
        </TabsList>

        {/* ---- EMPRESAS ---- */}
        <TabsContent value="empresas">
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por razão social ou CNPJ... (RF10)"
                  className="pl-9 text-sm"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="gap-2 ml-auto"
                style={{ backgroundColor: "#1A56DB" }}
                onClick={() => navigate("/cadastro")}
              >
                <Plus className="w-4 h-4" />
                Nova Empresa
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Empresa", "CNPJ", "Segmento", "Analista", "Progresso", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        {h && (
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            {h} {h && h !== "" && <ArrowUpDown className="w-3 h-3" />}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedEmpresas.map((e) => (
                    <tr key={e.id} className="border-b border-border last:border-0 table-row-hover">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-foreground text-sm">{e.razao}</div>
                        <div className="text-xs text-muted-foreground">{e.docs} docs · {e.relatorios} relatórios</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground">{e.cnpj}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-foreground">{e.segmento}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-foreground">{e.analista}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={e.progresso} className="h-1.5 flex-1" />
                          <span className="text-xs font-mono text-muted-foreground w-8">{e.progresso}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded font-medium",
                          e.status === "Ativo" ? "status-done" : "bg-gray-100 text-gray-600 border border-gray-200"
                        )}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded hover:bg-muted transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => navigate("/upload")}>
                              <Eye className="w-4 h-4" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => navigate("/cadastro")}>
                              <Edit className="w-4 h-4" /> Editar (RF08)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-sm text-amber-600">
                              <Power className="w-4 h-4" />
                              {e.status === "Ativo" ? "Inativar (RF09)" : "Reativar (RF05)"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {pagedEmpresas.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        Nenhuma empresa encontrada para os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={filteredEmpresas.length} page={page} perPage={PER_PAGE} onPage={setPage} />
          </div>
        </TabsContent>

        {/* ---- DOCUMENTOS ---- */}
        <TabsContent value="documentos">
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar documentos..." className="pl-9 text-sm" />
              </div>
              <Select defaultValue="Todos">
                <SelectTrigger className="w-44">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os status</SelectItem>
                  <SelectItem value="Processado">Processado</SelectItem>
                  <SelectItem value="Em Processamento">Em Processamento</SelectItem>
                  <SelectItem value="Revisão Necessária">Revisão Necessária</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="gap-2 ml-auto"
                style={{ backgroundColor: "#1A56DB" }}
                onClick={() => navigate("/upload")}
              >
                <Plus className="w-4 h-4" />
                Upload de Documento
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Empresa", "Tipo", "Período", "Status (RF17)", "Confiança OCR", "Enviado em", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((d) => {
                    const sc = docStatusConfig[d.status];
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={d.id} className="border-b border-border last:border-0 table-row-hover">
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-medium text-foreground">{d.empresa}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-foreground">{d.tipo}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-muted-foreground">{d.periodo}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit", sc.className)}>
                            <StatusIcon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {d.confianca !== null ? (
                            <div className="flex items-center gap-2">
                              <Progress value={d.confianca} className="h-1.5 w-16" />
                              <span
                                className="font-mono text-xs font-medium"
                                style={{ color: d.confianca >= 80 ? "#059669" : d.confianca >= 60 ? "#D97706" : "#DC2626" }}
                              >
                                {d.confianca}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-muted-foreground">{d.enviado}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="gap-2 text-sm">
                                <Eye className="w-4 h-4" /> Visualizar (RF18)
                              </DropdownMenuItem>
                              {d.status === "Revisão Necessária" && (
                                <DropdownMenuItem className="gap-2 text-sm text-amber-600">
                                  <Edit className="w-4 h-4" /> Revisar dados (RF17)
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-sm text-red-600">
                                <XCircle className="w-4 h-4" /> Excluir (RF19)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Mostrando {documentos.length} documentos</span>
            </div>
          </div>
        </TabsContent>

        {/* ---- RELATÓRIOS ---- */}
        <TabsContent value="relatorios">
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Histórico de Relatórios</h2>
                <p className="text-xs text-muted-foreground mt-0.5">RF31 — Registro para auditoria e rastreabilidade</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Empresa", "Período", "Gerado em", "Analista", "Validação Manual", "Disclaimer", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {relatorios.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0 table-row-hover">
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium text-foreground">{r.empresa}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground">{r.periodo}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground">{r.gerado}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-foreground">{r.analista}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {r.validado ? (
                          <span className="status-done text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Validado
                          </span>
                        ) : (
                          <span className="status-pending text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {r.disclaimer ? (
                          <span className="status-error text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Com aviso (RF30)
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                          style={{ color: "#1A56DB" }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF (RF30)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{relatorios.length} relatórios no histórico</span>
            </div>
          </div>
        </TabsContent>

        {/* ---- USUÁRIOS ---- */}
        <TabsContent value="usuarios">
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar usuários..." className="pl-9 text-sm" />
              </div>
              <Button
                size="sm"
                className="gap-2 ml-auto"
                style={{ backgroundColor: "#1A56DB" }}
                onClick={() => navigate("/cadastro")}
              >
                <Plus className="w-4 h-4" />
                Novo Usuário
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Usuário", "E-mail", "Perfil (RF04)", "Empresas", "Último Acesso", "Status (RF05)", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 table-row-hover">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: "#1A56DB" }}
                          >
                            {u.nome.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-foreground">{u.nome}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground">{u.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded font-semibold",
                          u.perfil === "ADM" ? "badge-admin" : u.perfil === "ANALISTA" ? "badge-analyst" : "badge-accountant"
                        )}>
                          {u.perfil}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground">{u.empresas}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-muted-foreground">{u.ultimo}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded font-medium",
                          u.status === "Ativo" ? "status-done" : "bg-gray-100 text-gray-600 border border-gray-200"
                        )}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded hover:bg-muted transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="gap-2 text-sm">
                              <Edit className="w-4 h-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-sm text-amber-600">
                              <Power className="w-4 h-4" />
                              {u.status === "Ativo" ? "Desativar (RF05)" : "Reativar (RF05)"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{usuarios.length} usuários cadastrados</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
