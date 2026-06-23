import './App.css'
import Header from './components/Header';
import Instructions from './components/instructions';
import SimulationLog from './components/simulationLog';
import Memory from './components/memory';
import Simulation from './components/SImulation';
import { MacProvider } from './context/MacContext';
import RaceComparison from './pages/RaceComparison';
import { useState } from 'react';

export default function App() {
  const [activeView, setActiveView] = useState("simulator");

  return (
    <>
      <main className={activeView === "race" ? "raceLayout" : "simulatorLayout"}>
        <MacProvider>
          <nav className="viewSwitch" aria-label="Selecionar tela">
            <button
              className={activeView === "simulator" ? "active" : ""}
              onClick={() => setActiveView("simulator")}
            >
              Simulador
            </button>
            <button
              className={activeView === "race" ? "active" : ""}
              onClick={() => setActiveView("race")}
            >
              Comparacao
            </button>
          </nav>

          {activeView === "race" ? (
            <RaceComparison/>
          ) : (
            <>
              <Memory/>
              <Simulation/>
              <Instructions/>
            </>
          )}

          <SimulationLog/>
        </MacProvider>
      </main>
    </>
  )
}
