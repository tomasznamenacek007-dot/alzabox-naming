import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [gps, setGps] = useState('')
  const [vysledek, setVysledek] = useState('')

  function vytvorNazev(adresa) {
    if (!adresa) return 'Neznámé místo'

    let text = adresa

    text = text.replace(/AlzaBox/gi, '')
    text = text.replace(/\s+/g, ' ').trim()

    return text
  }

  async function generovatNazev() {
    if (!gps) {
      setVysledek('Zadej GPS')
      return
    }

    try {
      const response = await fetch(
        `/api/mapy-lookup?gps=${encodeURIComponent(gps)}`
      )

      const data = await response.json()

      console.log(data)

      const item = data?.items?.[0]

      if (!item) {
        setVysledek('Nenalezena lokalita')
        return
      }

      const label =
        item.name ||
        item.label ||
        item.address?.formatted ||
        'Neznámé místo'

      const finalNazev = vytvorNazev(label)

      setVysledek(finalNazev)

    } catch (err) {
      console.error(err)
      setVysledek('Chyba při načítání')
    }
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px' }}>
      <h1>Generátor názvů boxů</h1>

      <input
        value={gps}
        onChange={(e) => setGps(e.target.value)}
        placeholder="50.0874511,14.420671"
        style={{
          padding: '10px',
          width: '320px',
          marginRight: '10px'
        }}
      />

      <button
        onClick={generovatNazev}
        style={{
          padding: '10px'
        }}
      >
        Generovat název
      </button>

      <div
        style={{
          marginTop: '30px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      >
        {vysledek}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
