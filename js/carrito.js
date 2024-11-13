const KEY_CARRITO = "carrito";
let carrito = JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];
const PRESUPUESTO_MAXIMO = 500000;
let compraEnProgreso = false;

function guardarCarrito() {
  localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
}

function renderizarCarrito() {
  const tablaBody = document.querySelector("#tabla-productos tbody");
  tablaBody.innerHTML = "";
  let totalProductos = 0;
  let totalCompra = 0;

  carrito.forEach((producto, index) => {
    const totalProducto = producto.precio * producto.cantidad;
    totalProductos += producto.cantidad;
    totalCompra += totalProducto;

    const fila = `
      <tr>
        <td>${producto.nombre}</td>
        <td><img src="${producto.imagen}" width="50"></td>
        <td>${producto.precio}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.tipo}</td>
        <td>${producto.proveedor}</td>
        <td>Disponible</td>
        <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
      </tr>
    `;
    tablaBody.innerHTML += fila;
  });

  document.getElementById("total-productos").textContent = totalProductos;
  document.getElementById("total-compra").textContent = totalCompra + " COP";
  const totalPagar = totalCompra + 15000;
  document.getElementById("total-pagar").textContent = totalPagar + " COP";

  return { totalProductos, totalCompra, totalPagar };
}

document.getElementById("numero-tarjeta").addEventListener("input", (e) => {
  e.target.value = e.target.value
    .replace(/\D/g, "") 
    .replace(/(.{4})/g, "$1-") 
    .slice(0, 19); 
});

function eliminarProducto(index) {
  if (compraEnProgreso) {
    alert("Compra en progreso, espera a que se complete el proceso.");
    return;
  }
  carrito.splice(index, 1);
  guardarCarrito();
  renderizarCarrito();
}

document.getElementById("confirmar-compra").addEventListener("click", (e) => {
  e.preventDefault();

  if (compraEnProgreso) {
    alert("La compra ya está en proceso. Por favor espera.");
    return;
  }

  const numeroTarjeta = document
    .getElementById("numero-tarjeta")
    .value.replace(/-/g, "")
    .trim();
  const fechaExpiracion = document
    .getElementById("fecha-expiracion")
    .value.trim();
  const codigoSeguridad = document
    .getElementById("codigo-seguridad")
    .value.trim();
  const nombreTitular = document.getElementById("nombre-titular").value.trim();
  const regexFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;

  if (!numeroTarjeta || numeroTarjeta.length !== 16 || isNaN(numeroTarjeta)) {
    alert("Número de tarjeta inválido. Debe contener 16 dígitos.");
    return;
  }
  if (!regexFecha.test(fechaExpiracion)) {
    alert("Fecha de expiración inválida. Debe ser en formato MM/AA.");
    return;
  }
  if (
    !codigoSeguridad ||
    codigoSeguridad.length !== 3 ||
    isNaN(codigoSeguridad)
  ) {
    alert("Código de seguridad inválido. Debe contener 3 dígitos.");
    return;
  }
  if (!nombreTitular) {
    alert("Por favor, ingrese el nombre del titular.");
    return;
  }

  const { totalProductos, totalCompra, totalPagar } = renderizarCarrito();

  if (totalProductos > 20) {
    alert("No puedes comprar más de 20 productos.");
    return;
  }

  if (totalPagar > PRESUPUESTO_MAXIMO) {
    alert("El total de la compra excede el presupuesto permitido.");
    return;
  }

  const botonConfirmar = document.getElementById("confirmar-compra");
  botonConfirmar.disabled = true;
  compraEnProgreso = true;

  new Promise((resolve, reject) => {
    const tiempoEspera = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
    setTimeout(() => {
      if (totalPagar <= PRESUPUESTO_MAXIMO && totalProductos <= 20) {
        resolve("Compra exitosa");
      } else {
        reject("Error en la compra: no se cumplen los requisitos");
      }
    }, tiempoEspera);
  })
    .then((mensaje) => {
      alert(mensaje);
      localStorage.removeItem(KEY_CARRITO); 
      window.location.href = "requerimientos.html"; 
    })
    .catch((error) => {
      alert(error);
      botonConfirmar.disabled = false;
      compraEnProgreso = false;
    });
});

document.getElementById("limpiar-campos").addEventListener("click", () => {
  document.getElementById("pago-form").reset();
});

renderizarCarrito();

document.getElementById("seguir-comprando").addEventListener("click", () => {
  if (compraEnProgreso) {
    alert("Compra en progreso, espera a que se complete el proceso.");
  } else {
    window.location.href = "products.html";
  }
});

document.getElementById("cancelar-compra").addEventListener("click", () => {
  if (compraEnProgreso) {
    alert("Compra en progreso, espera a que se complete el proceso.");
  } else {
    window.location.href = "index.html";
  }
});
