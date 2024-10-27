import { products } from "./products.js";

const productListContainer = document.getElementById("lista-de-productos");

function renderProducts(productsToRender) {
  if (!productsToRender.length) {
    productListContainer.innerHTML =
      "<p>No se encontraron productos en esta categoría.</p>";
    return;
  }

  productListContainer.innerHTML = productsToRender
    .map(
      (producto) => `
      <article class="product-item">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto">
        <h2>${producto.nombre}</h2>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
        <p><strong>Proveedor:</strong> ${producto.proveedor}</p>
        <p><strong>Ubicación:</strong> ${producto.ubicación}</p>
        <button class="add-to-cart" data-id="${producto.id}">Agregar al Carrito</button>
      </article>
    `
    )
    .join("");
}

function filterProducts(tipo) {
  console.log("Filtering by:", tipo);
  if (tipo === "todos") {
    renderProducts(products);
  } else {
    const filteredProducts = products.filter(
      (producto) => producto.tipo.toLowerCase() === tipo.toLowerCase()
    );
    console.log("Filtered products:", filteredProducts);
    renderProducts(filteredProducts);
  }
}

const filterButtons = {
  "btn-todos": "todos",
  "btn-alarmas": "Alarmas",
  "btn-cerraduras": "Cerraduras",
  "btn-camaras": "Cámaras",
  "btn-sensores": "Sensores",
};

Object.entries(filterButtons).forEach(([buttonId, filterType]) => {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", () => {
      console.log(`Button ${buttonId} clicked`);
      filterProducts(filterType);
    });
  } else {
    console.error(`Button with id ${buttonId} not found`);
  }
});

renderProducts(products);

function completarCompra() {
  window.location.href = "carrito.html";
}

const completarCompraBtn = document.getElementById("completar-compra");
if (completarCompraBtn) {
  completarCompraBtn.addEventListener("click", completarCompra);
}
