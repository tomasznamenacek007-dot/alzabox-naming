export default async function handler(req, res) {
  const { gps } = req.query

  if (!gps) {
    return res.status(400).json({ error: 'Chybí GPS' })
  }

  try {
    const [lat, lon] = gps.split(',')

    // Reverse geocoding
    const geoResponse = await fetch(
      `https://api.mapy.cz/v1/rgeocode?lon=${lon}&lat=${lat}`,
      {
        headers: {
          'X-Mapy-Api-Key': process.env.MAPY_API_KEY
        }
      }
    )

    const geoData = await geoResponse.json()

    // Hledání POI v okolí
    const poiResponse = await fetch(
      `https://api.mapy.cz/v1/suggest?lon=${lon}&lat=${lat}&limit=5`,
      {
        headers: {
          'X-Mapy-Api-Key': process.env.MAPY_API_KEY
        }
      }
    )

    const poiData = await poiResponse.json()

    res.status(200).json({
      geo: geoData,
      poi: poiData
    })

  } catch (err) {
    res.status(500).json({
      error: 'Chyba API',
      detail: err.message
    })
  }
}
