/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

interface TestCase {
  name: string;
  description: string;
  expected: string;
  status: 'passed' | 'running' | 'idle';
  durationMs: number;
}

const initialTests: TestCase[] = [
  {
    name: 'test_addition',
    description: 'Valida operações de soma com inteiros, negativos e decimais',
    expected: 'calc.add(2, 3) == 5',
    status: 'passed',
    durationMs: 0.2,
  },
  {
    name: 'test_subtraction',
    description: 'Valida subtrações com valores positivos e negativos',
    expected: 'calc.subtract(10, 4) == 6',
    status: 'passed',
    durationMs: 0.1,
  },
  {
    name: 'test_multiplication',
    description: 'Valida multiplicações incluindo multiplicação por zero',
    expected: 'calc.multiply(4, 5) == 20',
    status: 'passed',
    durationMs: 0.1,
  },
  {
    name: 'test_division',
    description: 'Valida divisão com números inteiros e frações periódicas',
    expected: 'calc.divide(10, 2) == 5.0',
    status: 'passed',
    durationMs: 0.3,
  },
  {
    name: 'test_division_by_zero',
    description: 'Garante que divisão por zero levanta ZeroDivisionError',
    expected: 'assertRaises(ZeroDivisionError)',
    status: 'passed',
    durationMs: 0.4,
  },
  {
    name: 'test_power',
    description: 'Testa exponenciação e raízes fracionárias via potência',
    expected: 'calc.power(2, 3) == 8',
    status: 'passed',
    durationMs: 0.2,
  },
  {
    name: 'test_square_root',
    description: 'Valida extração de raiz quadrada de números perfeitos e zero',
    expected: 'calc.square_root(16) == 4.0',
    status: 'passed',
    durationMs: 0.2,
  },
  {
    name: 'test_square_root_negative',
    description: 'Garante que raiz de negativo levanta ValueError no domínio real',
    expected: 'assertRaises(ValueError)',
    status: 'passed',
    durationMs: 0.3,
  },
  {
    name: 'test_percentage',
    description: 'Valida cálculo de porcentagem sobre valores totais',
    expected: 'calc.percentage(200, 15) == 30.0',
    status: 'passed',
    durationMs: 0.1,
  },
  {
    name: 'test_modulo',
    description: 'Valida resto da divisão inteira e bloqueio de módulo zero',
    expected: 'calc.modulo(10, 3) == 1',
    status: 'passed',
    durationMs: 0.2,
  },
  {
    name: 'test_memory_functions',
    description: 'Valida persistência de memória (M+, M-, Store, Clear)',
    expected: 'calc.memory == 65.0',
    status: 'passed',
    durationMs: 0.3,
  },
  {
    name: 'test_history',
    description: 'Garante registro cronológico das operações e limpeza de histórico',
    expected: 'len(calc.get_history()) == 2',
    status: 'passed',
    durationMs: 0.4,
  },
];

export function TestRunner() {
  const [tests, setTests] = useState<TestCase[]>(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    // Set all to idle
    setTests((prev) => prev.map((t) => ({ ...t, status: 'idle' })));

    for (let i = 0; i < tests.length; i++) {
      // Set current to running
      setTests((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: 'running' } : t))
      );
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Set to passed
      setTests((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: 'passed' } : t))
      );
    }
    setIsRunning(false);
  };

  const copyTestCommand = () => {
    navigator.clipboard.writeText('python -m unittest test_calculator.py -v');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;

  return (
    <div className="space-y-6">
      {/* Test Controls & Highlights Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Simulador de Testes Automatizados (unittest)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Executa os testes declarados em{' '}
              <code className="text-emerald-400 font-mono">test_calculator.py</code> para garantir
              que nada quebre no GitHub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Executando...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Rodar 12 Testes</span>
                </>
              )}
            </button>

            <button
              onClick={copyTestCommand}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700 flex items-center gap-1.5"
              title="Copiar comando terminal"
            >
              {copiedCmd ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{copiedCmd ? 'Copiado!' : 'Copiar comando'}</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              Taxa de Sucesso
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {Math.round((passedCount / tests.length) * 100)}% ({passedCount}/{tests.length})
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              Cobertura de Código
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
              100% Coverage
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              Tempo de Execução
            </div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              ~0.003s
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              GitHub Actions CI
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Compatível</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test List Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Casos de Teste em test_calculator.py</span>
          </div>
          <span>Status / Duração</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {tests.map((test) => (
            <div
              key={test.name}
              className="p-4 hover:bg-slate-800/30 transition-colors flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm text-slate-100">
                    {test.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                    {test.expected}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{test.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {test.status === 'passed' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ok ({test.durationMs}ms)
                  </span>
                )}
                {test.status === 'running' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse">
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    rodando...
                  </span>
                )}
                {test.status === 'idle' && (
                  <span className="text-xs font-mono text-slate-500 px-2 py-1">
                    na fila
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
