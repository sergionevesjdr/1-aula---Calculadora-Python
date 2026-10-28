/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'info';
  text: string;
}

export function PythonTerminal() {
  const [inputVal, setInputVal] = useState('');
  const [historyCmds, setHistoryCmds] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simulated internal calculator state
  const calcState = useRef({
    history: [] as Array<{ operation: string; result: number | string }>,
    memory: 0,
  });

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'l-0',
      type: 'system',
      text: 'Python 3.12.2 (main, Oct 2026) [GCC 11.4.0] on linux',
    },
    {
      id: 'l-1',
      type: 'system',
      text: 'Digite "help()" para ver os comandos ou teste os botões rápidos abaixo.',
    },
    {
      id: 'l-2',
      type: 'input',
      text: 'from calculator import Calculator',
    },
    {
      id: 'l-3',
      type: 'input',
      text: 'calc = Calculator()',
    },
    {
      id: 'l-4',
      type: 'info',
      text: 'Instância "calc" carregada com sucesso! Pronta para uso.',
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to input lines
    const inputLine: TerminalLine = {
      id: Math.random().toString(),
      type: 'input',
      text: trimmed,
    };

    // Save in command history
    setHistoryCmds((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    if (trimmed === 'clear' || trimmed === 'cls') {
      setLines([
        {
          id: Math.random().toString(),
          type: 'system',
          text: 'Terminal limpo. Instância calc permanece ativa.',
        },
      ]);
      setInputVal('');
      return;
    }

    if (trimmed === 'help()' || trimmed === 'help') {
      const helpText = `Comandos disponíveis na instância 'calc':
  • calc.add(a, b)          -> Soma a + b
  • calc.subtract(a, b)     -> Subtrai a - b
  • calc.multiply(a, b)     -> Multiplica a * b
  • calc.divide(a, b)       -> Divide a / b (ZeroDivisionError se b=0)
  • calc.power(base, exp)   -> Potência base ^ exp
  • calc.square_root(n)     -> Raiz quadrada √n
  • calc.percentage(tot, %) -> Calcula porcentagem
  • calc.modulo(a, b)       -> Resto da divisão inteira a % b
  • calc.memory_store(v)    -> Salva valor na memória
  • calc.memory             -> Exibe valor da memória
  • calc.get_history()      -> Lista histórico de operações
  • calc.clear_history()    -> Limpa histórico
  • clear                   -> Limpa a tela do terminal`;
      setLines((prev) => [
        ...prev,
        inputLine,
        { id: Math.random().toString(), type: 'info', text: helpText },
      ]);
      setInputVal('');
      return;
    }

    let outputResult: { type: 'output' | 'error'; text: string };

    try {
      outputResult = processPythonInput(trimmed);
    } catch (err: unknown) {
      outputResult = {
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro na execução',
      };
    }

    setLines((prev) => [
      ...prev,
      inputLine,
      {
        id: Math.random().toString(),
        type: outputResult.type,
        text: outputResult.text,
      },
    ]);
    setInputVal('');
  };

  const processPythonInput = (input: string): { type: 'output' | 'error'; text: string } => {
    // 1. calc.add(a, b)
    const addMatch = input.match(/^calc\.add\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (addMatch) {
      const a = parseFloat(addMatch[1]);
      const b = parseFloat(addMatch[2]);
      const res = a + b;
      calcState.current.history.push({ operation: `${a} + ${b}`, result: res });
      return { type: 'output', text: res.toString() };
    }

    // 2. calc.subtract(a, b)
    const subMatch = input.match(/^calc\.subtract\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (subMatch) {
      const a = parseFloat(subMatch[1]);
      const b = parseFloat(subMatch[2]);
      const res = a - b;
      calcState.current.history.push({ operation: `${a} - ${b}`, result: res });
      return { type: 'output', text: res.toString() };
    }

    // 3. calc.multiply(a, b)
    const mulMatch = input.match(/^calc\.multiply\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (mulMatch) {
      const a = parseFloat(mulMatch[1]);
      const b = parseFloat(mulMatch[2]);
      const res = a * b;
      calcState.current.history.push({ operation: `${a} * ${b}`, result: res });
      return { type: 'output', text: res.toString() };
    }

    // 4. calc.divide(a, b)
    const divMatch = input.match(/^calc\.divide\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (divMatch) {
      const a = parseFloat(divMatch[1]);
      const b = parseFloat(divMatch[2]);
      if (b === 0) {
        return {
          type: 'error',
          text: `Traceback (most recent call last):
  File "calculator.py", line 63, in divide
ZeroDivisionError: Erro matemático: Divisão por zero não é permitida.`,
        };
      }
      const res = a / b;
      const formatted = Number.isInteger(res) ? `${res}.0` : res.toString();
      calcState.current.history.push({ operation: `${a} / ${b}`, result: res });
      return { type: 'output', text: formatted };
    }

    // 5. calc.power(base, exp)
    const powMatch = input.match(/^calc\.power\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (powMatch) {
      const base = parseFloat(powMatch[1]);
      const exp = parseFloat(powMatch[2]);
      const res = Math.pow(base, exp);
      calcState.current.history.push({ operation: `${base} ^ ${exp}`, result: res });
      return { type: 'output', text: res.toString() };
    }

    // 6. calc.square_root(n)
    const sqrtMatch = input.match(/^calc\.square_root\(\s*(-?\d+\.?\d*)\s*\)$/);
    if (sqrtMatch) {
      const n = parseFloat(sqrtMatch[1]);
      if (n < 0) {
        return {
          type: 'error',
          text: `Traceback (most recent call last):
  File "calculator.py", line 82, in square_root
ValueError: Erro matemático: Raiz quadrada de número negativo não permitida nos reais.`,
        };
      }
      const res = Math.sqrt(n);
      const formatted = Number.isInteger(res) ? `${res}.0` : res.toFixed(6);
      calcState.current.history.push({ operation: `√${n}`, result: res });
      return { type: 'output', text: formatted };
    }

    // 7. calc.percentage(a, b)
    const percMatch = input.match(/^calc\.percentage\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (percMatch) {
      const total = parseFloat(percMatch[1]);
      const percent = parseFloat(percMatch[2]);
      const res = (total * percent) / 100;
      calcState.current.history.push({ operation: `${percent}% de ${total}`, result: res });
      return { type: 'output', text: res.toString() };
    }

    // 8. calc.modulo(a, b)
    const modMatch = input.match(/^calc\.modulo\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
    if (modMatch) {
      const a = parseFloat(modMatch[1]);
      const b = parseFloat(modMatch[2]);
      if (b === 0) {
        return {
          type: 'error',
          text: `ZeroDivisionError: Erro matemático: Módulo por zero não é permitido.`,
        };
      }
      const res = a % b;
      return { type: 'output', text: res.toString() };
    }

    // 9. calc.get_history()
    if (input === 'calc.get_history()') {
      const hist = calcState.current.history;
      if (hist.length === 0) {
        return { type: 'output', text: '[]' };
      }
      const jsonStr = JSON.stringify(hist, null, 2);
      return { type: 'output', text: jsonStr };
    }

    // 10. calc.clear_history()
    if (input === 'calc.clear_history()') {
      calcState.current.history = [];
      return { type: 'output', text: 'None' };
    }

    // 11. calc.memory
    if (input === 'calc.memory') {
      return { type: 'output', text: `${calcState.current.memory}.0` };
    }

    // 12. calc.memory_store(x)
    const memStoreMatch = input.match(/^calc\.memory_store\(\s*(-?\d+\.?\d*)\s*\)$/);
    if (memStoreMatch) {
      const val = parseFloat(memStoreMatch[1]);
      calcState.current.memory = val;
      return { type: 'output', text: 'None' };
    }

    // 13. General arithmetic expression evaluation (e.g., 20 * 5 + 4)
    if (/^[0-9+\-*/().\s^%]+$/.test(input)) {
      try {
        const sanitized = input.replace(/\^/g, '**');
        // Safe evaluation of simple numbers and math signs
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        return { type: 'output', text: typeof res === 'number' ? res.toString() : String(res) };
      } catch {
        return {
          type: 'error',
          text: `SyntaxError: invalid syntax in expression '${input}'`,
        };
      }
    }

    return {
      type: 'error',
      text: `NameError: name '${input}' is not defined. Digite 'help()' para ver exemplos suportados.`,
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyCmds.length === 0) return;
      const nextIdx = historyIdx === -1 ? historyCmds.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(historyCmds[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx < historyCmds.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(historyCmds[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const copyTerminalOutput = () => {
    const fullText = lines
      .map((l) => {
        if (l.type === 'input') return `>>> ${l.text}`;
        return l.text;
      })
      .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickSnippets = [
    { label: 'calc.add(45, 55)', code: 'calc.add(45, 55)' },
    { label: 'calc.power(2, 10)', code: 'calc.power(2, 10)' },
    { label: 'calc.divide(100, 4)', code: 'calc.divide(100, 4)' },
    { label: 'calc.square_root(144)', code: 'calc.square_root(144)' },
    { label: 'calc.divide(10, 0) [Erro]', code: 'calc.divide(10, 0)' },
    { label: 'calc.percentage(200, 15)', code: 'calc.percentage(200, 15)' },
    { label: 'calc.get_history()', code: 'calc.get_history()' },
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Terminal Top Window Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            python3 -i calculator.py
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyTerminalOutput}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-800"
            title="Copiar histórico do terminal"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={() =>
              setLines([
                {
                  id: Math.random().toString(),
                  type: 'system',
                  text: 'Terminal resetado.',
                },
              ])
            }
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-800"
            title="Limpar tela"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Limpar</span>
          </button>
        </div>
      </div>

      {/* Quick Snippets Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1 flex-shrink-0 text-[11px]">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Exemplos rápidos:
        </span>
        {quickSnippets.map((snip, idx) => (
          <button
            key={idx}
            onClick={() => executeCommand(snip.code)}
            className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 font-mono text-[11px] border border-slate-700/60 transition-colors"
          >
            {snip.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen / Output */}
      <div className="p-4 font-mono text-xs md:text-sm max-h-[380px] min-h-[320px] overflow-y-auto space-y-2 select-text">
        {lines.map((l) => {
          if (l.type === 'system') {
            return (
              <div key={l.id} className="text-slate-400 leading-relaxed">
                {l.text}
              </div>
            );
          }
          if (l.type === 'info') {
            return (
              <pre
                key={l.id}
                className="text-cyan-300/90 whitespace-pre-wrap font-mono leading-relaxed bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-800/30"
              >
                {l.text}
              </pre>
            );
          }
          if (l.type === 'input') {
            return (
              <div key={l.id} className="flex items-start gap-2 text-slate-100">
                <span className="text-emerald-400 font-bold select-none">&gt;&gt;&gt;</span>
                <span className="text-white font-medium">{l.text}</span>
              </div>
            );
          }
          if (l.type === 'error') {
            return (
              <div
                key={l.id}
                className="text-red-400 whitespace-pre-wrap pl-6 border-l-2 border-red-500/50 py-0.5 leading-relaxed"
              >
                {l.text}
              </div>
            );
          }
          return (
            <div key={l.id} className="text-emerald-400 font-semibold pl-6 whitespace-pre-wrap">
              {l.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Input */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center gap-2">
        <span className="text-emerald-400 font-mono font-bold pl-2 select-none">&gt;&gt;&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite um comando em Python, ex: calc.add(10, 5) ou 15 * 8..."
          className="flex-1 bg-transparent text-slate-100 font-mono text-xs md:text-sm outline-none placeholder:text-slate-600"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Executar</span>
        </button>
      </div>
    </div>
  );
}
