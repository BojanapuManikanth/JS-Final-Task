
let allProducts = [];
let filteredProducts = [];
let cart = [];

// FETCH API
fetch('https://fakestoreapi.com/products')
.then(res => res.json())
.then(data => {
  document.getElementById("loader").style.display = "none";
  allProducts = data;
  filteredProducts = data;
  displayProducts(data);
})
.catch(() => {
  document.getElementById("loader").innerText = "Error loading data!";
});

// DISPLAY PRODUCTS
function displayProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.map(p => {
    const div = document.createElement("div");
    div.className = "card";
    const stars = "⭐".repeat(Math.round(p.rating.rate));
    

    div.innerHTML = `
      <img src="${p.image}" />
      <h4>${p.title.substring(0,50)}</h4>
      <p><strong>Price:</strong> $ ${p.price}</p>
      <p><strong>Category: </strong>${p.category}</p>
      <p><strong>Rating:</strong> ${stars} (${p.rating.rate})</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      
    `;

    container.appendChild(div);
  });
}

// SEARCH
document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(value) ||
    p.category.toLowerCase().includes(value)
  );

  displayProducts(filteredProducts);
});

// CATEGORY FILTER
document.getElementById("category").addEventListener("change", e => {
  const value = e.target.value;

  filteredProducts = value
    ? allProducts.filter(p => p.category === value)
    : allProducts;

  displayProducts(filteredProducts);
});

// SORT
function sortLow() {
  filteredProducts.sort((a,b) => a.price - b.price);
  displayProducts(filteredProducts);
}

function sortHigh() {
  filteredProducts.sort((a,b) => b.price - a.price);
  displayProducts(filteredProducts);
}

// CART
function addToCart(id) {
  const item = cart.find(p => p.id === id);

  if(item) {
    item.qty++;
  } else {
    const product = allProducts.find(p => p.id === id);
    cart.push({...product, qty:1});
  }

  updateCart();
}

// REMOVE
function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  updateCart();
}

// UPDATE CART
function updateCart() {
  document.getElementById("cart-count").innerText = cart.length;

  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  cart.map(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span>${item.title.substring(0,20)} x${item.qty}</span>
      <span>$${item.price}</span>
      <button onclick="removeItem(${item.id})">❌</button>
    `;

    container.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("total").innerText = total.toFixed(2);
}