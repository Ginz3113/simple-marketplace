let products = []

async function login(){
const password = document.getElementById('password').value

const res = await fetch('/api/admin-login',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({password})
})

const data = await res.json()

if(data.success){
document.getElementById('loginPage').style.display = 'none'
document.getElementById('adminPanel').style.display = 'block'
loadProducts()
}else{
alert('Password salah')
}
}

async function loadProducts(){
const res = await fetch('/api/products')
products = await res.json()

document.getElementById('adminProducts').innerHTML = products.map(p => `
<div>
<h3>${p.name}</h3>
<p>Rp ${p.price}</p>

<button onclick="deleteProduct(${p.id})">
Hapus
</button>
</div>
`).join('')
}

async function addProduct(){
const product = {
name: document.getElementById('name').value,
price: document.getElementById('price').value,
image: document.getElementById('image').value,
description: document.getElementById('description').value
}

await fetch('/api/products',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify(product)
})

loadProducts()
}

async function deleteProduct(id){
await fetch(`/api/products/${id}`,{
method:'DELETE'
})

loadProducts()
}