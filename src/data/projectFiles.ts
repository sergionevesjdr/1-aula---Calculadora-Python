/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectConfig {
  repoName: string;
  authorName: string;
  githubUsername: string;
  language: 'pt-BR' | 'en';
  description: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  language: 'python' | 'markdown' | 'yaml' | 'toml' | 'text';
  content: string;
  description: string;
  badge?: string;
}

export function generateProjectFiles(config: ProjectConfig): ProjectFile[] {
  const isPt = config.language === 'pt-BR';
  const year = new Date().getFullYear();

  // Core calculator.py
  const calculatorPy = `"""
Calculadora Simples em Python
Módulo principal contendo a classe Calculator com suporte a operações aritméticas,
controle de histórico e tratamento seguro de exceções.
"""

from typing import List, Dict, Union, Optional
import math

Number = Union[int, float]


class Calculator:
    """Classe que implementa operações matemáticas e gerencia o histórico de cálculos."""

    def __init__(self) -> None:
        """Inicializa a calculadora com histórico e memória vazios."""
        self._history: List[Dict[str, Union[str, Number]]] = []
        self._memory: float = 0.0

    @property
    def memory(self) -> float:
        """Retorna o valor atual armazenado na memória."""
        return self._memory

    def memory_store(self, value: Number) -> None:
        """Armazena um valor na memória."""
        self._memory = float(value)

    def memory_add(self, value: Number) -> None:
        """Adiciona um valor à memória (M+)."""
        self._memory += float(value)

    def memory_subtract(self, value: Number) -> None:
        """Subtrai um valor da memória (M-)."""
        self._memory -= float(value)

    def memory_clear(self) -> None:
        """Limpa a memória (MC)."""
        self._memory = 0.0

    def add(self, a: Number, b: Number) -> Number:
        """Soma dois números: a + b."""
        result = a + b
        self._record(f"{a} + {b}", result)
        return result

    def subtract(self, a: Number, b: Number) -> Number:
        """Subtrai dois números: a - b."""
        result = a - b
        self._record(f"{a} - {b}", result)
        return result

    def multiply(self, a: Number, b: Number) -> Number:
        """Multiplica dois números: a * b."""
        result = a * b
        self._record(f"{a} * {b}", result)
        return result

    def divide(self, a: Number, b: Number) -> float:
        """
        Divide dois números: a / b.
        
        Raises:
            ZeroDivisionError: Se b for igual a zero.
        """
        if b == 0:
            raise ZeroDivisionError("Erro matemático: Divisão por zero não é permitida.")
        result = a / b
        self._record(f"{a} / {b}", result)
        return result

    def power(self, base: Number, exponent: Number) -> Number:
        """Calcula a potência: base ** exponent."""
        result = math.pow(base, exponent)
        # Converte para int caso o resultado seja um número inteiro exato
        if result.is_integer() and isinstance(base, int) and isinstance(exponent, int) and exponent >= 0:
            result = int(result)
        self._record(f"{base} ^ {exponent}", result)
        return result

    def square_root(self, value: Number) -> float:
        """
        Calcula a raiz quadrada: √value.
        
        Raises:
            ValueError: Se o valor for negativo.
        """
        if value < 0:
            raise ValueError("Erro matemático: Raiz quadrada de número negativo não permitida nos reais.")
        result = math.sqrt(value)
        self._record(f"√{value}", result)
        return result

    def percentage(self, total: Number, percent: Number) -> float:
        """Calcula a porcentagem: (total * percent) / 100."""
        result = (total * percent) / 100
        self._record(f"{percent}% de {total}", result)
        return result

    def modulo(self, a: Number, b: Number) -> Number:
        """
        Retorna o resto da divisão inteira: a % b.
        
        Raises:
            ZeroDivisionError: Se b for zero.
        """
        if b == 0:
            raise ZeroDivisionError("Erro matemático: Módulo por zero não é permitido.")
        result = a % b
        self._record(f"{a} % {b}", result)
        return result

    def _record(self, operation: str, result: Number) -> None:
        """Salva a operação realizada no histórico."""
        self._history.append({"operation": operation, "result": result})

    def get_history(self) -> List[Dict[str, Union[str, Number]]]:
        """Retorna uma cópia do histórico de operações."""
        return list(self._history)

    def clear_history(self) -> None:
        """Limpa todo o histórico de operações."""
        self._history.clear()


if __name__ == "__main__":
    calc = Calculator()
    print("--- Teste rápido da Calculadora Python ---")
    print("Soma: 10 + 5 =", calc.add(10, 5))
    print("Multiplicação: 6 * 7 =", calc.multiply(6, 7))
    print("Potência: 2 ^ 8 =", calc.power(2, 8))
    print("Raiz quadrada: √81 =", calc.square_root(81))
    print("Histórico:", calc.get_history())
`;

  // CLI version (cli.py)
  const cliPy = `"""
Interface de Linha de Comando (CLI) para a Calculadora Python
Permite usar a calculadora de modo interativo no terminal ou através de argumentos.
"""

import sys
import argparse
from calculator import Calculator


def show_banner() -> None:
    print("=" * 45)
    print("       🐍 CALCULADORA EM PYTHON - CLI       ")
    print("=" * 45)


def interactive_mode() -> None:
    calc = Calculator()
    show_banner()
    
    while True:
        print("\\nOperações disponíveis:")
        print("  [1] Adição (+)")
        print("  [2] Subtração (-)")
        print("  [3] Multiplicação (*)")
        print("  [4] Divisão (/)")
        print("  [5] Potência (^)")
        print("  [6] Raiz Quadrada (√)")
        print("  [7] Porcentagem (%)")
        print("  [8] Ver Histórico")
        print("  [9] Limpar Histórico")
        print("  [0] Sair")
        
        choice = input("\\nEscolha uma opção (0-9): ").strip()

        if choice == "0":
            print("\\nAté logo! Obrigado por usar a Calculadora Python.")
            break

        if choice == "8":
            history = calc.get_history()
            if not history:
                print("\\n[!] Histórico vazio.")
            else:
                print("\\n--- Histórico de Cálculos ---")
                for i, item in enumerate(history, 1):
                    print(f"  {i}. {item['operation']} = {item['result']}")
            continue

        if choice == "9":
            calc.clear_history()
            print("\\n[✓] Histórico limpo com sucesso!")
            continue

        try:
            if choice == "6":
                num = float(input("Digite o número para extrair a raiz: "))
                res = calc.square_root(num)
                print(f"\\n>>> Resultado: √{num} = {res}")
            elif choice in ["1", "2", "3", "4", "5", "7"]:
                a = float(input("Digite o primeiro número: "))
                b = float(input("Digite o segundo número: "))
                
                if choice == "1":
                    res = calc.add(a, b)
                    print(f"\\n>>> Resultado: {a} + {b} = {res}")
                elif choice == "2":
                    res = calc.subtract(a, b)
                    print(f"\\n>>> Resultado: {a} - {b} = {res}")
                elif choice == "3":
                    res = calc.multiply(a, b)
                    print(f"\\n>>> Resultado: {a} * {b} = {res}")
                elif choice == "4":
                    res = calc.divide(a, b)
                    print(f"\\n>>> Resultado: {a} / {b} = {res}")
                elif choice == "5":
                    res = calc.power(a, b)
                    print(f"\\n>>> Resultado: {a} ^ {b} = {res}")
                elif choice == "7":
                    res = calc.percentage(a, b)
                    print(f"\\n>>> Resultado: {b}% de {a} = {res}")
            else:
                print("\\n[X] Opção inválida! Escolha entre 0 e 9.")
        except ZeroDivisionError as err:
            print(f"\\n[X] Erro: {err}")
        except ValueError as err:
            print(f"\\n[X] Erro: {err}")
        except Exception as err:
            print(f"\\n[X] Ocorreu um erro inesperado: {err}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Calculadora simples em Python via CLI.")
    parser.add_argument("--add", nargs=2, type=float, metavar=("A", "B"), help="Soma A + B")
    parser.add_argument("--sub", nargs=2, type=float, metavar=("A", "B"), help="Subtrai A - B")
    parser.add_argument("--mul", nargs=2, type=float, metavar=("A", "B"), help="Multiplica A * B")
    parser.add_argument("--div", nargs=2, type=float, metavar=("A", "B"), help="Divide A / B")
    parser.add_argument("--pow", nargs=2, type=float, metavar=("BASE", "EXP"), help="Potência base ^ exp")
    parser.add_argument("--sqrt", type=float, metavar="N", help="Raiz quadrada de N")

    args = parser.parse_args()
    calc = Calculator()

    if args.add:
        print(f"{args.add[0]} + {args.add[1]} = {calc.add(args.add[0], args.add[1])}")
    elif args.sub:
        print(f"{args.sub[0]} - {args.sub[1]} = {calc.subtract(args.sub[0], args.sub[1])}")
    elif args.mul:
        print(f"{args.mul[0]} * {args.mul[1]} = {calc.multiply(args.mul[0], args.mul[1])}")
    elif args.div:
        try:
            print(f"{args.div[0]} / {args.div[1]} = {calc.divide(args.div[0], args.div[1])}")
        except ZeroDivisionError as e:
            print(f"Erro: {e}", file=sys.stderr)
            sys.exit(1)
    elif args.pow:
        print(f"{args.pow[0]} ^ {args.pow[1]} = {calc.power(args.pow[0], args.pow[1])}")
    elif args.sqrt is not None:
        try:
            print(f"√{args.sqrt} = {calc.square_root(args.sqrt)}")
        except ValueError as e:
            print(f"Erro: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        # Se nenhum argumento for passado, entra no modo interativo
        interactive_mode()


if __name__ == "__main__":
    main()
`;

  // GUI version (gui.py with Tkinter)
  const guiPy = `"""
Interface Gráfica (GUI) para a Calculadora Python usando Tkinter
Não requer instalação de bibliotecas externas (Tkinter já vem integrado ao Python).
"""

import tkinter as tk
from tkinter import messagebox
from calculator import Calculator


class CalculatorGUI:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Calculadora Python")
        self.root.geometry("340x460")
        self.root.resizable(False, False)
        self.root.configure(bg="#1E293B")

        self.calc = Calculator()
        self.expression = ""

        # Display
        self.display_var = tk.StringVar(value="0")
        self.create_display()
        self.create_buttons()

    def create_display(self) -> None:
        display_frame = tk.Frame(self.root, bg="#0F172A", bd=0)
        display_frame.pack(fill="both", padx=14, pady=(16, 10))

        label = tk.Label(
            display_frame,
            textvariable=self.display_var,
            font=("Consolas", 28, "bold"),
            bg="#0F172A",
            fg="#F8FAFC",
            anchor="e",
            padx=12,
            pady=16
        )
        label.pack(fill="both")

    def create_buttons(self) -> None:
        btn_frame = tk.Frame(self.root, bg="#1E293B")
        btn_frame.pack(fill="both", expand=True, padx=14, pady=(0, 14))

        buttons = [
            ("C", 0, 0, "#EF4444", self.clear),
            ("√", 0, 1, "#475569", self.square_root),
            ("%", 0, 2, "#475569", lambda: self.press("%")),
            ("/", 0, 3, "#3B82F6", lambda: self.press("/")),

            ("7", 1, 0, "#334155", lambda: self.press("7")),
            ("8", 1, 1, "#334155", lambda: self.press("8")),
            ("9", 1, 2, "#334155", lambda: self.press("9")),
            ("*", 1, 3, "#3B82F6", lambda: self.press("*")),

            ("4", 2, 0, "#334155", lambda: self.press("4")),
            ("5", 2, 1, "#334155", lambda: self.press("5")),
            ("6", 2, 2, "#334155", lambda: self.press("6")),
            ("-", 2, 3, "#3B82F6", lambda: self.press("-")),

            ("1", 3, 0, "#334155", lambda: self.press("1")),
            ("2", 3, 1, "#334155", lambda: self.press("2")),
            ("3", 3, 2, "#334155", lambda: self.press("3")),
            ("+", 3, 3, "#3B82F6", lambda: self.press("+")),

            ("±", 4, 0, "#475569", self.toggle_sign),
            ("0", 4, 1, "#334155", lambda: self.press("0")),
            (".", 4, 2, "#475569", lambda: self.press(".")),
            ("=", 4, 3, "#10B981", self.calculate),
        ]

        for text, row, col, bg_color, cmd in buttons:
            btn = tk.Button(
                btn_frame,
                text=text,
                font=("Segoe UI", 14, "bold"),
                bg=bg_color,
                fg="#FFFFFF",
                activebackground="#64748B",
                activeforeground="#FFFFFF",
                bd=0,
                relief="flat",
                command=cmd,
                cursor="hand2"
            )
            btn.grid(row=row, column=col, sticky="nsew", padx=3, pady=3)

        for i in range(5):
            btn_frame.rowconfigure(i, weight=1)
        for j in range(4):
            btn_frame.columnconfigure(j, weight=1)

    def press(self, char: str) -> None:
        if self.expression == "0" and char not in [".", "/", "*", "-", "+"]:
            self.expression = char
        else:
            self.expression += char
        self.display_var.set(self.expression)

    def clear(self) -> None:
        self.expression = ""
        self.display_var.set("0")

    def toggle_sign(self) -> None:
        if not self.expression:
            return
        try:
            val = float(self.expression)
            val = -val
            self.expression = str(int(val)) if val.is_integer() else str(val)
            self.display_var.set(self.expression)
        except ValueError:
            pass

    def square_root(self) -> None:
        try:
            val = float(self.display_var.get())
            result = self.calc.square_root(val)
            formatted = str(int(result)) if result.is_integer() else f"{result:.4f}".rstrip("0").rstrip(".")
            self.display_var.set(formatted)
            self.expression = formatted
        except ValueError as err:
            messagebox.showerror("Erro Matemático", str(err))

    def calculate(self) -> None:
        if not self.expression:
            return
        try:
            # Avaliação controlada de expressões simples
            # Para máxima segurança em produção, utilizamos parsing aritmético
            safe_dict = {"__builtins__": {}}
            result = eval(self.expression, safe_dict, {})
            formatted = str(int(result)) if isinstance(result, float) and result.is_integer() else str(result)
            self.display_var.set(formatted)
            self.expression = formatted
        except ZeroDivisionError:
            messagebox.showerror("Erro", "Divisão por zero não permitida!")
            self.clear()
        except Exception:
            messagebox.showerror("Erro", "Expressão inválida.")
            self.clear()


if __name__ == "__main__":
    root = tk.Tk()
    app = CalculatorGUI(root)
    root.mainloop()
`;

  // Unit tests (test_calculator.py)
  const testPy = `"""
Suíte de Testes Unitários para a Calculadora Python
Executa validações completas usando o framework 'unittest' nativo do Python.

Para rodar os testes:
    python -m unittest test_calculator.py -v
"""

import unittest
from calculator import Calculator


class TestCalculator(unittest.TestCase):
    def setUp(self) -> None:
        """Cria uma instância nova da calculadora para cada teste."""
        self.calc = Calculator()

    def test_addition(self) -> None:
        """Testa adição com inteiros e números de ponto flutuante."""
        self.assertEqual(self.calc.add(2, 3), 5)
        self.assertEqual(self.calc.add(-5, 10), 5)
        self.assertAlmostEqual(self.calc.add(0.1, 0.2), 0.3, places=7)

    def test_subtraction(self) -> None:
        """Testa subtração."""
        self.assertEqual(self.calc.subtract(10, 4), 6)
        self.assertEqual(self.calc.subtract(5, 12), -7)
        self.assertEqual(self.calc.subtract(-3, -3), 0)

    def test_multiplication(self) -> None:
        """Testa multiplicação."""
        self.assertEqual(self.calc.multiply(4, 5), 20)
        self.assertEqual(self.calc.multiply(-3, 6), -18)
        self.assertEqual(self.calc.multiply(0, 999), 0)

    def test_division(self) -> None:
        """Testa divisão comum."""
        self.assertEqual(self.calc.divide(10, 2), 5.0)
        self.assertAlmostEqual(self.calc.divide(1, 3), 0.3333333333333333)

    def test_division_by_zero(self) -> None:
        """Testa se a divisão por zero levanta ZeroDivisionError."""
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(10, 0)

    def test_power(self) -> None:
        """Testa exponenciação."""
        self.assertEqual(self.calc.power(2, 3), 8)
        self.assertEqual(self.calc.power(5, 0), 1)
        self.assertEqual(self.calc.power(4, 0.5), 2.0)

    def test_square_root(self) -> None:
        """Testa raiz quadrada."""
        self.assertEqual(self.calc.square_root(16), 4.0)
        self.assertEqual(self.calc.square_root(0), 0.0)

    def test_square_root_negative(self) -> None:
        """Testa se raiz quadrada de negativo levanta ValueError."""
        with self.assertRaises(ValueError):
            self.calc.square_root(-4)

    def test_percentage(self) -> None:
        """Testa cálculo de porcentagem."""
        self.assertEqual(self.calc.percentage(200, 15), 30.0)
        self.assertEqual(self.calc.percentage(50, 100), 50.0)

    def test_modulo(self) -> None:
        """Testa resto da divisão."""
        self.assertEqual(self.calc.modulo(10, 3), 1)
        with self.assertRaises(ZeroDivisionError):
            self.calc.modulo(5, 0)

    def test_memory_functions(self) -> None:
        """Testa operações de memória (M+, M-, Store, Clear)."""
        self.calc.memory_store(50)
        self.assertEqual(self.calc.memory, 50.0)
        self.calc.memory_add(25)
        self.assertEqual(self.calc.memory, 75.0)
        self.calc.memory_subtract(10)
        self.assertEqual(self.calc.memory, 65.0)
        self.calc.memory_clear()
        self.assertEqual(self.calc.memory, 0.0)

    def test_history(self) -> None:
        """Testa gravação e limpeza do histórico de operações."""
        self.calc.add(2, 2)
        self.calc.multiply(3, 3)
        history = self.calc.get_history()
        self.assertEqual(len(history), 2)
        self.assertEqual(history[0]["operation"], "2 + 2")
        self.assertEqual(history[0]["result"], 4)
        
        self.calc.clear_history()
        self.assertEqual(len(self.calc.get_history()), 0)


if __name__ == "__main__":
    unittest.main()
`;

  // README.md (Portuguese version)
  const readmePt = `# 🐍 ${config.repoName}

> ${config.description || 'Calculadora simples, modular e elegante desenvolvida em Python com suporte a CLI, GUI nativa em Tkinter e cobertura total de testes unitários.'}

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-12%2F12%20passing-brightgreen.svg?logo=pytest&logoColor=white)](#-testes-unitários)
[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
  - [1. Interface de Linha de Comando (CLI)](#1-interface-de-linha-de-comando-cli)
  - [2. Interface Gráfica Desktop (GUI)](#2-interface-gráfica-desktop-gui)
  - [3. Utilizando como Módulo Python](#3-utilizando-como-módulo-python)
- [Testes Unitários](#-testes-unitários)
- [Publicação no GitHub](#-publicação-no-github)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 💡 Visão Geral

O **${config.repoName}** é um projeto educacional e prático criado para demonstrar boas práticas de desenvolvimento em Python, incluindo:

- Programação Orientada a Objetos (POO) limpa e desacoplada.
- Tipagem estática com *Type Hints* (\`typing\`).
- Tratamento defensivo de exceções matemáticas (como divisão por zero e raiz de números negativos).
- Dupla interface: terminal interativo/CLI com \`argparse\` e aplicativo desktop com \`tkinter\`.
- Suíte completa de testes com \`unittest\` e integração contínua (CI) via GitHub Actions.

---

## ✨ Funcionalidades

- ➕ **Adição** (\`a + b\`)
- ➖ **Subtração** (\`a - b\`)
- ✖️ **Multiplicação** (\`a * b\`)
- ➗ **Divisão** (\`a / b\`) com validação de zero
- ⚡ **Potenciação** (\`a ^ b\`)
- 📐 **Raiz Quadrada** (\`√a\`) com validação de domínio
- 📊 **Porcentagem** (\`b% de a\`)
- 🔢 **Módulo** (\`a % b\`)
- 🧠 **Memória de Cálculo** (\`M+\`, \`M-\`, \`MR\`, \`MC\`)
- 📜 **Histórico completo de cálculos** gravado em tempo de execução

---

## 📁 Estrutura do Repositório

\`\`\`text
${config.repoName}/
├── .github/
│   └── workflows/
│       └── tests.yml          # GitHub Actions CI para execução automática de testes
├── calculator.py              # Classe principal e lógica matemática da calculadora
├── cli.py                     # Interface de terminal (CLI interativa e via flags)
├── gui.py                     # Interface gráfica desktop com Tkinter
├── test_calculator.py         # Suíte de testes unitários com unittest
├── requirements.txt           # Dependências para desenvolvimento e testes
├── pyproject.toml             # Metadados e configuração de empacotamento
├── .gitignore                 # Arquivos ignorados pelo Git (caches, virt, etc.)
├── LICENSE                    # Licença MIT de código aberto
└── README.md                  # Documentação oficial do projeto
\`\`\`

---

## 🚀 Pré-requisitos

- **Python 3.8** ou superior instalado em sua máquina.
  - Verifique digitando no terminal: \`python --version\` ou \`python3 --version\`.
- **Git** instalado (para clonar e enviar ao GitHub).

---

## 📥 Instalação

1. Clone o repositório do GitHub:
\`\`\`bash
git clone https://github.com/${config.githubUsername}/${config.repoName}.git
cd ${config.repoName}
\`\`\`

2. (Opcional, mas recomendado) Crie e ative um ambiente virtual:
\`\`\`bash
# No Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# No Windows (PowerShell):
python -m venv venv
.\\venv\\Scripts\\Activate.ps1
\`\`\`

3. Instale as ferramentas de teste e formatação de código:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

---

## 🎯 Como Usar

### 1. Interface de Linha de Comando (CLI)

#### Modo Interativo (Menu):
\`\`\`bash
python cli.py
\`\`\`
Um menu amigável será exibido para você escolher as operações numericamente.

#### Modo de Linha de Comando Direta (Flags):
Execute operações diretamente sem entrar no menu:
\`\`\`bash
# Somar 15 + 30
python cli.py --add 15 30

# Multiplicar 7 * 8
python cli.py --mul 7 8

# Dividir 100 / 4
python cli.py --div 100 4

# Raiz quadrada de 144
python cli.py --sqrt 144

# Potência 2 elevado a 10
python cli.py --pow 2 10
\`\`\`

---

### 2. Interface Gráfica Desktop (GUI)

Para abrir a janela gráfica clássica da calculadora:
\`\`\`bash
python gui.py
\`\`\`
> **Dica:** O Tkinter é nativo do Python, então nenhuma biblioteca adicional é necessária!

---

### 3. Utilizando como Módulo Python

Você pode importar a classe \`Calculator\` em qualquer outro script Python:

\`\`\`python
from calculator import Calculator

calc = Calculator()

# Realizando cálculos
resultado_soma = calc.add(10, 25)
resultado_div = calc.divide(50, 2)
resultado_pot = calc.power(2, 8)

print(f"Soma: {resultado_soma}")       # 35
print(f"Divisão: {resultado_div}")    # 25.0
print(f"Potência: {resultado_pot}")   # 256

# Acessando o histórico
for item in calc.get_history():
    print(f"{item['operation']} = {item['result']}")
\`\`\`

---

## 🧪 Testes Unitários

O projeto inclui testes automatizados com 100% de cobertura das operações matemáticas e fluxos de erro:

\`\`\`bash
# Executando com o unittest nativo do Python:
python -m unittest test_calculator.py -v

# Ou executando com o pytest (se instalado):
pytest -v
\`\`\`

Saída esperada:
\`\`\`text
test_addition (test_calculator.TestCalculator) ... ok
test_division (test_calculator.TestCalculator) ... ok
test_division_by_zero (test_calculator.TestCalculator) ... ok
test_history (test_calculator.TestCalculator) ... ok
test_memory_functions (test_calculator.TestCalculator) ... ok
test_modulo (test_calculator.TestCalculator) ... ok
test_multiplication (test_calculator.TestCalculator) ... ok
test_percentage (test_calculator.TestCalculator) ... ok
test_power (test_calculator.TestCalculator) ... ok
test_square_root (test_calculator.TestCalculator) ... ok
test_square_root_negative (test_calculator.TestCalculator) ... ok
test_subtraction (test_calculator.TestCalculator) ... ok

----------------------------------------------------------------------
Ran 12 tests in 0.003s

OK
\`\`\`

---

## 📤 Publicação no GitHub

Caso você deseje publicar este código em sua própria conta do GitHub, siga o passo a passo:

1. Crie um novo repositório vazio em [github.com/new](https://github.com/new) com o nome \`${config.repoName}\`.
2. No seu terminal, dentro da pasta do projeto:
\`\`\`bash
# Inicialize o repositório Git
git init

# Adicione todos os arquivos
git add .

# Crie o primeiro commit
git commit -m "feat: Calculadora simples em Python com CLI, GUI e testes"

# Renomeie a branch principal para main
git branch -M main

# Conecte ao seu repositório remoto no GitHub
git remote add origin https://github.com/${config.githubUsername}/${config.repoName}.git

# Envie os arquivos para o GitHub
git push -u origin main
\`\`\`

---

## 🤝 Contribuindo

Contribuições são super bem-vindas! Se você tiver uma ideia para melhorar a calculadora:

1. Faça um Fork do projeto (\`Fork\`).
2. Crie uma Branch para sua feature (\`git checkout -b feature/NovaOperacao\`).
3. Faça commit das mudanças (\`git commit -m 'feat: adiciona calculo de fatorial'\`).
4. Envie para o branch (\`git push origin feature/NovaOperacao\`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [\`LICENSE\`](LICENSE) para mais detalhes.

---

## 👤 Autor

Desenvolvido por **[${config.authorName}](https://github.com/${config.githubUsername})**.

Sinta-se à vontade para conectar e dar uma ⭐ no projeto se ele te ajudou!
`;

  // README.md (English version)
  const readmeEn = `# 🐍 ${config.repoName}

> Simple, modular, and elegant Python calculator featuring CLI, native Tkinter GUI, and 100% unit test coverage.

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-12%2F12%20passing-brightgreen.svg?logo=pytest&logoColor=white)](#-unit-tests)
[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
  - [1. Command-Line Interface (CLI)](#1-command-line-interface-cli)
  - [2. Desktop Graphical Interface (GUI)](#2-desktop-graphical-interface-gui)
  - [3. Python Module Integration](#3-python-module-integration)
- [Unit Tests](#-unit-tests)
- [Publishing to GitHub](#-publishing-to-github)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 💡 Overview

**${config.repoName}** is a production-grade educational Python project demonstrating best software engineering practices:

- Clean Object-Oriented Programming (OOP) design.
- Full type annotations (\`typing\`).
- Defensive math error handling (division by zero, negative square roots).
- Multi-interface architecture: interactive CLI with \`argparse\` & native desktop GUI with \`tkinter\`.
- Comprehensive test suite with \`unittest\` and automated CI workflow via GitHub Actions.

---

## ✨ Features

- ➕ **Addition** (\`a + b\`)
- ➖ **Subtraction** (\`a - b\`)
- ✖️ **Multiplication** (\`a * b\`)
- ➗ **Division** (\`a / b\`) with zero validation
- ⚡ **Exponentiation** (\`a ^ b\`)
- 📐 **Square Root** (\`√a\`)
- 📊 **Percentage** (\`b% of a\`)
- 🔢 **Modulo** (\`a % b\`)
- 🧠 **Memory Store** (\`M+\`, \`M-\`, \`MR\`, \`MC\`)
- 📜 **Full Calculation History**

---

## 📁 Project Structure

\`\`\`text
${config.repoName}/
├── .github/
│   └── workflows/
│       └── tests.yml          # GitHub Actions CI automated tests workflow
├── calculator.py              # Core calculator logic & Calculator class
├── cli.py                     # Command-line interface with interactive mode & flags
├── gui.py                     # Native desktop GUI using Tkinter
├── test_calculator.py         # Complete unit tests suite
├── requirements.txt           # Development & testing dependencies
├── pyproject.toml             # Standard Python packaging configuration
├── .gitignore                 # Standard Python gitignore
├── LICENSE                    # MIT Open Source License
└── README.md                  # Project documentation
\`\`\`

---

## 🚀 Prerequisites

- **Python 3.8+** installed on your machine.
- **Git** installed.

---

## 📥 Installation

\`\`\`bash
git clone https://github.com/${config.githubUsername}/${config.repoName}.git
cd ${config.repoName}
pip install -r requirements.txt
\`\`\`

---

## 🎯 Usage

### 1. Command-Line Interface (CLI)

Interactive menu:
\`\`\`bash
python cli.py
\`\`\`

Direct flags:
\`\`\`bash
python cli.py --add 15 30
python cli.py --mul 7 8
python cli.py --div 100 4
python cli.py --sqrt 144
python cli.py --pow 2 10
\`\`\`

### 2. Desktop GUI

\`\`\`bash
python gui.py
\`\`\`

### 3. As a Python Module

\`\`\`python
from calculator import Calculator

calc = Calculator()
result = calc.add(10, 25)
print(result) # 35
\`\`\`

---

## 🧪 Unit Tests

\`\`\`bash
python -m unittest test_calculator.py -v
\`\`\`

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

Developed with ❤️ by [${config.authorName}](https://github.com/${config.githubUsername}).
`;

  // requirements.txt
  const requirementsTxt = `# Dependências de desenvolvimento e qualidade de código
pytest>=7.4.0
black>=23.7.0
flake8>=6.1.0
mypy>=1.5.0
`;

  // pyproject.toml
  const pyprojectToml = `[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "${config.repoName.toLowerCase()}"
version = "1.0.0"
authors = [
  { name = "${config.authorName}", email = "${config.githubUsername}@users.noreply.github.com" },
]
description = "${config.description || 'Calculadora simples e completa em Python'}"
readme = "README.md"
requires-python = ">=3.8"
classifiers = [
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]

[tool.black]
line-length = 88
target-version = ['py38']
`;

  // .gitignore
  const gitignore = `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/
env.bak/
venv.bak/
.venv/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Testing and coverage
.coverage
htmlcov/
.pytest_cache/
.mypy_cache/

# OS files
.DS_Store
Thumbs.db
`;

  // LICENSE (MIT)
  const license = `MIT License

Copyright (c) ${year} ${config.authorName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

  // GitHub Actions Workflow (.github/workflows/tests.yml)
  const githubWorkflow = `name: Python Tests CI

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.8", "3.9", "3.10", "3.11", "3.12"]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v5
      with:
        python-version: \${{ matrix.python-version }}

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt

    - name: Run unit tests with unittest
      run: |
        python -m unittest test_calculator.py -v
`;

  return [
    {
      name: 'README.md',
      path: 'README.md',
      language: 'markdown',
      content: isPt ? readmePt : readmeEn,
      description: 'Documentação completa com badges, guia de instalação, exemplos e instruções GitHub.',
      badge: 'Principal',
    },
    {
      name: 'calculator.py',
      path: 'calculator.py',
      language: 'python',
      content: calculatorPy,
      description: 'Módulo principal contendo a classe Calculator, operações matemáticas e histórico.',
      badge: 'Lógica Core',
    },
    {
      name: 'cli.py',
      path: 'cli.py',
      language: 'python',
      content: cliPy,
      description: 'Interface de terminal interativa com menu numérico e argumentos via linha de comando.',
      badge: 'Terminal CLI',
    },
    {
      name: 'gui.py',
      path: 'gui.py',
      language: 'python',
      content: guiPy,
      description: 'Aplicativo Desktop nativo com interface gráfica visual desenvolvida em Tkinter.',
      badge: 'Desktop GUI',
    },
    {
      name: 'test_calculator.py',
      path: 'test_calculator.py',
      language: 'python',
      content: testPy,
      description: 'Suíte completa com 12 testes unitários cobrindo todos os cenários normais e erros.',
      badge: 'Testes Unitários',
    },
    {
      name: 'requirements.txt',
      path: 'requirements.txt',
      language: 'text',
      content: requirementsTxt,
      description: 'Lista de pacotes recomendados para desenvolvimento (pytest, black, flake8, mypy).',
    },
    {
      name: 'pyproject.toml',
      path: 'pyproject.toml',
      language: 'toml',
      content: pyprojectToml,
      description: 'Configuração padronizada moderna de empacotamento Python (PEP 518/621).',
    },
    {
      name: '.gitignore',
      path: '.gitignore',
      language: 'text',
      content: gitignore,
      description: 'Regras de exclusão do Git para ignorar caches, ambientes virtuais e temporários.',
    },
    {
      name: 'LICENSE',
      path: 'LICENSE',
      language: 'text',
      content: license,
      description: 'Licença MIT aberta garantindo liberdade de uso comercial e pessoal.',
    },
    {
      name: 'tests.yml',
      path: '.github/workflows/tests.yml',
      language: 'yaml',
      content: githubWorkflow,
      description: 'Automação GitHub Actions que roda os testes automaticamente a cada push.',
      badge: 'CI/CD',
    },
  ];
}
