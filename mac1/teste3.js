import ControlUnit from './controlUnit.js';
import Clock from './componentes/clock.js';



// Injeção de instruções na RAM (Opcodes: LOCO, STOD, ADDD, SUBD, JUMP)


const clock = new Clock();
const uc = new ControlUnit();



// Configura PC inicial
function executa(clock, uc){
    uc.regs.write(0, "0000000000000000"); // PC = 0

    // Ajusta velocidade para visualização dos ciclos
    clock.setVelocidade(250); 

    clock.iniciar(uc);
}

function pausa(clock){
    clock.pausar();
}

export {uc};
export default clock;
export {executa};   