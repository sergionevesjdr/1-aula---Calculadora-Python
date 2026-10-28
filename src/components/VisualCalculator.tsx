/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  RotateCcw,
  Delete,
  Terminal,
  History,
  Check,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  operation: string;
  result: number | string;
  pythonCall: string;
  timestamp: string;
  isError?: boolean;
}

export function VisualCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);
  const [lastPythonCode, setLastPythonCode] = useState<string>(
    'calc = Calculator() # Inicializado'
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      operation: '12 + 8',
      result: 20,
      pythonCall: 'calc.add(12, 8) -> 20',
      timestamp: 'Exemplo',
    },
    {
      id: 'init-2',
      operation: '2 ^ 8',
      result: 256,
      pythonCall: 'calc.power(2, 8) -> 256',
      timestamp: 'Exemplo',
    },
  ]);

  const recordHistory = (
    opText: string,
    res: number | string,
    pyCode: string,
    err = false
  ) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      operation: opText,
      result: res,
      pythonCall: pyCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isError: err,
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
    setLastPythonCode(pyCode);
  };

  const handleDigit = (digit: string) => {
    if (isError) {
      setDisplay(digit);
      setIsError(false);
      setIsNewNumber(false);
      return;
    }

    if (isNewNumber) {
      setDisplay(digit === '.' ? '0.' : digit);
      setIsNewNumber(false);
    } else {
      if (digit === '.' && display.includes('.')) return;
      if (display === '0' && digit !== '.') {
        setDisplay(digit);
      } else {
        setDisplay(display + digit);
      }
    }
  };

  const executeMath = (op: string, a: number, b: number) => {
    switch (op) {
      case '+': {
        const res = a + b;
        recordHistory(`${a} + ${b}`, res, `calc.add(${a}, ${b}) -> ${res}`);
        return res;
      }
      case '-': {
        const res = a - b;
        recordHistory(`${a} - ${b}`, res, `calc.subtract(${a}, ${b}) -> ${res}`);
        return res;
      }
      case '×':
      case '*': {
        const res = a * b;
        recordHistory(`${a} × ${b}`, res, `calc.multiply(${a}, ${b}) -> ${res}`);
        return res;
      }
      case '÷':
      case '/': {
        if (b === 0) {
          throw new Error('ZeroDivisionError: Não é permitida divisão por zero!');
        }
        const res = Number((a / b).toFixed(8));
        const cleanRes = Number.isInteger(res) ? res : parseFloat(res.toString());
        recordHistory(`${a} ÷ ${b}`, cleanRes, `calc.divide(${a}, ${b}) -> ${cleanRes}`);
        return cleanRes;
      }
      case '^': {
        const res = Math.pow(a, b);
        recordHistory(`${a} ^ ${b}`, res, `calc.power(${a}, ${b}) -> ${res}`);
        return res;
      }
      case '%': {
        const res = (a * b) / 100;
        recordHistory(`${b}% de ${a}`, res, `calc.percentage(${a}, ${b}) -> ${res}`);
        return res;
      }
      default:
        return b;
    }
  };

  const handleOperator = (op: string) => {
    if (isError) return;
    const current = parseFloat(display);

    if (previousValue !== null && pendingOp && !isNewNumber) {
      try {
        const result = executeMath(pendingOp, previousValue, current);
        setDisplay(result.toString());
        setPreviousValue(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro no cálculo';
        setIsError(true);
        setDisplay('Erro');
        setStatusMessage(msg);
        recordHistory(`${previousValue} ${pendingOp} ${current}`, 'Erro', msg, true);
        setPreviousValue(null);
        setPendingOp(null);
        return;
      }
    } else {
      setPreviousValue(current);
    }

    setPendingOp(op);
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    if (isError || previousValue === null || pendingOp === null) return;
    const current = parseFloat(display);

    try {
      const result = executeMath(pendingOp, previousValue, current);
      setDisplay(result.toString());
      setPreviousValue(null);
      setPendingOp(null);
      setIsNewNumber(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro no cálculo';
      setIsError(true);
      setDisplay('Erro');
      setStatusMessage(msg);
      recordHistory(`${previousValue} ${pendingOp} ${current}`, 'Erro', msg, true);
      setPreviousValue(null);
      setPendingOp(null);
    }
  };

  const handleSquareRoot = () => {
    const val = parseFloat(display);
    if (val < 0) {
      setIsError(true);
      setDisplay('Erro');
      setStatusMessage('ValueError: Raiz quadrada de número negativo não permitida nos números reais.');
      recordHistory(`√(${val})`, 'Erro', `calc.square_root(${val}) -> ValueError`, true);
      return;
    }
    const res = Number(Math.sqrt(val).toFixed(8));
    const clean = Number.isInteger(res) ? res : parseFloat(res.toString());
    setDisplay(clean.toString());
    setIsNewNumber(true);
    recordHistory(`√${val}`, clean, `calc.square_root(${val}) -> ${clean}`);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setPendingOp(null);
    setIsNewNumber(true);
    setIsError(false);
    setStatusMessage(null);
    setLastPythonCode('# Calculadora reiniciada');
  };

  const handleBackspace = () => {
    if (isError || isNewNumber) return;
    if (display.length <= 1) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    if (isError) return;
    const val = parseFloat(display);
    if (val === 0) return;
    const toggled = -val;
    setDisplay(toggled.toString());
    setLastPythonCode(`calc.multiply(${val}, -1) -> ${toggled}`);
  };

  // Memory functions
  const handleMemoryAdd = () => {
    const current = parseFloat(display);
    const updated = memory + current;
    setMemory(updated);
    setStatusMessage(`M+ adicionado: ${current} (Memória total: ${updated})`);
    setLastPythonCode(`calc.memory_add(${current}) # memory = ${updated}`);
  };

  const handleMemorySub = () => {
    const current = parseFloat(display);
    const updated = memory - current;
    setMemory(updated);
    setStatusMessage(`M- subtraído: ${current} (Memória total: ${updated})`);
    setLastPythonCode(`calc.memory_subtract(${current}) # memory = ${updated}`);
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setIsNewNumber(true);
    setStatusMessage(`Valor da memória recuperado: ${memory}`);
    setLastPythonCode(`calc.memory -> ${memory}`);
  };

  const handleMemoryClear = () => {
    setMemory(0);
    setStatusMessage('Memória limpa (0.0)');
    setLastPythonCode('calc.memory_clear() # memory = 0.0');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Calculator Body */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              Py
            </div>
            <div>
              <h3 className="text-white font-semibold text-base leading-tight">
                Calculadora Interativa
              </h3>
              <p className="text-xs text-slate-400">
                Lógica mapeada 1:1 com <code className="text-emerald-400 font-mono">calculator.py</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono transition-colors ${
                memory !== 0
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              M: {memory}
            </span>
          </div>
        </div>

        {/* Screen / Display */}
        <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 mb-5 text-right relative min-h-[105px] flex flex-col justify-end">
          {/* Previous Operation breadcrumb */}
          <div className="text-xs font-mono text-slate-400 h-5 overflow-hidden text-ellipsis whitespace-nowrap">
            {previousValue !== null && (
              <span>
                {previousValue} {pendingOp} {isNewNumber ? '' : display}
              </span>
            )}
          </div>

          {/* Main Number Display */}
          <div
            className={`font-mono font-bold tracking-tight select-all truncate ${
              isError
                ? 'text-red-400 text-3xl'
                : display.length > 12
                ? 'text-2xl text-white'
                : 'text-4xl text-white'
            }`}
          >
            {display}
          </div>

          {/* Subtext info or Error */}
          {statusMessage && (
            <div className="text-[11px] text-amber-400/90 mt-1 truncate flex items-center justify-end gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Memory Bar */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <button
            onClick={handleMemoryClear}
            className="py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors border border-slate-700/50"
            title="Memory Clear (MC)"
          >
            MC
          </button>
          <button
            onClick={handleMemoryRecall}
            className="py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors border border-slate-700/50"
            title="Memory Recall (MR)"
          >
            MR
          </button>
          <button
            onClick={handleMemoryAdd}
            className="py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 transition-colors border border-slate-700/50"
            title="Memory Add (M+)"
          >
            M+
          </button>
          <button
            onClick={handleMemorySub}
            className="py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 transition-colors border border-slate-700/50"
            title="Memory Subtract (M-)"
          >
            M-
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="h-12 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-bold border border-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">AC</span>
          </button>
          <button
            onClick={handleSquareRoot}
            className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-lg border border-slate-700/60 transition-all active:scale-95"
            title="calc.square_root(x)"
          >
            √
          </button>
          <button
            onClick={() => handleOperator('^')}
            className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-base border border-slate-700/60 transition-all active:scale-95"
            title="calc.power(a, b)"
          >
            xʸ
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className="h-12 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xl border border-emerald-500/30 transition-all active:scale-95"
            title="calc.divide(a, b)"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit('7')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('×')}
            className="h-12 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xl border border-emerald-500/30 transition-all active:scale-95"
            title="calc.multiply(a, b)"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit('4')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className="h-12 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-2xl border border-emerald-500/30 transition-all active:scale-95"
            title="calc.subtract(a, b)"
          >
            −
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit('1')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className="h-12 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xl border border-emerald-500/30 transition-all active:scale-95"
            title="calc.add(a, b)"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={handleToggleSign}
            className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-semibold text-base border border-slate-700/40 transition-all active:scale-95"
          >
            ±
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-mono font-semibold text-lg border border-slate-700/40 transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono font-bold text-xl border border-slate-700/40 transition-all active:scale-95"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            =
          </button>
        </div>

        {/* Quick Operations Bar (Modulo, Backspace, Percentage) */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => handleOperator('%')}
            className="py-2 text-xs font-mono font-medium rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/40 transition-colors"
            title="calc.percentage(total, percent)"
          >
            % Porcentagem
          </button>
          <button
            onClick={handleBackspace}
            className="py-2 text-xs font-mono font-medium rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/40 transition-colors flex items-center justify-center gap-1"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Apagar</span>
          </button>
          <button
            onClick={() => {
              setDisplay('10');
              setPreviousValue(10);
              setPendingOp('÷');
              setDisplay('0');
              setIsNewNumber(false);
            }}
            className="py-2 text-xs font-mono font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            title="Simular teste de divisão por zero"
          >
            Testar ÷ 0
          </button>
        </div>
      </div>

      {/* Side Column: Python Execution Inspector & History */}
      <div className="lg:col-span-5 space-y-4">
        {/* Python Inspector Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Chamada Python Equivalente</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              Live Python
            </span>
          </div>

          <div className="mt-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 font-mono text-xs">
            <div className="text-slate-500 mb-1"># Método invocado em calculator.py:</div>
            <div className="text-emerald-300 break-all select-all font-semibold">
              {lastPythonCode}
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 text-xs text-slate-400 bg-slate-800/30 p-2.5 rounded-lg border border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              Cada clique aciona as mesmas regras de validação e tipagem que você encontra no arquivo{' '}
              <code className="text-slate-200 font-mono">calculator.py</code>.
            </span>
          </div>
        </div>

        {/* History Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <History className="w-4 h-4 text-slate-400" />
              <span>Histórico de Cálculos</span>
              <span className="text-xs text-slate-500 font-mono">({history.length})</span>
            </div>

            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Nenhum cálculo registrado ainda.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (typeof item.result === 'number') {
                      setDisplay(item.result.toString());
                      setIsNewNumber(true);
                    }
                  }}
                  className="group bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 rounded-xl p-2.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-mono">{item.operation}</span>
                    <span
                      className={`font-mono font-bold ${
                        item.isError ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      = {item.result}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-mono">
                    <span className="truncate max-w-[200px] text-slate-400">
                      {item.pythonCall}
                    </span>
                    <span className="text-[10px]">{item.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
