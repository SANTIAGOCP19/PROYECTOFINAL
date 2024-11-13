import { products } from "./products.js";

const KEY_CARRITO = "carrito";
let carrito = JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];

const productListContainer = document.getElementById("lista-de-productos");
const detailContainer = document.getElementById("detalle-producto");
const filterSelect = document.getElementById("selector-categoria");
const maxPriceInput = document.getElementById("rango-precio");

let currentProducts = products;
let startIndex = 0;
const productsPerLoad = 15;
let isLoading = false;

function guardarCarrito() {
  localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
}

function renderProducts(productsToRender) {
  productListContainer.innerHTML += productsToRender
    .map(
      (producto) => `
      <article class="product-item">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto">
        <h2>${producto.nombre}</h2>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <button class="ver-detalle" data-id="${producto.id}">Ver Detalle</button>
      </article>
    `
    )
    .join("");
}

function loadProducts() {
  if (isLoading) return;
  isLoading = true;

  let endIndex = startIndex + productsPerLoad;

  if (endIndex >= currentProducts.length) {
    const remainingProducts = currentProducts.slice(startIndex);
    const productsFromStart = currentProducts.slice(
      0,
      productsPerLoad - remainingProducts.length
    );
    renderProducts([...remainingProducts, ...productsFromStart]);
    startIndex = productsFromStart.length;
  } else {
    renderProducts(currentProducts.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  isLoading = false;
}

let scrollTimeout;
productListContainer.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    const threshold = 100;
    if (
      productListContainer.scrollTop + productListContainer.clientHeight >=
      productListContainer.scrollHeight - threshold
    ) {
      loadProducts();
    }
  }, 100);
});

function filterProducts() {
  const categoria = filterSelect.value;
  const maxPrice = maxPriceInput.value;

  currentProducts = products.filter((producto) => {
    let matchesCategory = categoria === "todos" || producto.tipo === categoria;
    let matchesPrice = !maxPrice || producto.precio <= Number(maxPrice);
    return matchesCategory && matchesPrice;
  });

  productListContainer.innerHTML = "";
  startIndex = 0;
  loadProducts();
}

document
  .getElementById("btn-filtrar")
  .addEventListener("click", filterProducts);

document.getElementById("btn-limpiar").addEventListener("click", () => {
  filterSelect.value = "todos";
  maxPriceInput.value = "";
  productListContainer.innerHTML = "";
  currentProducts = products;
  startIndex = 0;
  loadProducts();
});

productListContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ver-detalle")) {
    const productId = e.target.dataset.id;
    const product = products.find((p) => p.id == productId);
    showProductDetail(product);
  }
});

function showProductDetail(product) {
  detailContainer.style.display = "block";
  document.getElementById("info-producto").dataset.id = product.id; 
  document.getElementById("info-producto").innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre}">
    <h2>${product.nombre}</h2>
    <p>Precio: $${product.precio}</p>
    <p>Cantidad Disponible: ${product.cantidad}</p>
    <p>Proveedor: ${product.proveedor}</p>
    <p>Ubicación: ${product.ubicación}</p>
  `;
}

document.getElementById("btn-agregar-carrito").addEventListener("click", () => {
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const productoId = document.getElementById("info-producto").dataset.id;

  if (carrito.length >= 20) {
    alert("No puedes agregar más de 20 productos al carrito.");
    return;
  }

  const producto = products.find((p) => p.id == productoId);
  const productoConCantidad = { ...producto, cantidad };

  carrito.push(productoConCantidad);
  guardarCarrito();

  alert("Producto agregado al carrito.");
  detailContainer.style.display = "none"; 
});

document
  .getElementById("btn-completar-compra")
  .addEventListener("click", () => {
    window.location.href = "carrito.html";
  });

document.getElementById("btn-cancelar-compra").addEventListener("click", () => {
  window.location.href = "requerimientos.html";
});

loadProducts();
