import './App.css'
import Header from './components/Header';
import Instructions from './components/instructions';
import Memory from './components/memory';
import Simulation from './components/SImulation';
import { MacProvider } from './context/MacContext';

export default function App() {

  return (
    <>
      <Header/>
      <main>
        <MacProvider>
          <Memory/>
          <Simulation/>
          <Instructions/>
        </MacProvider>
      </main>
    </>
  )
}
