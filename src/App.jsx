import './App.css'
import Memory from './components/memory'
import memoria from '../processador/Memory'
export default function App() {

  function handleClick(){
    memoria.write(4095, 1)
  }

  return (
    <>
      <div className='Titulo'>
        TRABALHO ARQ: SIMULADOR-MIC-1
      </div>
      <Memory/>
      <button onClick={handleClick}>Botão</button>
    </>
  )
}
