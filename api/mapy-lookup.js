export default async function handler(req, res) {
  const { gps } = req.query

  if (!gps) {
    return res.status(400).json({ error: 'Chybí GPS' })
  }

  try {
    const [latRaw, lonRaw] = gps.split(',')
    const lat = latRaw.trim()
    const lon = lonRaw.trim()

    const headers = {
      'X-Mapy-Api-Key': process.env.MAPY_API_KEY
    }

    const geoResponse = await fetch(
      `https://api.mapy.cz/v1/rgeocode?lon=${lon}&lat=${lat}&lang=cs`,
      { headers }
    )

    const geo = await geoResponse.json()

    const poiResponse = await fetch(
      `https://api.mapy.cz/v1/suggest?lat=${lat}&lon=${lon}&limit=10&type=poi`,
      { headers }
    )

    const poi = await poiResponse.json()

    res.status(200).json({
      geo,
      poi
    })
  } catch (err) {
    res.status(500).json({
      error: 'Chyba API',
      detail: err.message
    })
  }
}
