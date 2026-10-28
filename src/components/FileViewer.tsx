/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  FileText,
  FileCog,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';
import { ProjectFile } from '../data/projectFiles';
import { downloadSingleFile } from '../utils/zipGenerator';

interface FileViewerProps {
  files: ProjectFile[];
  selectedFile: ProjectFile;
  onSelectFile: (file: ProjectFile) => void;
}

export function FileViewer({
  files,
  selectedFile,
  onSelectFile,
}: FileViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.py')) return <FileCode2 className="w-4 h-4 text-emerald-400" />;
    if (fileName.endsWith('.md')) return <FileText className="w-4 h-4 text-cyan-400" />;
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml'))
      return <Layers className="w-4 h-4 text-purple-400" />;
    if (fileName.endsWith('.toml')) return <FileCog className="w-4 h-4 text-amber-400" />;
    if (fileName === 'LICENSE') return <Shield className="w-4 h-4 text-rose-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* File Tree / Navigation */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Arquivos do Projeto</h4>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {files.length} arquivos
          </span>
        </div>

        <div className="space-y-1">
          {files.map((file) => {
            const isSelected = file.path === selectedFile.path;
            return (
              <button
                key={file.path}
                onClick={() => onSelectFile(file)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between text-xs font-mono ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </div>

                {file.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-sans font-medium flex-shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500/25 text-emerald-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {file.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p>
            💡 <strong className="text-slate-300">Dica:</strong> Todos esses arquivos são empacotados
            juntos no botão <em>"Baixar Projeto (.ZIP)"</em> para você publicar no GitHub em 1 minuto.
          </p>
        </div>
      </div>

      {/* Code Editor / Code Display Panel */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* File Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {getFileIcon(selectedFile.name)}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-white">
                  {selectedFile.path}
                </span>
                {selectedFile.badge && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    {selectedFile.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700/80 flex items-center gap-1.5"
              title="Copiar conteúdo"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={() => downloadSingleFile(selectedFile)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono transition-colors border border-emerald-500/30 flex items-center gap-1.5"
              title="Baixar arquivo individual"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </button>
          </div>
        </div>

        {/* Code Content Area with Line Numbers */}
        <div className="bg-slate-950/90 p-4 max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed select-text flex">
          {/* Line Numbers */}
          <div className="pr-4 border-r border-slate-800/80 text-right text-slate-600 select-none flex-shrink-0">
            {lines.map((_, i) => (
              <div key={i} className="h-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual code */}
          <pre className="pl-4 text-slate-200 overflow-x-auto flex-1 whitespace-pre">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
