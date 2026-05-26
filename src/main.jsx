import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [gps, setGps] = useState('')
  const [vysledek, setVysledek] = useState('')

  function vytvorNazev(data) {
    const geoItem = data?.geo?.items?.[0]
    const poiItem = data?.poi?.items?.[0]

    const adresa =
      geoItem?.name ||
      geoItem?.label ||
      geoItem?.address?.formatted ||
      ''

    const poi =
      poiItem?.name ||
      poiItem?.title ||
      poiItem?.label ||
      ''

    if (poi && adresa) return `${adresa} (${poi})`
    if (poi) return poi
    if (adresa) return adresa

    return 'Nenalezena lokalita'
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

      setVysledek(vytvorNazev(data))

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

      <button onClick={generovatNazev} style={{ padding: '10px' }}>
        Generovat název
      </button>

      <div style={{ marginTop: '30px', fontSize: '24px', fontWeight: 'bold' }}>
        {vysledek}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
