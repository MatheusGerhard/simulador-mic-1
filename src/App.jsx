import './App.css'
import Header from './components/Header';
import Instructions from './components/instructions';
import Memory from './components/memory';
import Simulation from './components/SImulation';

export default function App() {

  return (
    <>
      <Header/>
      <main>
        <Memory/>
        <Simulation/>
        <Instructions/>
      </main>
    </>
  )
}
