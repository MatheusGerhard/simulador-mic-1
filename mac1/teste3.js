import ControlUnit from './controlUnit.js';
import Clock from './componentes/clock.js';

const clock = new Clock();
const uc = new ControlUnit();

// Injeção de instruções na RAM (Opcodes: LOCO, STOD, ADDD, SUBD, JUMP)
uc.ram.write(0, "0111000001100100"); // LOCO 100
uc.ram.write(1, "0001000000110010"); // STOD 50 (m[50] = 100)
uc.ram.write(2, "0111000011001000"); // LOCO 200
uc.ram.write(3, "0010000000110010"); // ADDD 50 (AC = 200 + 100 = 300)
uc.ram.write(4, "0001000000110011"); // STOD 51 (m[51] = 300)
uc.ram.write(5, "0111000000110010"); // LOCO 50
uc.ram.write(6, "0011000000110011"); // SUBD 51 (AC = 50 - 300 = -250)
uc.ram.write(7, "0001000000110100"); // STOD 52 (m[52] = -250)
uc.ram.write(8, "0110000000000000"); // JUMP 0

// Configura PC inicial
uc.regs.write(0, "0000000000000000"); // PC = 0

// Ajusta velocidade para visualização dos ciclos
clock.setVelocidade(500); 

clock.iniciar(uc);
