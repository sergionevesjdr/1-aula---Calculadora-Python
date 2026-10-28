/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Eye,
  Code2,
  ExternalLink,
  Github,
  Sparkles,
} from 'lucide-react';
import { ProjectFile } from '../data/projectFiles';
import { downloadSingleFile } from '../utils/zipGenerator';

interface ReadmePreviewProps {
  readmeFile: ProjectFile;
  onOpenGitGuide: () => void;
}

export function ReadmePreview({
  readmeFile,
  onOpenGitGuide,
}: ReadmePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">README.md para GitHub</h3>
              <span className="text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Pronto para publicação
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Estruturado de acordo com os padrões de excelência de repositórios open-source no GitHub.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch: Preview vs Raw */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visualização GitHub</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'raw'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Markdown Puro</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700 flex items-center gap-1.5"
            title="Copiar README.md"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
            <span>{copied ? 'Copiado!' : 'Copiar README'}</span>
          </button>

          <button
            onClick={() => downloadSingleFile(readmeFile)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition-colors border border-cyan-500/30 flex items-center gap-1.5"
            title="Baixar arquivo README.md"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .md</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'preview' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-slate-300 text-sm leading-relaxed max-w-none">
          {/* Mock GitHub Header simulation */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐍</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                calculadora-python
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Calculadora simples, modular e elegante desenvolvida em Python com suporte a CLI, GUI nativa em Tkinter e cobertura total de testes unitários.
            </p>

            {/* Badges preview */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center rounded overflow-hidden text-[11px] font-semibold border border-slate-700 font-sans shadow-sm">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5">python</span>
                <span className="bg-blue-600 text-white px-2 py-0.5">3.8+</span>
              </span>
              <span className="inline-flex items-center rounded overflow-hidden text-[11px] font-semibold border border-slate-700 font-sans shadow-sm">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5">License</span>
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5">MIT</span>
              </span>
              <span className="inline-flex items-center rounded overflow-hidden text-[11px] font-semibold border border-slate-700 font-sans shadow-sm">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5">tests</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5">12/12 passing</span>
              </span>
              <span className="inline-flex items-center rounded overflow-hidden text-[11px] font-semibold border border-slate-700 font-sans shadow-sm">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5">code style</span>
                <span className="bg-slate-950 text-slate-200 px-2 py-0.5">black</span>
              </span>
            </div>
          </div>

          {/* Table of contents */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              📋 Sumário
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-cyan-400 font-medium">
              <span>• Visão Geral</span>
              <span>• Funcionalidades</span>
              <span>• Estrutura do Repositório</span>
              <span>• Pré-requisitos & Instalação</span>
              <span>• Como Usar (CLI, GUI & Módulo)</span>
              <span>• Testes Unitários</span>
              <span>• Publicação no GitHub</span>
              <span>• Licença & Contribuição</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              ✨ Funcionalidades
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">➕</span> Adição (a + b)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">➖</span> Subtração (a - b)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✖️</span> Multiplicação (a * b)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">➗</span> Divisão segura contra ZeroDivisionError
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">⚡</span> Potência e raiz fracionária
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">📐</span> Raiz quadrada real (√a)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">📊</span> Porcentagem e resto de divisão (%)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">🧠</span> Memória (M+, M-, MR, MC) e Histórico
              </li>
            </ul>
          </div>

          {/* Quick command examples */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              🎯 Modos de Execução
            </h3>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">1. Menu de Terminal Interativo:</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                python cli.py
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">2. Execução Direta via Flags:</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                python cli.py --add 15 30<br />
                python cli.py --sqrt 144<br />
                python cli.py --pow 2 10
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">3. Interface Gráfica Nativa (Tkinter):</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                python gui.py
              </div>
            </div>
          </div>

          {/* Publish callout */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
                <Github className="w-4 h-4 text-emerald-400" />
                Como publicar este README no seu GitHub?
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Siga o assistente de publicação com os comandos Git gerados especificamente para a sua conta.
              </p>
            </div>
            <button
              onClick={onOpenGitGuide}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Abrir Guia GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Raw Markdown View */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] select-text">
            {readmeFile.content}
          </pre>
        </div>
      )}
    </div>
  );
}
