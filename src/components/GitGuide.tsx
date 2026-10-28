/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Github,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
} from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface GitGuideProps {
  config: ProjectConfig;
  onUpdateConfig: (newConfig: Partial<ProjectConfig>) => void;
  onDownloadZip: () => void;
}

export function GitGuide({
  config,
  onUpdateConfig,
  onDownloadZip,
}: GitGuideProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const repoUrl = `https://github.com/${config.githubUsername}/${config.repoName}.git`;

  const copyStepCommand = (cmd: string, stepIdx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedStep(stepIdx);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const allCommands = `# 1. Inicializar o repositório local
git init

# 2. Adicionar todos os arquivos da calculadora
git add .

# 3. Criar o primeiro commit com mensagem padronizada
git commit -m "feat: Calculadora simples em Python com testes, CLI, GUI e documentacao"

# 4. Definir a branch principal como 'main'
git branch -M main

# 5. Adicionar seu repositório remoto no GitHub
git remote add origin ${repoUrl}

# 6. Enviar para o GitHub
git push -u origin main`;

  const copyAll = () => {
    navigator.clipboard.writeText(allCommands);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const steps = [
    {
      step: 1,
      title: 'Baixar e descompactar os arquivos',
      desc: 'Baixe o pacote zip com todos os arquivos configurados (README.md, calculator.py, testes, etc.) e extraia em uma pasta no seu computador.',
      actionButton: (
        <button
          onClick={onDownloadZip}
          className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <span>Baixar calculadora-python.zip</span>
        </button>
      ),
    },
    {
      step: 2,
      title: 'Criar repositório no GitHub',
      desc: 'Acesse o GitHub e crie um novo repositório vazio com o mesmo nome. Não marque as opções de adicionar README ou .gitignore automáticos, pois o nosso projeto já contém os arquivos completos.',
      actionButton: (
        <a
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700"
        >
          <Github className="w-3.5 h-3.5" />
          <span>Abrir github.com/new</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      ),
    },
    {
      step: 3,
      title: 'Inicializar o Git e fazer o Commit inicial',
      desc: 'Abra o terminal (Prompt de Comando, PowerShell ou Terminal do Linux/Mac) dentro da pasta onde você descompactou os arquivos e execute:',
      code: `git init
git add .
git commit -m "feat: Calculadora simples em Python com testes, CLI e GUI"`,
    },
    {
      step: 4,
      title: 'Conectar ao repositório remoto e publicar',
      desc: 'Vincule seu repositório local ao GitHub e envie o código para a branch main:',
      code: `git branch -M main
git remote add origin ${repoUrl}
git push -u origin main`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & User Profile Customizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Guia Completo de Publicação no GitHub
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Personalize o seu usuário para gerar comandos prontos para copiar e colar no seu terminal.
            </p>
          </div>

          <button
            onClick={copyAll}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs transition-colors border border-slate-700 flex items-center gap-2 self-start md:self-auto"
          >
            {copiedAll ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
            <span>{copiedAll ? 'Comandos Copiados!' : 'Copiar Todos os Comandos Git'}</span>
          </button>
        </div>

        {/* Input fields to customize GitHub handle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Seu Usuário do GitHub (username)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">@</span>
              <input
                type="text"
                value={config.githubUsername}
                onChange={(e) => onUpdateConfig({ githubUsername: e.target.value.trim() })}
                placeholder="seu-usuario"
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Nome do Repositório
            </label>
            <input
              type="text"
              value={config.repoName}
              onChange={(e) => onUpdateConfig({ repoName: e.target.value.trim() })}
              placeholder="calculadora-python"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic target URL display */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 truncate">URL Remota:</span>
          <span className="text-emerald-400 font-semibold truncate ml-2">{repoUrl}</span>
        </div>
      </div>

      {/* Step by Step list */}
      <div className="space-y-4">
        {steps.map((st) => (
          <div
            key={st.step}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {st.step}
              </div>

              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-bold text-white">{st.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>

                {st.actionButton && st.actionButton}

                {st.code && (
                  <div className="mt-3 relative bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-xs">
                    <pre className="text-emerald-300 whitespace-pre overflow-x-auto select-all pr-12">
                      {st.code}
                    </pre>

                    <button
                      onClick={() => copyStepCommand(st.code, st.step)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copiar bloco de comandos"
                    >
                      {copiedStep === st.step ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips / Good Practices for GitHub */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Boas Práticas Incluídas no Repositório</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>.gitignore Oficial:</strong> Impede o envio de pastas como <code className="text-slate-300 font-mono">__pycache__</code> e ambientes virtuais <code className="text-slate-300 font-mono">venv/</code>.
            </span>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>GitHub Actions CI:</strong> O arquivo <code className="text-slate-300 font-mono">.github/workflows/tests.yml</code> executa os testes automaticamente a cada commit ou Pull Request.
            </span>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Licença MIT:</strong> Garante que seu código possa ser usado, compartilhado e referenciado livremente em portfólios e entrevistas técnicas.
            </span>
          </div>

          <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>badges no README:</strong> Seu README já vem com botões que exibem versão do Python, status dos testes e formatação de código.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
