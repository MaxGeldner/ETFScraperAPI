const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const etfEndpoint = require('./src/endpoints/etf/etf')

app.use(cors());

app.get('/etf', async (req, res) => {
  const isin = req.query.isin
  const etf = await etfEndpoint.getByISIN(isin)
  res.json(etf)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})