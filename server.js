const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const nodemailer = require('nodemailer')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

const ADMIN_PASSWORD = 'admin123'

function readProducts() {
  return JSON.parse(fs.readFileSync('./products.json'))
}

function saveProducts(data) {
  fs.writeFileSync('./products.json', JSON.stringify(data, null, 2))
}

app.get('/api/products', (req, res) => {
  res.json(readProducts())
})

app.post('/api/products', (req, res) => {
  const products = readProducts()

  const newProduct = {
    id: Date.now(),
    ...req.body
  }

  products.push(newProduct)
  saveProducts(products)

  res.json({ success: true })
})

app.delete('/api/products/:id', (req, res) => {
  const products = readProducts()
  const filtered = products.filter(p => p.id != req.params.id)

  saveProducts(filtered)

  res.json({ success: true })
})

app.post('/api/admin-login', (req, res) => {
  const { password } = req.body

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true })
  } else {
    res.json({ success: false })
  }
})

app.post('/api/checkout', async (req, res) => {
  const { name, cart, total } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'giant.ibnu31@gmail.com',
      pass: 'vztmdbpotptmeugq'
    }
  })

  const items = cart.map(item =>
    `${item.name} x${item.qty} - Rp ${item.price * item.qty}`
  ).join('\n')

  const mailOptions = {
    from: 'giant.ibnu31@gmail.com',
    to: 'giant.ibnu31@gmail.com',
    subject: 'Pesanan Marketplace Baru',
    text: `Nama Pemesan: ${name}\n\nPesanan:\n${items}\n\nTotal: Rp ${total}`
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.json({ success: false })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
