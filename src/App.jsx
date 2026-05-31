import './App.css'
import Montador from '../montador/montador'
import Memory from './components/memory';
export default function App() {

  function handleClick(){
    let string = document.getElementById("codigo").value;
    

    let montador = new Montador(string);
  
    
    

    montador.main();
    montador.preencherMemoria();
    console.log(montador.macroinstrucoes);
    
  }

  return (
    <>
      <div className='Titulo'>
        TRABALHO ARQ: SIMULADOR-MIC-1
      </div>
      <textarea type="text" id='codigo' placeholder='Digite o código aqui...'/>
      <button onClick={handleClick}>Botão</button>
      <Memory/>
    </>
  )
}
