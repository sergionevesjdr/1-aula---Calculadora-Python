/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  Terminal,
  FileText,
  FolderGit2,
  Download,
  ShieldCheck,
  Code2,
  Github,
  Globe,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  generateProjectFiles,
  ProjectConfig,
  ProjectFile,
} from './data/projectFiles';
import { downloadProjectZip } from './utils/zipGenerator';
import { VisualCalculator } from './components/VisualCalculator';
import { PythonTerminal } from './components/PythonTerminal';
import { FileViewer } from './components/FileViewer';
import { ReadmePreview } from './components/ReadmePreview';
import { TestRunner } from './components/TestRunner';
import { GitGuide } from './components/GitGuide';

type TabType =
  | 'calculator'
  | 'terminal'
  | 'readme'
  | 'code'
  | 'tests'
  | 'github-guide';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [config, setConfig] = useState<ProjectConfig>({
    repoName: 'calculadora-python',
    authorName: 'Seu Nome',
    githubUsername: 'seu-usuario',
    language: 'pt-BR',
    description:
      'Calculadora simples, modular e elegante em Python com suporte a CLI interativo, GUI desktop nativa em Tkinter e cobertura de 100% de testes unitários.',
  });

  const [isZipping, setIsZipping] = useState(false);

  // Re-generate project files when config changes
  const projectFiles = useMemo(() => generateProjectFiles(config), [config]);

  const readmeFile = useMemo(
    () => projectFiles.find((f) => f.name === 'README.md') || projectFiles[0],
    [projectFiles]
  );

  const [selectedFile, setSelectedFile] = useState<ProjectFile>(() => {
    return projectFiles.find((f) => f.name === 'calculator.py') || projectFiles[0];
  });

  const handleUpdateConfig = (updates: Partial<ProjectConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      await downloadProjectZip(projectFiles, `${config.repoName}.zip`);
    } catch (err) {
      console.error('Erro ao gerar ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Notification / Banner */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-bold">
                <CalcIcon className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    PyCalc
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Python 3.8+
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Calculadora & Repositório GitHub Pronto
                </p>
              </div>
            </div>

            {/* Global Actions: Language toggle & Download Project ZIP */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleUpdateConfig({
                    language: config.language === 'pt-BR' ? 'en' : 'pt-BR',
                  })
                }
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700/60"
                title="Alternar idioma dos arquivos e README"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{config.language === 'pt-BR' ? 'README: PT-BR' : 'README: EN'}</span>
              </button>

              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 flex-shrink-0"
                title="Baixar todos os 10 arquivos em formato .ZIP para criar o repositório"
              >
                <Download className="w-4 h-4" />
                <span>{isZipping ? 'Empacotando...' : 'Baixar Projeto (.ZIP)'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/50">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CalcIcon className="w-3.5 h-3.5" />
              <span>Calculadora Interativa</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'terminal'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal Python (REPL)</span>
            </button>

            <button
              onClick={() => setActiveTab('readme')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'readme'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>README.md para GitHub</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código-Fonte & Arquivos ({projectFiles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'tests'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Testes Unitários (12/12)</span>
            </button>

            <button
              onClick={() => setActiveTab('github-guide')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'github-guide'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Como Publicar no GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Highlight Banner / Quick Info */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Projeto Python Completo: Calculadora Simples com README & Testes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Contém lógica em POO (<code className="text-emerald-400 font-mono">calculator.py</code>),
                menu CLI (<code className="text-emerald-400 font-mono">cli.py</code>), aplicativo desktop Tkinter (<code className="text-emerald-400 font-mono">gui.py</code>),
                12 testes unitários, CI/CD GitHub Actions e documentação README completa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-shrink-0">
            <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Zero dependências externas obrigatórias
            </span>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'calculator' && <VisualCalculator />}

        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Console Interativo Python (REPL)
                </h3>
                <p className="text-xs text-slate-400">
                  Teste os métodos da classe <code className="text-emerald-400 font-mono">Calculator</code> diretamente como se estivesse no terminal Python real.
                </p>
              </div>
            </div>
            <PythonTerminal />
          </div>
        )}

        {activeTab === 'readme' && (
          <ReadmePreview
            readmeFile={readmeFile}
            onOpenGitGuide={() => setActiveTab('github-guide')}
          />
        )}

        {activeTab === 'code' && (
          <FileViewer
            files={projectFiles}
            selectedFile={selectedFile}
            onSelectFile={(f) => setSelectedFile(f)}
          />
        )}

        {activeTab === 'tests' && <TestRunner />}

        {activeTab === 'github-guide' && (
          <GitGuide
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onDownloadZip={handleDownloadAllZip}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">PyCalc</span>
            <span>—</span>
            <span>Calculadora Simples em Python para publicação no GitHub</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400">Licença MIT</span>
            <span>•</span>
            <span className="text-slate-400">Python 3.8+</span>
            <span>•</span>
            <span className="text-slate-400">12 Testes Unitários</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
