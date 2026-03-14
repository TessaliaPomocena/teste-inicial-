/*
 * TELA UPLOAD: Fluxo de Upload e Processamento OCR
 * DESIGN: "Precision Finance" — Drag & drop + status de processamento + revisão de campos
 * RF12 - Upload, RF13 - Filtro automático, RF14 - Organização automática
 * RF15 - OCR, RF16 - Configuração de campos, RF17 - Revisão humana com alerta
 * RF18 - Visualização, RF19 - Proteção contra exclusão
 */

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  RefreshCw,
  Loader2,
  Info,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

type FileStatus = "idle" | "uploading" | "processing" | "done" | "review" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "xlsx" | "image";
  status: FileStatus;
  progress: number;
  confianca?: number;
  campos?: { nome: string; valor: string; confianca: number }[];
}

const mockCampos = [
  { nome: "Receita Bruta", valor: "R$ 1.245.678,00", confianca: 97 },
  { nome: "Custo dos Produtos Vendidos", valor: "R$ 834.521,00", confianca: 94 },
  { nome: "Lucro Bruto", valor: "R$ 411.157,00", confianca: 99 },
  { nome: "Despesas Operacionais", valor: "R$ 189.430,00", confianca: 88 },
  { nome: "EBITDA", valor: "R$ 221.727,00", confianca: 72 },
  { nome: "Resultado Líquido", valor: "R$ 156.890,00", confianca: 95 },
  { nome: "Total do Ativo", valor: "R$ 3.456.789,00", confianca: 61 },
  { nome: "Total do Passivo", valor: "R$ 2.134.567,00", confianca: 58 },
];

function getFileIcon(type: string) {
  if (type === "pdf") return <FileText className="w-5 h-5 text-red-500" />;
  if (type === "xlsx") return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
  return <ImageIcon className="w-5 h-5 text-blue-500" />;
}

export default function Upload() {
  const [, navigate] = useLocation();
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [empresa, setEmpresa] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [periodo, setPeriodo] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (name: string, size: string, type: "pdf" | "xlsx" | "image") => {
    const id = Math.random().toString(36).slice(2);
    const newFile: UploadedFile = { id, name, size, type, status: "uploading", progress: 0 };
    setFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    let p = 0;
    const uploadInterval = setInterval(() => {
      p += Math.random() * 20 + 10;
      if (p >= 100) {
        clearInterval(uploadInterval);
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, status: "processing" } : f));

        // Simulate OCR processing
        setTimeout(() => {
          const confianca = Math.floor(Math.random() * 40) + 60;
          const status: FileStatus = confianca >= 75 ? "done" : "review";
          setFiles((prev) => prev.map((f) =>
            f.id === id ? { ...f, status, confianca, campos: mockCampos } : f
          ));
        }, 2500);
      } else {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: Math.min(p, 95) } : f));
      }
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase();
      const type = ext === "pdf" ? "pdf" : ext === "xlsx" || ext === "xls" ? "xlsx" : "image";
      const size = `${(f.size / 1024).toFixed(0)} KB`;
      simulateUpload(f.name, size, type);
    });
  };

  const handleFileSelect = () => {
    // Simulate selecting a file
    const mockFiles = [
      { name: "DRE_Fevereiro_2026.pdf", size: "245 KB", type: "pdf" as const },
      { name: "Balanco_Patrimonial_Fev26.xlsx", size: "128 KB", type: "xlsx" as const },
      { name: "Balancete_Fev2026.pdf", size: "312 KB", type: "pdf" as const },
    ];
    const mock = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    simulateUpload(mock.name, mock.size, mock.type);
  };

  const statusLabels: Record<FileStatus, { label: string; className: string }> = {
    idle: { label: "Aguardando", className: "bg-gray-100 text-gray-600 border border-gray-200" },
    uploading: { label: "Enviando...", className: "status-processing" },
    processing: { label: "Processando OCR...", className: "status-processing" },
    done: { label: "Processado", className: "status-done" },
    review: { label: "Revisão Necessária", className: "status-pending" },
    error: { label: "Erro", className: "status-error" },
  };

  return (
    <AppLayout
      pageTitle="Upload de Documentos"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Upload de Documentos" },
      ]}
    >
      <div className="wf-annotation mb-5 inline-block">
        Fluxo de Upload · RF12 · RF13 · RF14 · RF15 · RF16 · RF17 · RF18 · RF19
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Upload form */}
        <div className="xl:col-span-1 space-y-4">
          {/* Context selectors */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Contexto do Documento</h2>
            <div className="wf-annotation">RF14 — Vinculação automática empresa + período</div>

            <div className="space-y-1.5">
              <Label className="text-xs">Empresa <span className="text-red-500">*</span></Label>
              <Select value={empresa} onValueChange={setEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alpha">Construtora Alpha Ltda</SelectItem>
                  <SelectItem value="beta">Comércio Beta S.A.</SelectItem>
                  <SelectItem value="gamma">Indústria Gamma ME</SelectItem>
                  <SelectItem value="delta">Serviços Delta Eireli</SelectItem>
                  <SelectItem value="epsilon">Tech Epsilon Ltda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Tipo de Documento <span className="text-red-500">*</span></Label>
              <Select value={tipoDoc} onValueChange={setTipoDoc}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dre">DRE — Demonstração de Resultado</SelectItem>
                  <SelectItem value="balanco">Balanço Patrimonial</SelectItem>
                  <SelectItem value="balancete">Balancete de Verificação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Período de Competência <span className="text-red-500">*</span></Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Mês/Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fev26">Fevereiro/2026</SelectItem>
                  <SelectItem value="jan26">Janeiro/2026</SelectItem>
                  <SelectItem value="dez25">Dezembro/2025</SelectItem>
                  <SelectItem value="nov25">Novembro/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drop zone */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Enviar Arquivo</h2>
            <div className="wf-annotation mb-3">RF12 — PDF, XLSX, JPG/JPEG · RF13 — Filtro automático de tipo</div>

            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
                dragOver ? "border-blue-400 bg-blue-50" : "border-border hover:border-blue-300 hover:bg-muted/30"
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={handleFileSelect}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: dragOver ? "#EFF6FF" : "#F7F9FC" }}
              >
                <UploadIcon className={cn("w-5 h-5 transition-colors", dragOver ? "text-blue-500" : "text-muted-foreground")} />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {dragOver ? "Solte o arquivo aqui" : "Arraste e solte ou clique para selecionar"}
              </p>
              <p className="text-xs text-muted-foreground">PDF, XLSX, XLS, JPG, JPEG — Máx. 25 MB</p>
            </div>

            <div className="flex items-start gap-2 mt-3 p-2.5 rounded-md bg-amber-50 border border-amber-100">
              <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                RF13 — Arquivos fora dos tipos aceitos serão automaticamente bloqueados.
              </p>
            </div>
          </div>
        </div>

        {/* Right: File list + review */}
        <div className="xl:col-span-2 space-y-4">
          {/* File queue */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Fila de Processamento</h2>
                <p className="text-xs text-muted-foreground mt-0.5">RF15 — OCR assíncrono (RNF08)</p>
              </div>
              {files.length > 0 && (
                <span className="text-xs text-muted-foreground">{files.length} arquivo{files.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {files.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum arquivo na fila.</p>
                <p className="text-xs text-muted-foreground mt-1">Selecione um arquivo para começar o processamento.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {files.map((f) => {
                  const sc = statusLabels[f.status];
                  return (
                    <div
                      key={f.id}
                      className={cn(
                        "px-5 py-4 flex items-start gap-3 cursor-pointer transition-colors",
                        selectedFile?.id === f.id ? "bg-blue-50" : "hover:bg-muted/30"
                      )}
                      onClick={() => f.status === "done" || f.status === "review" ? setSelectedFile(f) : null}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getFileIcon(f.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground truncate">{f.name}</span>
                          <span className={cn("text-xs px-2 py-0.5 rounded font-medium flex-shrink-0", sc.className)}>
                            {sc.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{f.size}</span>
                          {f.confianca !== undefined && (
                            <span
                              className="text-xs font-mono font-medium"
                              style={{ color: f.confianca >= 80 ? "#059669" : f.confianca >= 60 ? "#D97706" : "#DC2626" }}
                            >
                              Confiança OCR: {f.confianca}%
                            </span>
                          )}
                        </div>
                        {(f.status === "uploading" || f.status === "processing") && (
                          <div className="mt-2 flex items-center gap-2">
                            <Progress value={f.status === "processing" ? undefined : f.progress} className="h-1 flex-1" />
                            <Loader2 className="w-3 h-3 animate-spin text-blue-500 flex-shrink-0" />
                          </div>
                        )}
                        {f.status === "review" && (
                          <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            RF17 — Campos com baixa confiança detectados. Clique para revisar.
                          </p>
                        )}
                      </div>
                      <button
                        className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                        onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((x) => x.id !== f.id)); }}
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Field review panel */}
          {selectedFile && selectedFile.campos && (
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Revisão de Dados Extraídos</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    RF17 — Campos com confiança abaixo de 75% exigem validação manual
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    Ver original (RF18)
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reprocessar
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedFile.campos.map((campo, i) => {
                    const needsReview = campo.confianca < 75;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "p-3 rounded-md border",
                          needsReview ? "border-amber-200 bg-amber-50" : "border-border bg-muted/20"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Label className="text-xs font-medium">{campo.nome}</Label>
                          <div className="flex items-center gap-1.5">
                            {needsReview && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                            <span
                              className="text-xs font-mono font-medium"
                              style={{ color: campo.confianca >= 80 ? "#059669" : campo.confianca >= 60 ? "#D97706" : "#DC2626" }}
                            >
                              {campo.confianca}%
                            </span>
                          </div>
                        </div>
                        <Input
                          defaultValue={campo.valor}
                          className={cn(
                            "text-xs font-mono h-8",
                            needsReview ? "border-amber-300 bg-white" : ""
                          )}
                        />
                        {needsReview && (
                          <p className="text-xs text-amber-700 mt-1">Verifique e corrija se necessário</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {selectedFile.campos.filter((c) => c.confianca >= 75).length} de {selectedFile.campos.length} campos validados automaticamente
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2"
                      style={{ backgroundColor: "#059669" }}
                      onClick={() => {
                        setFiles((prev) => prev.map((f) => f.id === selectedFile.id ? { ...f, status: "done" } : f));
                        setSelectedFile(null);
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmar e Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generate report CTA */}
          {files.some((f) => f.status === "done") && (
            <div
              className="rounded-lg border p-5 flex items-center justify-between"
              style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}
            >
              <div>
                <p className="text-sm font-semibold text-blue-900">Documentos processados com sucesso!</p>
                <p className="text-xs text-blue-700 mt-0.5">RF25 — Gere o relatório consolidado em PDF agora.</p>
              </div>
              <Button
                size="sm"
                className="gap-2 flex-shrink-0"
                style={{ backgroundColor: "#1A56DB" }}
                onClick={() => navigate("/relatorios")}
              >
                <FileText className="w-4 h-4" />
                Gerar Relatório
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
