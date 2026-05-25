import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [gps, setGps] = useState('')
  const [vysledek, setVysledek] = useState('')

  async function generovatNazev() {
    if (!gps) {
      setVysledek('Zadej GPS souřadnice')
      return
    }

    try {
      const response = await fetch(
        `/api/mapy-lookup?gps=${encodeURIComponent(gps)}`
      )

      const data = await response.json()

      console.log('Mapy.cz odpověď:', data)

      const adresa =
        data?.items?.[0]?.name ||
        data?.items?.[0]?.label ||
        data?.result?.label ||
        data?.features?.[0]?.properties?.label ||
        JSON.stringify(data)

      let nazev = adresa
        .replace(/AlzaBox/gi, '')
        .replace(/,/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      setVysledek(nazev)

    } catch (err) {
      console.error(err)
      setVysledek('Chyba při načítání map')
    }
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1>Generátor názvů boxů</h1>

      <p>Aplikace běží správně 🙂</p>

      <input
        value={gps}
        onChange={(e) => setGps(e.target.value)}
        placeholder="50.0874511,14.420671"
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
