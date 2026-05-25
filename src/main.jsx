import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [gps, setGps] = useState('')
  const [vysledek, setVysledek] = useState('')

  function generovatNazev() {
    if (!gps) {
      setVysledek('Zadej GPS souřadnice')
      return
    }

    const cast = gps.replace(',', '-')
    setVysledek('BOX-' + cast)
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1>Generátor názvů boxů</h1>

      <p>Aplikace běží správně 🙂</p>

      <input
        value={gps}
        onChange={(e) => setGps(e.target.value)}
        placeholder="Sem přijde GPS"
        style={{ padding: '10px', width: '300px' }}
      />

      <button
        onClick={generovatNazev}
        style={{ marginLeft: '10px', padding: '10px' }}
      >
        Generovat název
      </button>

      <h2 style={{ marginTop: '30px' }}>{vysledek}</h2>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
