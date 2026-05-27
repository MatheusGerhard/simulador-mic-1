// main.js - O Inicializador do Sistema
import memoria from './memory.js';
import pc from './pc.js';
import ControlUnit from './controlUnit.js';
// (Outros registradores serão importados aqui depois)


// 1. Instancia a Unidade de Controle (O MPC nasce em 0 lá dentro)
const conuni = new ControlUnit();

console.log("Processador ligado. Iniciando ciclo de clock...");

// 3. O Loop do Relógio (Clock)
let simulacaoAtiva = true;

while (simulacaoAtiva) {
    // A cada repetição, é um pulso de clock que executa uma linha da sua tabela
    ulaControle.rodaCiclo();
    
    // Condição temporária para não travar o seu PC no teste inicial
    if (pc.read() > 5) { 
        simulacaoAtiva = false; 
    }
}

console.log("Simulação finalizada.");