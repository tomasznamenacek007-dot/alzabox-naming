export default async function handler(req, res) {
  const { gps } = req.query

  if (!gps) {
    return res.status(400).json({ error: 'Chybí GPS' })
  }

  try {
    const response = await fetch(
      `https://api.mapy.cz/v1/rgeocode?lon=${gps.split(',')[1]}&lat=${gps.split(',')[0]}`,
      {
        headers: {
          'X-Mapy-Api-Key': process.env.VITE_MAPY_API_KEY
        }
      }
    )

    const data = await response.json()

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Chyba API' })
  }
}
