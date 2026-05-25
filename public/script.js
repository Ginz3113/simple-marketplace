let products = []
let cart = []

async function loadProducts(){
const res = await fetch('/api/products')
products = await res.json()
renderProducts()
}

function renderProducts(){
document.getElementById('products').innerHTML = products.map(product => `
<div class="product">
<img src="${product.image}">

<div class="product-info">
<h3>${product.name}</h3>
<p>Rp ${product.price}</p>

<button onclick="showProduct(${product.id})">
Lihat
</button>
</div>
</div>
`).join('')
}

function showProduct(id){
const product = products.find(p => p.id == id)

document.getElementById('popup').style.display = 'flex'

document.getElementById('popupContent').innerHTML = `
<img src="${product.image}">
<h2>${product.name}</h2>
<p>${product.description}</p>
<h3>Rp ${product.price}</h3>

<button
class="add-cart-btn"
onclick="addToCart(${product.id}, this)">
  Tambah ke Keranjang
</button>
`
}

window.onclick = function(e){
const popup = document.getElementById('popup')
if(e.target == popup){
popup.style.display = 'none'
}
}

function addToCart(id, btn){

  const product = products.find(p => p.id == id)

  const existing = cart.find(c => c.id == id)

  if(existing){
    existing.qty++
  } else {
    cart.push({...product, qty:1})
  }

  renderCart()

  btn.classList.add('clicked')

  const originalText = btn.innerHTML

  btn.innerHTML = '✓ Ditambahkan'

  setTimeout(()=>{

    btn.classList.remove('clicked')

    btn.innerHTML = originalText

  },700)
}

function renderCart(){
document.getElementById('cartItems').innerHTML = cart.map(item => `
<div>
<h4>${item.name}</h4>
<p>Qty: ${item.qty}</p>

<button onclick="changeQty(${item.id},1)">+</button>
<button onclick="changeQty(${item.id},-1)">-</button>
<button onclick="removeItem(${item.id})">Hapus</button>
</div>
`).join('')

const total = cart.reduce((a,b)=>a+(b.price*b.qty),0)
document.getElementById('total').innerText = `Total: Rp ${total}`
}

function changeQty(id,val){
const item = cart.find(c => c.id == id)
item.qty += val

if(item.qty <= 0){
cart = cart.filter(c => c.id != id)
}

renderCart()
}

function removeItem(id){
cart = cart.filter(c => c.id != id)
renderCart()
}

let cartOpen = false

function openCart(){

  const cart = document.getElementById('cart')
  const overlay = document.getElementById('overlay')

  if(cartOpen){

    cart.classList.remove('active')
    overlay.classList.remove('active')

    cartOpen = false

  } else {

    cart.classList.add('active')
    overlay.classList.add('active')

    cartOpen = true
  }
}

function closeCart(){

  document.getElementById('cart')
  .classList.remove('active')

  document.getElementById('overlay')
  .classList.remove('active')

  cartOpen = false
}

async function checkout(){
const name = document.getElementById('customerName').value

if(!name){
alert('Masukkan nama')
return
}

const total = cart.reduce((a,b)=>a+(b.price*b.qty),0)

const res = await fetch('/api/checkout',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
name,
cart,
total
})
})

const data = await res.json()

if(data.success){
alert('Pesanan berhasil dikirim')
cart = []
renderCart()
}else{
alert('Gagal mengirim')
}
}

loadProducts()
