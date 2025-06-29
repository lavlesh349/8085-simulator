﻿# project-8085
# 8085 Simulator

A simple 8085 microprocessor simulator that allows users to write, execute, and visualize basic 8085 assembly language programs. This tool is designed for students and enthusiasts to understand the working of the Intel 8085 microprocessor through simulation.

---

## 🧠 Overview

The **8085 Simulator** mimics the behavior of the Intel 8085 microprocessor by executing instructions step-by-step and simulating register-level operations.

### 💡 Key Features:
- Supports a basic set of 8085 instructions (MOV, MVI, ADD, SUB, INR, DCR, JMP, HLT, etc.)
- Displays the state of registers (A, B, C, D, E, H, L) and flags (Z, S, P, CY, AC)
- Visual memory view and address-based data manipulation
- Step-by-step execution to trace how the program flows
- Debugging support to monitor register and flag changes after each instruction

---

## 🔧 How It Works

1. **Code Input:**  
   Users input 8085 assembly language instructions into the code editor or load from a file.

2. **Parsing:**  
   The simulator parses each instruction line and converts it into an internal representation for processing.

3. **Execution Engine:**  
   - Instructions are executed sequentially unless affected by control flow operations like `JMP` or `CALL`.
   - Register and memory updates are performed in real time.
   - Flags are updated based on the result of arithmetic or logical operations.

4. **Memory & Register Simulation:**  
   - Simulates 64KB memory space (0x0000 to 0xFFFF).
   - Registers (A, B, C, D, E, H, L) and flag register are updated after each instruction.

5. **Output:**  
   After execution, the simulator displays:
   - Final state of registers and flags
   - Modified memory contents
   - Optionally, a trace of instruction execution steps

---

## 📦 Installation

Clone the repository:
```bash
git clone https://github.com/your-username/8085-simulator.git
cd 8085-simulator
